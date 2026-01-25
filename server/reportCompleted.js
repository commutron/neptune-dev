import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';

import { syncLocale, countMulti, noIg } from '/server/utility.js';
import { getShipAim, getShipDue, getEndWork } from '/server/shipOps';
import { distTimeBudget } from './tideGlobalMethods.js';
import { whatIsBatchX } from './searchOps.js';
import { asRate, round1Decimal, diffTrend, percentOf } from './calcOps';


export function calcShipDay( batchId, nowDay, futureDay ) {
  // console.time('calcShipDay_run_time');
  const shipAim = getShipAim(batchId, futureDay);

  const shipDue = getShipDue(batchId, futureDay);

  const endWork = getEndWork(batchId, futureDay);
  
  const lateLate = nowDay.clone().isAfter(endWork);
  const shipLate = nowDay.clone().isAfter(shipDue);
  // console.timeEnd('calcShipDay_run_time');
  
  return [ endWork, shipAim, lateLate, shipLate ];
}

function coreDlvDays(batchId, bEnd, bFinish) {
  const shipDue = getShipDue(batchId, bEnd);

  const endWork = getEndWork(batchId, bEnd);
  
  const didFinish = bFinish ? moment(bFinish).tz(Config.clientTZ) : null;
  const cleanFin = didFinish ? didFinish.format() : null;
  
  const lateLate = didFinish ? didFinish.isAfter(endWork) : null;
  const lateDay = didFinish ? didFinish.isSame(endWork, 'day') : null;
  
  const shipLate = didFinish ? didFinish.isAfter(shipDue) : null;
  
  return [ endWork, shipDue, cleanFin, lateLate, lateDay, shipLate ];
}

export function deliveryState(batchId, bEnd, bFinish) {
  const dlvDy = coreDlvDays(batchId, bEnd, bFinish);
  
  const endWork = dlvDy[0];
  
  const shipAim = getShipAim(batchId, bEnd);
  
  const shipDue = dlvDy[1];
  
  const didFinish = dlvDy[2];
  
  const lateLate = dlvDy[3];
  const lateDay = dlvDy[4];
  
  const eHrGp = Math.abs( moment(endWork).diff(didFinish, 'hours') );
  const eHourS = eHrGp == 0 || eHrGp > 1 ? 'hours' : 'hour';
  
  const eDyGp = Math.abs( round1Decimal( moment(endWork).workingDiff(didFinish, 'days', true) ) );
  const eDayS = eDyGp == 0 || eDyGp > 1 ? 'days' : 'day';
  
  const fillZ = !lateLate || eHrGp == 0 ?
                    lateDay ?   // ON TIME
                      [ null, null, 'on time' ] : [ eDyGp, eDayS, 'early' ] 
                  : 
                    lateDay ?  // LATE
                      [  eHrGp, eHourS, 'overtime' ] : [ eDyGp, eDayS, 'late' ];
  
  const shipLate = dlvDy[5];
  
  const hrGp = Math.abs( moment(shipDue).workingDiff(didFinish, 'hours') );
  const hourS = hrGp == 0 || hrGp > 1 ? 'hours' : 'hour';
  
  const dyGp = Math.abs( Math.round( moment(shipDue).workingDiff(didFinish, 'days', true) ) );
  const dayS = dyGp == 0 || dyGp > 1 ? 'days' : 'day';
  
  const shipZ = !shipLate || hrGp == 0 ?
                    hrGp <= Config.dropShipBffr ?   // ON TIME
                      [ null, null, 'on time' ] : [ dyGp, dayS, 'early' ] 
                  : 
                    hrGp <= Config.dropShipBffr ?  // LATE
                      [ hrGp, hourS, 'late' ] : [ dyGp, dayS, 'late' ];
  
  return [ endWork, shipAim, didFinish, fillZ, shipZ ];
}

export function deliveryBinary(batchId, bEnd, bFinish) {
  const dlvDy = coreDlvDays(batchId, bEnd, bFinish);
  const shipDue = dlvDy[1];
  const didFinish = dlvDy[2];
  const lateLate = dlvDy[3];
  const lateDay = dlvDy[4];
  
  const fillZ = !lateLate ?
                  lateDay ? 'on time' : 'early' : 
                  lateDay ? 'overtime' : 'late';
  
  const shipLate = dlvDy[5];
  
  const hrGp = didFinish ? Math.abs( moment(shipDue).workingDiff(didFinish, 'hours') ) : 0;
  
  const shipZ = !shipLate || hrGp == 0 ?
                  hrGp <= Config.dropShipBffr ? 'on time' : 'early' : 'late';
  
  return [ fillZ, shipZ ];
}

