import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { distTimeBudget } from './tideGlobalMethods.js';
import { whatIsBatchX } from './searchOps.js';
import { round1Decimal } from './calcOps';

import Config from '/server/hardConfig.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

export function calcShipDay( nowDay, futureDay ) {
  const endDay = moment.tz(futureDay, Config.clientTZ);

  const shipAim = endDay.isShipDay() ?
                    endDay.clone().startOf('day').nextShippingTime() :
                    endDay.clone().lastShipDay().startOf('day').nextShippingTime();

  const shipDue = endDay.isShipDay() ?
                    endDay.clone().endOf('day').lastShippingTime() :
                    endDay.clone().lastShippingTime();

  const endWork = endDay.isWorkingDay() ?
                    endDay.clone().endOf('day').lastWorkingTime() :
                    endDay.clone().lastWorkingTime();
  const salesEnd = endWork.format();
  
  const lateLate = nowDay.clone().isAfter(endWork);
  const shipLate = nowDay.clone().isAfter(shipDue);
  
  return [ salesEnd, shipAim, lateLate, shipLate ];
}

function coreDlvDays(bEnd, bFinish) {
  const localEnd = moment.tz(bEnd, Config.clientTZ);
  
  const endWork = localEnd.isWorkingDay() ?
                    localEnd.clone().endOf('day').lastWorkingTime() :
                    localEnd.clone().lastWorkingTime();
  
  const shipDue = localEnd.isShipDay() ?
                    localEnd.clone().endOf('day').lastShippingTime() :
                    localEnd.clone().lastShippingTime();
                    
  const didFinish = moment(bFinish).tz(Config.clientTZ);
  
  const lateLate = didFinish.isAfter(endWork);
  const lateDay = didFinish.isSame(endWork, 'day');
  
  const shipLate = didFinish.isAfter(shipDue);
  
  return [ localEnd, endWork, shipDue, didFinish, lateLate, lateDay, shipLate ];
}

export function deliveryState(bEnd, bFinish) {
  const dlvDy = coreDlvDays(bEnd, bFinish);
  
  const localEnd = dlvDy[0];
  
  const endWork = dlvDy[1];
  const salesEnd = endWork.format();
  
  const shipAim = localEnd.isShipDay() ?
                    localEnd.clone().startOf('day').nextShippingTime().format() :
                    localEnd.clone().lastShipDay().startOf('day').nextShippingTime().format();
                    
  const shipDue = dlvDy[2];
  
  const didFinish = dlvDy[3];
  const didFinishNice = didFinish.format();
  
  const lateLate = dlvDy[4];
  const lateDay = dlvDy[5];
  
  const eHrGp = Math.abs( endWork.diff(didFinish, 'hours') );
  const eHourS = eHrGp == 0 || eHrGp > 1 ? 'hours' : 'hour';
  
  const eDyGp = Math.abs( round1Decimal( endWork.workingDiff(didFinish, 'days', true) ) );
  const eDayS = eDyGp == 0 || eDyGp > 1 ? 'days' : 'day';
  
  const fillZ = !lateLate || eHrGp == 0 ?
                    lateDay ?   // ON TIME
                      [ null, null, 'on time' ] : [ eDyGp, eDayS, 'early' ] 
                  : 
                    lateDay ?  // LATE
                      [  eHrGp, eHourS, 'overtime' ] : [ eDyGp, eDayS, 'late' ];
  
  const shipLate = dlvDy[6];
  
  const hrGp = Math.abs( shipDue.workingDiff(didFinish, 'hours') );
  const hourS = hrGp == 0 || hrGp > 1 ? 'hours' : 'hour';
  
  const dyGp = Math.abs( Math.round( shipDue.workingDiff(didFinish, 'days', true) ) );
  const dayS = dyGp == 0 || dyGp > 1 ? 'days' : 'day';
  
  const shipZ = !shipLate || hrGp == 0 ?
                    hrGp <= Config.dropShipBffr ?   // ON TIME
                      [ null, null, 'on time' ] : [ dyGp, dayS, 'early' ] 
                  : 
                    hrGp <= Config.dropShipBffr ?  // LATE
                      [ hrGp, hourS, 'late' ] : [ dyGp, dayS, 'late' ];
  
  return [ salesEnd, shipAim, didFinishNice, fillZ, shipZ ];
}

