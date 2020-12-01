import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { distTimeBudget } from './tideGlobalMethods.js';
import { whatIsBatch, whatIsBatchX } from './searchOps.js';
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


export function deliveryState(bEnd, bFinish) {
  const localEnd = moment.tz(bEnd, Config.clientTZ);
  
  const endWork = localEnd.isWorkingDay() ?
                    localEnd.clone().endOf('day').lastWorkingTime() :
                    localEnd.clone().lastWorkingTime();
  const salesEnd = endWork.format();
  
  const shipAim = localEnd.isShipDay() ?
                    localEnd.clone().startOf('day').nextShippingTime().format() :
                    localEnd.clone().lastShipDay().startOf('day').nextShippingTime().format();
                    
  const shipDue = localEnd.isShipDay() ?
                    localEnd.clone().endOf('day').lastShippingTime() :
                    localEnd.clone().lastShippingTime();
  
  const didFinish = moment(bFinish).tz(Config.clientTZ);
  const didFinishNice = didFinish.format();
  
  const lateLate = didFinish.isAfter(endWork);
  const lateDay = didFinish.isSame(endWork, 'day');
  
  const eHrGp = Math.abs( endWork.diff(didFinish, 'hours') );
  const eHourS = eHrGp == 0 || eHrGp > 1 ? 'hours' : 'hour';
  
  const eDyGp = Math.abs( round1Decimal( endWork.workingDiff(didFinish, 'days', true) ) );
  const eDayS = eDyGp == 0 || eDyGp > 1 ? 'days' : 'day';
  
  const fillZ = !lateLate ?
                    lateDay ?   // ON TIME
                      [ null, null, 'on time' ] : [ eDyGp, eDayS, 'early' ] 
                  : 
                    lateDay ?  // LATE
                      [  eHrGp, eHourS, 'overtime' ] : [ eDyGp, eDayS, 'late' ];
  
  const shipLate = didFinish.isAfter(shipDue);
  
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
  
  const fillZ = !lateLate ?
                    lateDay ? 'on time' : 'early' 
                  : 
                    lateDay ? 'overtime' :  'late';
  
  const shipLate = didFinish.isAfter(shipDue);
  
  const hrGp = Math.abs( shipDue.workingDiff(didFinish, 'hours') );
  
  const shipZ = !shipLate || hrGp == 0 ?
                    hrGp <= Config.dropShipBffr ? 'on time' : 'early' 
                  : 
                    hrGp <= Config.dropShipBffr ? 'late' : 'late';
  
  return [ fillZ, shipZ ];
}

  
function weekDoneAnalysis(rangeStart, rangeEnd) {
  
  const app = AppDB.findOne({orgKey: Meteor.user().orgKey});
  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
    
  let batchMetrics = [];
  
  BatchDB.find({
    orgKey: Meteor.user().orgKey, 
    finishedAt: { 
      $gte: new Date(rangeStart),
      $lte: new Date(rangeEnd) 
    }
  })
  .forEach( gf => {
    const batchNum = gf.batch;
    const describe = whatIsBatch(batchNum)[0].join(' ');
    const salesOrder = gf.salesOrder;
    const itemQuantity = gf.items.length;
    const ncQuantity = gf.nonCon.filter( n => !n.trash ).length;
    const ncRate = ( ncQuantity / itemQuantity ).toFixed(1, 10);
    const endAlter = !gf.altered ? 'n/a' :
      gf.altered.filter( a => a.changeKey === 'end' ).length;
    
    // duration between finish and fulfill
    const deliveryResult = deliveryState(gf.end, gf.finishedAt);
    // salesEnd, shipAim, didFinishNice, fillZ, shipZ
    const salesEnd = deliveryResult[0];
    const shipDue = deliveryResult[1];
    const localFinish = deliveryResult[2];
    const fillOnTime = deliveryResult[3].join(" ");
    const shipOnTime = deliveryResult[4].join(" ");
    
    // check for over quote
    const distTB = distTimeBudget(gf.tide, gf.quoteTimeBudget, itemQuantity, itemQuantity);
    //return [ tidePerItem, quotePerItem, quoteMNtide, tidePCquote ];
    
    const overQuote = distTB === undefined || isNaN(distTB[2]) ? 'n/a' :
                      distTB[2] < 0 ? 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) over` : 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) under`;
    
    batchMetrics.push([
      batchNum, describe, 
      salesOrder, itemQuantity, ncRate,
      salesEnd, shipDue, endAlter, localFinish,
      fillOnTime, shipOnTime, overQuote
    ]);
  });
  
  const generalFindX = XBatchDB.find({
    orgKey: Meteor.user().orgKey, 
    completedAt: { 
      $gte: new Date(rangeStart),
      $lte: new Date(rangeEnd) 
    }
  }).fetch();
  
  for(let gf of generalFindX) {
    const batchNum = gf.batch;
    const describe = whatIsBatchX(batchNum)[0].join(' ');
    const salesOrder = gf.salesOrder;
    const itemQuantity = gf.quantity;
    const ncQuantity = gf.nonconformaces.filter( n => !n.trash ).length;
    const ncRate = ( ncQuantity / itemQuantity ).toFixed(1, 10);
    const endAlter = gf.altered.filter( a => a.changeKey === 'salesEnd' ).length;
    
    const deliveryResult = deliveryState(gf.salesEnd, gf.completedAt);
    const salesEnd = deliveryResult[0];
    const shipDue = deliveryResult[1];
    const localComplete = deliveryResult[2];
    const fillOnTime = deliveryResult[3].join(" ");
    const shipOnTime = deliveryResult[4].join(" ");
    
    // check for over quote
    const distTB = distTimeBudget(gf.tide, gf.quoteTimeBudget, itemQuantity, itemQuantity);
    //return [ tidePerItem, quotePerItem, quoteMNtide, tidePCquote ];
    
    const overQuote = distTB === undefined || isNaN(distTB[2]) ? 'n/a' :
                      distTB[2] < 0 ? 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) over` : 
                      `${Math.abs(distTB[2])} hours (${Math.abs(distTB[3])}%) under`;
    // const percentOvUn = distTB === undefined ? 'n/a' : 
    //                     distTB[3] < 0 ? 
    //                     `${Math.abs(distTB[3])}% over` : 
    //                     `${Math.abs(distTB[3])}% under`;
    
    batchMetrics.push([
      batchNum, describe, 
      salesOrder, itemQuantity, ncRate,
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
    
    const touchedB = BatchDB.find({
      orgKey: Meteor.user().orgKey,
      items: { $elemMatch: { finishedAt: {
      $gte: new Date(localDate.startOf('day').format()),
      $lte: new Date(localDate.endOf('day').format())
    }}}
    }).fetch();
    
    let itemsMatch = [];
    
    for(let iB of touchedB) {
      const mItems = iB.items.filter( i => i.finishedAt && localDate.isSame(i.finishedAt, 'day') );
      const describe = whatIsBatch(iB.batch)[0].join(' ');
      
      for(let mI of mItems) {
        const time = moment.tz(mI.finishedAt, Config.clientTZ).format('HH:mm:ss');
        
        itemsMatch.push([ 
          iB.batch, iB.salesOrder, describe, mI.serial, time
        ]);
      }
    }
      
    return itemsMatch;
  },
  
  
});