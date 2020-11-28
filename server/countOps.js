import moment from 'moment';
// import timezone from 'moment-timezone';

import { distTimeBudget } from './tideGlobalMethods.js';
import { deliveryState } from './reportCompleted.js';
import { avgOfArray, round2Decimal } from './calcOps';


Meteor.methods({

  /*
  countItems(batchID) {
    
    const b = BatchDB.findOne({_id: batchID});
    
    if(b) {
      const itemCount = b.items.length;
      return itemCount;
    }else{
      const bx = XBatchDB.findOne({_id: batchID});
      
      if(bx) {
        return bx.quantity;
      }else{
        return 0;
      }
    }
  },*/
  
    ///////////////////////////////////////////////////////////////////////
   // Counts Of Batches Tide Time
  /////////////////////////////////////////////////////////////////////////////
  countMultiBatchTideTimes(batchIDs) {
  
    let batchQT = [];
    let batchTides = [];
    let batchLeftBuffer = [];
    let batchOverBuffer = [];
    
    const totalST = (batch)=> {
      let totalTime = 0;
      if(!batch.tide) {
        batchTides.push({ x: batch.batch, y: 0 });
        batchLeftBuffer.push({ x: batch.batch, y: 0 });
        batchOverBuffer.push({ x: batch.batch, y: 0 });
      }else{
        for(let bl of batch.tide) {
          const mStart = moment(bl.startTime);
          const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
          const block = Math.round( 
            moment.duration(mStop.diff(mStart)).asMinutes() );
          totalTime = totalTime + block;
        }
        
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
      let batch = BatchDB.findOne({_id: batchID}) ||
                  XBatchDB.findOne({_id: batchID});
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
    
    let tidePerItem = [];
    
    let quotePerItem = [];
    
    let tideToQuoteHours = [];
    
    let tideToQuotePercent = [];
    
    let wasDelivered = [];
    
    const discoverTQ = (b, itemQuantity)=> {
      // check for over quote
      const distTB = distTimeBudget(b.tide, b.quoteTimeBudget, itemQuantity, itemQuantity, b.lockTrunc);
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
      
  
    for(let batchID of batchIDs) {
      let batch = BatchDB.findOne({_id: batchID});
      if(batch) {
        if(batch.finishedAt !== false) {
          const quantity = batch.items.length;
          discoverTQ(batch, quantity);
          discoverOT(batch.end, batch.finishedAt);
        }else{null}
      }else{
        const xbatch = XBatchDB.findOne({_id: batchID});
        if(xbatch) {
          if(xbatch.completed) {
            const xquantity = xbatch.quantity;
            discoverTQ(xbatch, xquantity);
            discoverOT(xbatch.salesEnd, xbatch.completedAt);
          }else{null}
        }else{null}
      }
    }
    
    const delvAvg = round2Decimal( avgOfArray(wasDelivered) );
    
    const avgArrays = {
      tidePerItemAvg: round2Decimal( avgOfArray(tidePerItem) ),
      quotePerItemAvg: round2Decimal( avgOfArray(quotePerItem) ), 
      tideToQuoteHoursAvg: round2Decimal( avgOfArray(tideToQuoteHours) ), 
      tideToQuotePercentAvg: round2Decimal( avgOfArray(tideToQuotePercent) ),
      deliveryGap: delvAvg
    };
    
    return JSON.stringify(avgArrays);
    
  },

     //////////////////////////////////////////////////////////////////////////
    // Counts Of Each NonConformance Type
  /////////////////////////////////////////////////////////////////////////////
  countNonConTypes(batch, nonConArray, nonConOptions) {
    function findOptions() {
      let org = AppDB.findOne({orgKey: Meteor.user().orgKey});
      if(!org) {
        return [];
      }else{
        const ncTypesCombo = Array.from(org.nonConTypeLists, x => x.typeList);
  	    const ncTCF = [].concat(...ncTypesCombo,...org.nonConOption);
  	
    	  const flatTypeList = Array.from(ncTCF, x => 
    	    typeof x === 'string' ? x : 
    	    x.live === true && x.typeText
    	  );
    	  const flatTypeListClean = flatTypeList.filter( x => x !== false);
    	 // const flatTypeListClean = _.without(flatTypeList, false);
        return flatTypeListClean;
      }
    }
    
    function ncCounter(ncArray, ncOptions) {
      let ncCounts = [];
      for(let ncType of ncOptions) {
        const typeCount = ncArray.filter( n => n.type === ncType && !n.trash ).length;
        ncCounts.push({x: ncType, y: typeCount, l: batch});
      }
      return ncCounts;
    }
    
    const ncOptions = Array.isArray(nonConOptions) ? nonConOptions : findOptions();
    const ncArray = Array.isArray(nonConArray) ? nonConArray : [];
    const allTypes = ncCounter(ncArray, ncOptions);
    return allTypes;
  },
  
   
    //////////////////////////////////////////////////////////////////////////
   // nonCons of Multiple Batches
  ////////////////////////////////////////////////////////////////////////////
  nonConBatchesTypes(batchIDs) {
    const batch = (bID)=> {
      let b = BatchDB.findOne({_id: bID});
      let bData = !b ? {batch: '', nonCon: []} : {batch: b.batch, nonCon: b.nonCon};
      return bData;
    };
    const allBatch = Array.from( batchIDs, bID => batch(bID) );
    
    nonconCollection = [];
    for(let b of allBatch) {
      let counts = Meteor.call('countNonConTypes', b.batch, b.nonCon, false);
      nonconCollection.push(counts);
    }
    
    return nonconCollection;
  },
  
  
  
  
});