export function deliveryBinary(bEnd, bFinish) {
  const dlvDy = coreDlvDays(bEnd, bFinish);
  const shipDue = dlvDy[2];
  const didFinish = dlvDy[3];
  const lateLate = dlvDy[4];
  const lateDay = dlvDy[5];
  
  const fillZ = !lateLate ?
                  lateDay ? 'on time' : 'early' : 
                  lateDay ? 'overtime' : 'late';
  
  const shipLate = dlvDy[6];
  
  const hrGp = Math.abs( shipDue.workingDiff(didFinish, 'hours') );
  
  const shipZ = !shipLate || hrGp == 0 ?
                  hrGp <= Config.dropShipBffr ? 'on time' : 'early' : 
                  hrGp <= Config.dropShipBffr ? 'late' : 'late';
  
  return [ fillZ, shipZ ];
}

  
function weekDoneAnalysis(rangeStart, rangeEnd) {
  const accessKey = Meteor.user().orgKey;
  
  const app = AppDB.findOne({orgKey:accessKey}, {fields:{'nonWorkDays':1}});
  if( Array.isArray(app.nonWorkDays) ) {  
    moment.updateLocale('en', { holidays: app.nonWorkDays });
  }
    
  let batchMetrics = [];
  
  const generalFindX = XBatchDB.find({
    orgKey: accessKey, 
    completedAt: { 
      $gte: new Date(rangeStart),
      $lte: new Date(rangeEnd) 
    }
  }).fetch();
  
  for(let gf of generalFindX) {
    const batchNum = gf.batch;
    const describe = whatIsBatchX(batchNum)[0].join(' ');
    const salesOrder = gf.salesOrder;
    const allQuantity = gf.quantity;
    
    const srs = XSeriesDB.findOne({batch: gf.batch});
    const itemQuantity = srs ? srs.items.length : 0;
    const ncQuantity = srs ? srs.nonCon.filter( n => !n.trash ).length : 0;
    const ncRate = ( ncQuantity / itemQuantity ).toFixed(1, 10);
    const endAlter = gf.altered.filter( a => a.changeKey === 'salesEnd' ).length;
    
    const deliveryResult = deliveryState(gf.salesEnd, gf.completedAt);
    const salesEnd = deliveryResult[0];
    const shipDue = deliveryResult[1];
    const localComplete = deliveryResult[2];
    const fillOnTime = deliveryResult[3].join(" ");
    const shipOnTime = deliveryResult[4].join(" ");
    
    // check for over quote
    const distTB = distTimeBudget(gf.tide, gf.quoteTimeBudget, allQuantity, allQuantity);
    //returns [ tidePerItem, quotePerItem, quoteMNtide, tidePCquote ];
    
    const overQuote = distTB === undefined || isNaN(distTB[2]) ? 'n/a' :
                      distTB[2] < 0 ? 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) over` : 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) under`;
    
    batchMetrics.push([
      batchNum, describe, 
      salesOrder, allQuantity, ncRate,
      salesEnd, shipDue, endAlter, localComplete,
      fillOnTime, shipOnTime, overQuote
    ]);
  }
  
  return batchMetrics;
}

  
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
  
  fetchFinishOnDay(dateString) {
    
    const localDate = moment.tz(dateString, Config.clientTZ);
    
    let itemsMatch = [];
    
    const touchedSRS = XSeriesDB.find({
      orgKey: Meteor.user().orgKey,
      items: { $elemMatch: { completedAt: {
      $gte: new Date(localDate.startOf('day').format()),
      $lte: new Date(localDate.endOf('day').format())
    }}}
    }).fetch();
    
    for(let srs of touchedSRS) {
      const items = srs.items.filter( i => i.completed && localDate.isSame(i.completedAt, 'day') );
      const describe = whatIsBatchX(srs.batch)[0].join(' ');
      const batchX = XBatchDB.findOne({batch: srs.batch});
      const salesOrder = batchX ? batchX.salesOrder : '';
      
      for(let ic of items) {
        const time = moment.tz(ic.completedAt, Config.clientTZ).format('HH:mm:ss');
        
        itemsMatch.push([ 
          srs.batch, salesOrder, describe, ic.serial, time
        ]);
      }
    }
    return itemsMatch;
  },
  
  
});