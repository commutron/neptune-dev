import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time-ship';

import { batchTideTime } from './overviewMethods.js';
import { whatIsBatch, whatIsBatchX } from './searchOps.js';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['07:00:00', '16:30:00'],
      2: ['07:00:00', '16:30:00'],
      3: ['07:00:00', '16:30:00'],
      4: ['07:00:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
  },// including lunch breaks!
  shippinghours: {
      0: null,
      1: null,
      2: ['11:30:00', '11:30:00'],
      3: null,
      4: ['11:30:00', '11:30:00'],
      5: null,
      6: null
  }// including lunch breaks!
});

  function checkTimeBudget(tide, quoteTimeBudget) {
    
    const qtBready = !quoteTimeBudget ? false : true;
    
    let quote2tide = null;
    
    if(qtBready) {
      const qtB = qtBready && quoteTimeBudget.length > 0 ? 
                  quoteTimeBudget[0].timeAsMinutes : 0;
      
      const totalQuoteMinutes = qtB || 0;
      
      const totalTideMinutes = batchTideTime(tide);
      
      quote2tide = totalQuoteMinutes - totalTideMinutes;
    }
    
    return quote2tide;
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
      const buffer = moment(localFinish).workingDiff(shipDue, 'days');
      const onTime = buffer === 0 ? 'on time' :
                      buffer < 0 ? `${Math.abs(buffer)} days early` :  
                      `${Math.abs(buffer)} days late`;
      
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
      const ncQuantity = gf.nonconformaces.length;
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
      
      // duration between finish and fulfill
      const buffer = moment(localComplete).workingDiff(shipDue, 'days');
      const onTime = buffer === 0 ? 'on time' :
                      buffer < 0 ? `${Math.abs(buffer)} days early` :  
                      `${Math.abs(buffer)} days late`;
      
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