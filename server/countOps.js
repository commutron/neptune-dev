
import { batchTideTime, distTimeBudget } from './tideGlobalMethods.js';
import { deliveryState } from './reportCompleted.js';
import { avgOfArray } from './calcOps';
import { allNCOptions } from './utility';

////////////////////////////////////////////////////////// NO LEGACY

Meteor.methods({
  
    ///////////////////////////////////////////////////////////////////////
   // Counts Of Batches Tide Time
  /////////////////////////////////////////////////////////////////////////////
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
        totalST(batch) }
    }
    return { 
      batchQT,
      batchTides, 
      batchLeftBuffer, 
      batchOverBuffer
    };
    
  },
  
  countMultiBatchTideToQuote(batchIDs) {
    this.unblock();
    
    let tidePerItem = [];
    
    let quotePerItem = [];
    
    let tideToQuoteHours = [];
    
    let tideToQuotePercent = [];
    
    let wasDelivered = [];
    
    const discoverTQ = (b, itemQuantity)=> {
      // check for over quote
      const distTB = distTimeBudget(b.tide, b.quoteTimeBudget, itemQuantity, b.quantity, b.lockTrunc);
      if(distTB) {
        tidePerItem.push( distTB[0] );
        quotePerItem.push( distTB[1] );
        tideToQuoteHours.push( distTB[2] );
        tideToQuotePercent.push( distTB[3] );
      }
    };
    
    const discoverOT = (endTime, completeTime)=> {
      // duration between finish and fulfill
      const deliveryResult = deliveryState(endTime, completeTime);
      const dr3 = deliveryResult[3];
      const timeVal = !dr3[0] ? 0 : 
                      dr3[1] === 'hour' || dr3[1] === 'hours' ? ( dr3[0] / 24 ) :
                      dr3[0];
      const timeNum = dr3[2] === 'late' ? -Math.abs(timeVal) : timeVal;
      
      wasDelivered.push( timeNum );
    };
      
    try {
      for(let batchID of batchIDs) {
        const xbatch = XBatchDB.findOne({_id: batchID});
        if(xbatch && xbatch.completed) {
          const srs = XSeriesDB.findOne({batch: xbatch.batch});
          const srsQ = !srs ? xbatch.quantity : srs.items.length;
          discoverTQ(xbatch, srsQ);
          discoverOT(xbatch.salesEnd, xbatch.completedAt);
        }else{null}
      }
    }catch(err) {
      throw new Meteor.Error(err);
    }
    
    const delvAvg = avgOfArray(wasDelivered);
    
    const avgArrays = {
      tidePerItemAvg: avgOfArray(tidePerItem),
      quotePerItemAvg: avgOfArray(quotePerItem), 
      tideToQuoteHoursAvg: avgOfArray(tideToQuoteHours), 
      tideToQuotePercentAvg: avgOfArray(tideToQuotePercent),
      deliveryGap: delvAvg
    };
    
    return JSON.stringify(avgArrays);
  },

     //////////////////////////////////////////////////////////////////////////
    // Counts Of Each NonConformance Type
  /////////////////////////////////////////////////////////////////////////////
  countNonConTypes(batch, nonConArray, nonConOptions) {
    function ncCounter(ncArray, ncOptions) {
      let ncCounts = [];
      for(let ncType of ncOptions) {
        const typeCount = ncArray.filter( n => n.type === ncType && !n.trash ).length;
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
  
    //////////////////////////////////////////////////////////////////////////
   // nonCons of Multiple Batches
  ////////////////////////////////////////////////////////////////////////////
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
  
  
});