export function deliveryRatio(srsBatch, shipDue, bFinish) {
  const didFinish = bFinish ? moment(bFinish).tz(Config.clientTZ) : null;
  const allOnTime = didFinish ? didFinish.isBefore(shipDue) : false;
  
  let totalItem = 0;
  let ontimeItm = 0;
  
  if(srsBatch) {
    const srs = XSeriesDB.findOne({batch: srsBatch},{fields:{'items.completedAt':1}});
    if(srs) {
      totalItem += srs.items.length;
      if(allOnTime) {
        ontimeItm += srs.items.length;
      }else{
        for(let i of srs.items) {
          if(i.completedAt) {
            new Date(i.completedAt) < new Date(shipDue) ? ontimeItm++ : null;
          }
        }
      }
    }
  }
  return [ totalItem, ontimeItm ];
}

  
function weekDoneAnalysis(rangeStart, rangeEnd) {
  const accessKey = Meteor.user().orgKey;
  syncLocale(accessKey);
    
  let batchMetrics = [];
  
  const generalFindX = XBatchDB.find({
    orgKey: accessKey, 
    completedAt: { 
      $gte: new Date(rangeStart),
      $lte: new Date(rangeEnd) 
    }
  },{fields:{
    'batch':1,'salesOrder':1,'salesEnd':1,'quoteTimeBudget':1,
    'completedAt':1,'quantity':1,'tide':1,'altered':1
  }}).fetch();
  
  for(let gf of generalFindX) {
    const batchNum = gf.batch;
    const whatIs = whatIsBatchX(batchNum);
    const describe = whatIs[0].join(' ');
    const salesOrder = gf.salesOrder;
    const allQuantity = gf.quantity;
    
    const srs = XSeriesDB.findOne({batch: gf.batch});
    const units = srs ? srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0 : 0;
    // -- nc rate calculation filter --
    const ncArr = srs ? srs.nonCon.filter( n => !n.trash && !(n.inspect && !n.fix) ) : [];
    const ncQty = srs ? countMulti(ncArr) : 0;
    
    const ncRate = ncQty ? asRate(ncQty, units) : 0;
    const endAlter = gf.altered.filter( a => a.changeKey === 'salesEnd' ).length;
    
    const deliveryResult = deliveryState(gf._id, gf.salesEnd, gf.completedAt);
    const salesEnd = deliveryResult[0];
    const shipDue = deliveryResult[1];
    const localComplete = deliveryResult[2];
    const fillOnTime = deliveryResult[3].join(" ");
    const shipOnTime = deliveryResult[4].join(" ");
    
    const distTB = distTimeBudget(gf.tide, gf.quoteTimeBudget, allQuantity);
    //returns [ tidePerItem, quotePerItem, quoteMNtide, tidePCquote ];
    
    const overQuote = distTB === undefined || isNaN(distTB[2]) ? 'n/a' :
                      distTB[2] < 0 ? 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) over` : 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) under`;
    
    batchMetrics.push([
      [ batchNum, whatIs[2] ], describe,
      salesOrder, allQuantity, ncRate,
      salesEnd, shipDue, endAlter, localComplete,
      fillOnTime, shipOnTime, overQuote
    ]);
  }
  
  return batchMetrics;
}

const filterCacheYear = (cache, year)=> cache.dataSet.filter( c => moment(c.month).year() === year );

const findCacheMonth = (cache, month)=> cache.find( c => moment(c.month).month() === month );

