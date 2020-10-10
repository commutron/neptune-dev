import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { distTimeBudget } from './tideGlobalMethods.js';
import { whatIsBatch, whatIsBatchX } from './searchOps.js';
// import { min2hr } from './calcOps';

import Config from '/server/hardConfig.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});
  
  // export function explainShipGap(hourGap) {
  //   const hrGp = Math.abs(hourGap);
  //   const hourS = hrGp > 1 ? 'hours' : 'hour';
  //   const dyGp = Math.abs( Math.round(dayGap) );
  //   const dayS = dyGp > 1 ? 'days' : 'day';
    
  //   const gapZone = ( !isLate || hrGp < Config.shipLateAllow ) ?
  //                     hrGp < Config.maxShift ?   // ON TIME
  //                       'on time' : `${dyGp} ${dayS} early` 
  //                     : 
  //                     hrGp < Config.maxShift ?  // LATE
  //                     `${hrGp} ${hourS} late` : `${dyGp} ${dayS} late`;
  //   return gapZone;
  // }
  
  export function deliveryState(bEnd, bFinish, clientTZ) {
    const localEnd = moment.tz(bEnd, clientTZ);
    
    const salesEnd = localEnd.isWorkingDay() ?
                      localEnd.clone().endOf('day').lastWorkingTime().format() :
                      localEnd.clone().lastWorkingTime().format();
    const shipDue = localEnd.isShipDay() ?
                      localEnd.clone().nextShippingTime().format() :
                      localEnd.clone().lastShippingTime().format();
    
    const didFinish = moment(bFinish).tz(clientTZ).format();
      
    const isLate = moment(didFinish).isAfter(shipDue);
    const hourGap = moment(shipDue).workingDiff(didFinish, 'hours');
    const dayGap = moment(shipDue).workingDiff(didFinish, 'days', true);
    
    const hrGp = Math.abs(hourGap);
    const hourS = hrGp > 1 ? 'hours' : 'hour';
    const dyGp = Math.abs( Math.round(dayGap) );
    const dayS = dyGp > 1 ? 'days' : 'day';
    
    const gapZone = ( !isLate || hrGp < Config.shipLateAllow ) ?
                      hrGp < Config.maxShift ?   // ON TIME
                        [ null, null, 'on time' ] : [ dyGp, dayS, 'early' ] 
                      : 
                      hrGp < Config.maxShift ?  // LATE
                        [ hrGp, hourS, 'late' ] : [ dyGp, dayS, 'late' ];
    
    return [ salesEnd, shipDue, didFinish, gapZone ];
  }
  
  function weekDoneAnalysis(clientTZ, rangeStart, rangeEnd) {
    
    const app = AppDB.findOne({orgKey: Meteor.user().orgKey});
    const nonWorkDays = app.nonWorkDays;
    if( Array.isArray(nonWorkDays) ) {  
      moment.updateLocale('en', {
        holidays: nonWorkDays
      });
    }
      
    let batchMetrics = [];
    
    const generalFind = BatchDB.find({
      orgKey: Meteor.user().orgKey, 
      finishedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    
    
    for(let gf of generalFind) {
      const batchNum = gf.batch;
      const describe = whatIsBatch(batchNum)[0];
      const salesOrder = gf.salesOrder;
      const itemQuantity = gf.items.length;
      const ncQuantity = gf.nonCon.filter( n => !n.trash ).length;
      const ncRate = ( ncQuantity / itemQuantity ).toFixed(1, 10);
      const endAlter = !gf.altered ? 'n/a' :
        gf.altered.filter( a => a.changeKey === 'end' ).length;
      
      // duration between finish and fulfill
      const deliveryResult = deliveryState(gf.end, gf.finishedAt, clientTZ);
      const salesEnd = deliveryResult[0];
      const shipDue = deliveryResult[1];
      const localFinish = deliveryResult[2];
      const onTime = deliveryResult[3].join(" ");
      
      // check for over quote
      const distTB = distTimeBudget(gf.tide, gf.quoteTimeBudget, itemQuantity, itemQuantity);
      //return [ tidePerItem, quotePerItem, quoteMNtide, tidePCquote ];
      
      const overQuote = distTB === undefined ? 'n/a' :
                        distTB[2] < 0 ? 
                        `${Math.abs(distTB[2])} hours over` : 
                        `${Math.abs(distTB[2])} hours under`;
      const percentOvUn = distTB === undefined ? 'n/a' : 
                          distTB[3] < 0 ? 
                          `${Math.abs(distTB[3])}% over` : 
                          `${Math.abs(distTB[3])}% under`;
      
      batchMetrics.push([
        batchNum, describe, 
        salesOrder, itemQuantity, ncRate,
        salesEnd, shipDue, localFinish, endAlter,
        onTime, overQuote, percentOvUn
      ]);
    }
    
    const generalFindX = XBatchDB.find({
      orgKey: Meteor.user().orgKey, 
      completedAt: { 
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }
    }).fetch();
    
    for(let gf of generalFindX) {
      const batchNum = gf.batch;
      const describe = whatIsBatchX(batchNum)[0];
      const salesOrder = gf.salesOrder;
      const itemQuantity = gf.quantity;
      const ncQuantity = gf.nonconformaces.filter( n => !n.trash ).length;
      const ncRate = ( ncQuantity / itemQuantity ).toFixed(1, 10);
      const endAlter = gf.altered.filter( a => a.changeKey === 'salesEnd' ).length;
      
      const deliveryResult = deliveryState(gf.salesEnd, gf.completedAt, clientTZ);
      const salesEnd = deliveryResult[0];
      const shipDue = deliveryResult[1];
      const localComplete = deliveryResult[2];
      const onTime = deliveryResult[3].join(" ");
      
      // check for over quote
      const distTB = distTimeBudget(gf.tide, gf.quoteTimeBudget, itemQuantity, itemQuantity);
      //return [ tidePerItem, quotePerItem, quoteMNtide, tidePCquote ];
      
      const overQuote = distTB === undefined ? 'n/a' :
                        distTB[2] < 0 ? 
                        `${Math.abs(distTB[2])} hours over` : 
                        `${Math.abs(distTB[2])} hours under`;
      const percentOvUn = distTB === undefined ? 'n/a' : 
                          distTB[3] < 0 ? 
                          `${Math.abs(distTB[3])}% over` : 
                          `${Math.abs(distTB[3])}% under`;
      
      batchMetrics.push([
        batchNum, describe, 
        salesOrder, itemQuantity, ncRate,
        salesEnd, shipDue, localComplete, endAlter,
        onTime, overQuote, percentOvUn
      ]);
    }
    
    return batchMetrics;
  }
  
  
  Meteor.methods({
  
  
  reportOnCompleted(clientTZ, yearNum, weekNum) {
    try {
      // const nowLocal = moment().tz(clientTZ);
      const requestLocal = moment().tz(clientTZ).set({'year': yearNum, 'week': weekNum});
      // console.log(requestLocal);
      
      const rangeStart = requestLocal.clone().startOf('week').toISOString();
      const rangeEnd = requestLocal.clone().endOf('week').toISOString();
      
      return weekDoneAnalysis(clientTZ, rangeStart, rangeEnd);

    }catch(err) {
      throw new Meteor.Error(err);
    }
  }
  

  
  
  
});