import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { checkTimeBudget } from './tideMethods.js';
import { whatIsBatch, whatIsBatchX } from './searchOps.js';

import Config from '/server/hardConfig.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

  function deliveryState(wasDue, didEnd) {
    const isLate = moment(didEnd).isAfter(wasDue);
    const hourGap = moment(wasDue).workingDiff(didEnd, 'hours');
    const dayGap = moment(wasDue).workingDiff(didEnd, 'days', true);

    const hrGp = Math.abs(hourGap);
    const hourS = hrGp > 1 ? 'hours' : 'hour';
    const dyGp = Math.abs( Math.round(dayGap) );
    const dayS = dyGp > 1 ? 'days' : 'day';
    
    const gapZone = ( !isLate || hrGp < Config.shipLateAllow ) ?
                      hrGp < Config.maxShift ?   // ON TIME
                        'on time' : `${dyGp} ${dayS} early` 
                      : 
                      hrGp < Config.maxShift ?  // LATE
                      `${hrGp} ${hourS} late` : `${dyGp} ${dayS} late`;
    return gapZone;
  }
  
  function weekDoneAnalysis(clientTZ, rangeStart, rangeEnd) {
    
    const asHours = (mnts) => 
      moment.duration(mnts, "minutes")
        .asHours().toFixed(2, 10);
    
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
    
    //console.log(clientTZ);
    
    for(let gf of generalFind) {
      const batchNum = gf.batch;
      const describe = whatIsBatch(batchNum);
      const salesOrder = gf.salesOrder;
      const itemQuantity = gf.items.length;
      const ncQuantity = gf.nonCon.filter( n => !n.trash ).length;
      const ncRate = ( ncQuantity / itemQuantity ).toFixed(1, 10);
      const endAlter = !gf.altered ? 'n/a' :
        gf.altered.filter( a => a.changeKey === 'end' ).length;
      
      const localEnd = moment.tz(gf.end, clientTZ);
      
      const salesEnd = localEnd.isWorkingDay() ?
                        localEnd.clone().endOf('day').lastWorkingTime().format() :
                        localEnd.clone().lastWorkingTime().format();
      const shipDue = localEnd.isShipDay() ?
                        localEnd.clone().nextShippingTime().format() :
                        localEnd.clone().lastShippingTime().format();
      
      const localFinish = moment(gf.finishedAt).tz(clientTZ).format();
      
      // duration between finish and fulfill
      const onTime = deliveryState(shipDue, localFinish);
      
      // check for over quote
      const quote2tide = checkTimeBudget(gf.tide, gf.quoteTimeBudget);
      const overQuote = quote2tide === null ? 'n/a' :
                        quote2tide < 0 ? 
                        `${asHours(Math.abs(quote2tide))} hours over` : 
                        `${asHours(Math.abs(quote2tide))} hours under`;
      
      batchMetrics.push([
        batchNum, describe, 
        salesOrder, itemQuantity, ncRate,
        salesEnd, shipDue, localFinish, endAlter,
        onTime, overQuote
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
      const describe = whatIsBatchX(batchNum);
      const salesOrder = gf.salesOrder;
      const itemQuantity = gf.quantity;
      const ncQuantity = gf.nonconformaces.filter( n => !n.trash ).length;
      const ncRate = ( ncQuantity / itemQuantity ).toFixed(1, 10);
      const endAlter = gf.altered.filter( a => a.changeKey === 'salesEnd' ).length;
      
      const localEnd = moment.tz(gf.salesEnd, clientTZ);
      
      const salesEnd = localEnd.isWorkingDay() ?
                        localEnd.clone().nextWorkingTime().format() :
                        localEnd.clone().lastWorkingTime().format();
      const shipDue = localEnd.isShipDay() ?
                        localEnd.clone().nextShippingTime().format() :
                        localEnd.clone().lastShippingTime().format();
      
      const localComplete = moment(gf.completedAt).tz(clientTZ).format();
      
      // duration between complete and fulfill
      const onTime = deliveryState(shipDue, localComplete);
      
      // check for over quote
      // const quote2tide = checkTimeBudget(gf.tide, gf.quoteTimeBudget);
      // const overQuote = quote2tide === null ? 'n/a' :
      //                   quote2tide < 0 ? 
      //                   `${asHours(Math.abs(quote2tide))} hours over` : 
      //                   `${asHours(Math.abs(quote2tide))} hours under`;
      const overQuote = 'n/a';
      
      batchMetrics.push([
        batchNum, describe, 
        salesOrder, itemQuantity, ncRate,
        salesEnd, shipDue, localComplete, endAlter,
        onTime, overQuote
      ]);
    }
    
    return batchMetrics;
  }
  
  
  Meteor.methods({
  
  
  reportOnCompleted(clientTZ, yearNum, weekNum) {
    try {
      
      // const nowLocal = moment().tz(clientTZ);
      const requestLocal = moment().tz(clientTZ).set({'year': yearNum, 'week': weekNum});
      
      const rangeStart = requestLocal.clone().startOf('week').toISOString();
      const rangeEnd = requestLocal.clone().endOf('week').toISOString();
      
      // console.log(requestLocal);
      
      
      return weekDoneAnalysis(clientTZ, rangeStart, rangeEnd);

    }catch(err) {
      throw new Meteor.Error(err);
    }
  }
  

  
  
  
});