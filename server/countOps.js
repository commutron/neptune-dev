import moment from 'moment';

import Config from '/server/hardConfig.js';
import { batchTideTime, distTimeBudget } from './tideGlobalMethods.js';
import { deliveryState } from './reportCompleted.js';
import { avgOfArray, asRate, diffTrend } from './calcOps';
import { allNCOptions, countMulti } from './utility';


Meteor.methods({
  
    //////////////////////////////////////
   // Counts Of Batches Tide Time ///////
  //////////////////////////////////////
  countMultiBatchTideTimes(batchIDs) {
    this.unblock();
    
    let batchQT = [];
    let batchTides = [];
    let batchLeftBuffer = [];
    let batchOverBuffer = [];
    
    const totalST = (batch)=> {
      if(!batch.tide) {
        batchTides.push({ x: batch.batch, y: 0 });
        batchLeftBuffer.push({ x: batch.batch, y: 0 });
        batchOverBuffer.push({ x: batch.batch, y: 0 });
      }else{
        const totalTime = batchTideTime(batch.tide, batch.lockTrunc);
        
        const qtBready = !batch.quoteTimeBudget ? false : true;
        const qtB = qtBready && batch.quoteTimeBudget.length > 0 ? 
          batch.quoteTimeBudget[0].timeAsMinutes : 0;
        const totalQuoteMinutes = qtB || totalTime;
        const quote2tide = totalQuoteMinutes - totalTime;
        const bufferNice = Math.abs(quote2tide);
  
        const totalLeftMinutes = quote2tide < 0 ? 0 : bufferNice;
        const totalOverMinutes = quote2tide < 0 ? bufferNice : 0;
        
        batchQT.push(totalQuoteMinutes);
        batchTides.push({
          x: batch.batch,
          y: totalTime
        });
        batchLeftBuffer.push({
          x: batch.batch,
          y: totalLeftMinutes
        });
        batchOverBuffer.push({
          x: batch.batch,
          y: totalOverMinutes
        });
      }
    };
    
    for(let batchID of batchIDs) {
      let batch = XBatchDB.findOne({_id: batchID});
      if(!batch) {
        null;
      }else{ 
        totalST(batch);
      }
    }
    return { 
      batchQT,
      batchTides, 
      batchLeftBuffer, 
      batchOverBuffer
    };
    
  },
  
  countMultiBatchTideToQuote(widgetId) {
    this.unblock();
    
    const widget = WidgetDB.findOne({ _id: widgetId });
    const quoteStats = widget.quoteStats || null;
    const statime = quoteStats ? quoteStats.updatedAt : null;
    const stale = !statime ? true :
            moment.duration(moment().diff(moment(statime))).as('hours') > 12;
    if(stale) {
      
      let tidePerItem = [];
      
      let quotePerItem = [];
      
      let tideToQuoteHours = [];
      
      let tideToQuotePercent = [];
      
      let wasDelivered = [];
      
      const discoverTQ = (b)=> {
        // check for over quote
        const distTB = distTimeBudget(b.tide, b.quoteTimeBudget, b.quantity, b.lockTrunc);
        if(distTB) {
          tidePerItem.push( distTB[0] );
          quotePerItem.push( distTB[1] );
          tideToQuoteHours.push( distTB[2] );
          tideToQuotePercent.push( distTB[3] );
        }
      };
    
      const discoverOT = (bID, endTime, completeTime)=> {
        // duration between finish and fulfill
        const deliveryResult = deliveryState(bID, endTime, completeTime);
        const dr3 = deliveryResult[3];
        const timeVal = !dr3[0] ? 0 : 
                        dr3[1] === 'hour' || dr3[1] === 'hours' ? ( dr3[0] / 24 ) :
                        dr3[0];
        const timeNum = dr3[2] === 'late' ? -Math.abs(timeVal) : timeVal;
        
        wasDelivered.push( timeNum );
      };
      
      try {
        const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
        
        const batches = XBatchDB.find({ 
          widgetId: widgetId, 
          completed: true,
          createdAt: { 
            $gte: new Date(cutoff)
          }
        }).fetch();
        
        for(let batch of batches) {
          discoverTQ(batch);
          discoverOT(batch._id, batch.salesEnd, batch.completedAt);
        }
      }catch(err) {
        throw new Meteor.Error(err);
      }
      
      const tidePerItemAvg = avgOfArray(tidePerItem);
      const quotePerItemAvg = avgOfArray(quotePerItem);
      const tideToQuoteHoursAvg = avgOfArray(tideToQuoteHours);
      const tideToQuotePercentAvg = avgOfArray(tideToQuotePercent);
      const deliveryGap = avgOfArray(wasDelivered);
      
      const avgArrays = {
        tidePerItemAvg: tidePerItemAvg,
        quotePerItemAvg: quotePerItemAvg, 
        tideToQuoteHoursAvg: tideToQuoteHoursAvg, 
        tideToQuotePercentAvg: tideToQuotePercentAvg,
        deliveryGap: deliveryGap
      };
      
      WidgetDB.update({ _id: widgetId }, {
        $set : {
          quoteStats: {
            stats: avgArrays,
            updatedAt: new Date(),
          }
        }});
      
      const thin = JSON.stringify(avgArrays);
      return thin;
    }else{
      const avgArrays = quoteStats.stats;
      return JSON.stringify(avgArrays);
    }
  },

     ///////////////////////////////////////////
    // Counts Of Each NonConformance Type /////
  ////////////////////////////////////////////
  countNonConTypes(batch, nonConArray, nonConOptions) {
    function ncCounter(ncArray, ncOptions) {
      let ncCounts = [];
      for(let ncType of ncOptions) {
        const typeCount = countMulti( ncArray.filter( n => n.type === ncType && !n.trash ) );
        ncCounts.unshift({x: ncType, y: typeCount, l: batch});
      }
      return ncCounts;
    }
    
    const ncOptions = Array.isArray(nonConOptions) ? nonConOptions : allNCOptions();
    const ncOptionS = ncOptions.sort();
    const ncArray = Array.isArray(nonConArray) ? nonConArray : [];
    const allTypes = ncCounter(ncArray, ncOptionS);
    return allTypes;
  },
  
    //////////////////////////////////////
   // nonCons of Multiple Batches ///////
  //////////////////////////////////////
  nonConBatchesTypes(batches) {
    this.unblock();
    
    const series = (b)=> {
      let srs = XSeriesDB.findOne({ batch: b });
      if(srs) {
        return { batch: b, nonCon: srs.nonCon };
      }else{
        return { batch: b, nonCon: [] };
      }
    };
    const allBatch = Array.from( batches, b => series(b) );
    
    let allTypes = [];
    for(let b of allBatch) {
      allTypes.push(Array.from(b.nonCon, n => n.type));
    }
    const nonConReq = _.uniq( [].concat(...allTypes) );
    
    let countNonCon = [];
    for(let b of allBatch) {
      const count = Meteor.call('countNonConTypes', b.batch, b.nonCon, nonConReq);
      countNonCon.push( count );
    }
    return JSON.stringify(countNonCon);
  },
  
  nonConBatchTrend(wID) {
    const widget = WidgetDB.findOne({ _id: wID });
    
    const ncRate = widget.ncRate || null;
    const statime = ncRate ? ncRate.updatedAt : null;
    const stale = !statime ? true :
              moment.duration(moment().diff(moment(statime))).as('hours') > 12;
    if(stale) {
      const series = XSeriesDB.find({ widgetId: wID }).fetch();
    
      let rateArr = [];
    
      for(let srs of series) {
        const b = XBatchDB.findOne({ batch: srs.batch });
        if(b.completed) {
          const total = countMulti( srs.nonCon.filter( n => !n.trash ) );
          const units = srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0;
          rateArr.push( asRate(total, units) );
        }
      }
      const avgRate = avgOfArray(rateArr, true);
      
      const lastavg = widget.ncRate;
      const runningavg = lastavg ? lastavg.rate : 0;
        
      const trend = !lastavg ? 'flat' : diffTrend(avgRate, runningavg);
      
      WidgetDB.update({ _id: wID }, {
        $set : {
          ncRate: {
            rate: avgRate,
            trend: trend,
            updatedAt: new Date(),
          }
      }});
      return [ avgRate, trend ];
    }else{
      return [ ncRate.rate, ncRate.trend ];
    }
  }
  
  
});