Meteor.methods({
  
  reportOnCompleted(yearNum, weekNum) {
    try {
      const requestLocal = moment().tz(Config.clientTZ).set({'year': yearNum, 'week': weekNum});
      
      const rangeStart = requestLocal.clone().startOf('week').toISOString();
      const rangeEnd = requestLocal.clone().endOf('week').toISOString();
      
      return weekDoneAnalysis(rangeStart, rangeEnd);

    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  reportMonthsFromCache(yearNum) {
    const allCache = CacheDB.findOne({
                      orgKey: Meteor.user().orgKey, 
                      dataName: 'doneBatchLiteMonthsWeeks'
                    });
    if(!allCache) {
      return null;
    }else{
      const yearCache = filterCacheYear(allCache, yearNum);
      
      let yearSet = [];
      
      for( let m = 0; m < 12; m++) {
      
        const monthCache = findCacheMonth(yearCache, m);
        
        let monthSet = [];
        
        let totalOnTime = 0;
        
        let totalOnBdgt = 0;
        
        let totalIsDone = 0;
        
        if(monthCache) {
          for( let week of monthCache.weeks ) {
            
            totalOnTime += week.y[0];
            totalOnBdgt += week.y[4];
            totalIsDone += ( week.y[0] + week.y[1] );
            
            monthSet.push({
              onTime : week.y[0],
              missed : week.y[0] > week.y[2],
              onBdgt : week.y[4],
              isDone : week.y[0] + week.y[1],
            });
            
          }
        }
  
        const percentOnTime = percentOf(totalIsDone, totalOnTime);
        
        const percentOnBdgt = percentOf(totalIsDone, totalOnBdgt);
        
        yearSet.push({
          monthNum : m,
          monthSet,
          totalOnTime,
          totalOnBdgt,
          totalIsDone,
          percentOnTime,
          percentOnBdgt
        });
      
      }

      return yearSet;
    }
  },
  
  reportItemsDueMonthsCache(yearNum) {
    const allCache = CacheDB.findOne({
                      orgKey: Meteor.user().orgKey, 
                      dataName: 'doneItemsLiteMonthsWeeks'
                    });
    if(!allCache) {
      return null;
    }else{
      const yearCache = filterCacheYear(allCache, yearNum);
      
      let yearSet = [];
      
      for( let m = 0; m < 12; m++) {
      
        const monthCache = findCacheMonth(yearCache, m);
        
        let monthSet = [];
        
        let totalWasDue = 0;
        let totalOnTime = 0;
        
        if(monthCache) {
          for( let week of monthCache.weeks ) {
            
            totalWasDue += week.y[0];
            totalOnTime += week.y[1];
            
            monthSet.push({
              wasDue : week.y[0],
              onTime : week.y[1]
            });
          }
        }
  
        const percentOnTime = percentOf(totalWasDue, totalOnTime);
        
        yearSet.push({
          monthNum : m,
          monthSet,
          totalWasDue,
          totalOnTime,
          percentOnTime
        });
      }
      return yearSet;
    }
  },
  
  fetchFinishOnDay(dateString) {
    
    const localDate = moment.tz(dateString, Config.clientTZ);
    let itemsMatch = [];
    
    const touchedSRS = XSeriesDB.find({
      orgKey: Meteor.user().orgKey,
      items: { $elemMatch: { completedAt: {
      $gte: new Date(localDate.startOf('day').format()),
      $lte: new Date(localDate.endOf('day').format())
    }}}
    },{fields:{'batch':1,'items.serial':1,'items.completed':1,'items.completedAt':1}}
    ).fetch();
    
    for(let srs of touchedSRS) {
      const items = srs.items.filter( i => i.completed && localDate.isSame(i.completedAt, 'day') );
      const whatIs = whatIsBatchX(srs.batch);
      const describe = whatIs[0].join(' ');
      const batchX = XBatchDB.findOne({batch: srs.batch},{fields:{'salesOrder':1}});
      const salesOrder = batchX ? batchX.salesOrder : '';
      
      for(let ic of items) {
        const time = moment.tz(ic.completedAt, Config.clientTZ).format('HH:mm:ss');
        
        itemsMatch.push([ 
          [ srs.batch, whatIs[2] ], salesOrder, describe, ic.serial, time
        ]);
      }
    }
    return itemsMatch;
  },
  
  fetchWeekAvgSerial(accessKey) {
    if(accessKey) {
      const now = moment.tz(Config.clientTZ);
      const xid = noIg();
      
      let itemsMatch = [];
      
      const touchedSRS = XSeriesDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        items: { $elemMatch: { completedAt: {
          $gte: new Date(now.startOf('week').format()),
          $lte: new Date(now.endOf('week').format())
        }}}
      },{fields:{'items.completed':1,'items.completedAt':1}}).fetch();
      
      for(let srs of touchedSRS) {
        const items = srs.items.filter( i => i.completed && now.isSame(i.completedAt, 'week') );
        for(let ic of items) {
          itemsMatch.push(moment(ic.completedAt).day());
        }
      }
    
      const totalI = itemsMatch.length;
      const days = [...new Set( itemsMatch ) ].length;
      
      const avgperday = totalI > 0 ? totalI / days : 0;
  
      const lastavg = CacheDB.findOne({dataName: 'avgDayItemFin'});
      const runningavg = lastavg ? lastavg.dataNum : 0;
      
      const newavg = !lastavg ? avgperday :
              Math.round( ( runningavg + avgperday ) / 2 );
      
      const trend = diffTrend(newavg, runningavg);
      
      CacheDB.upsert({dataName: 'avgDayItemFin'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'avgDayItemFin',
          dataNum: Number(newavg),
          dataTrend: trend
      }});
    }
  },
  
  
});