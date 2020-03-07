import moment from 'moment';
import timezone from 'moment-timezone';
// import 'moment-business-time-ship';

// moment.updateLocale('en', {
//   workinghours: {
//       0: null,
//       1: ['07:00:00', '16:30:00'],
//       2: ['07:00:00', '16:30:00'],
//       3: ['07:00:00', '16:30:00'],
//       4: ['07:00:00', '16:30:00'],
//       5: ['07:00:00', '12:00:00'],
//       6: null
//   },// including lunch breaks!
// });


Meteor.methods({

  /////////////////////////////////////////////////////////////////////////////
  
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
        const totalQuoteMinutes = qtB || 0;
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
      let batch = BatchDB.findOne({_id: batchID});
      if(!batch) {
        let xbatch = XBatchDB.findOne({_id: batchID});
        let batchNum = !xbatch ? batchID.slice(0,5) : xbatch.batch;
        batchQT.push(0);
        batchTides.push({ x: batchNum, y: 0 });
        batchLeftBuffer.push({ x: batchNum, y: 0 });
        batchOverBuffer.push({ x: batchNum, y: 0 });
      }else{ totalST(batch) }
    }
    return { 
      batchQT,
      batchTides, 
      batchLeftBuffer, 
      batchOverBuffer
    };
    
  },

     ///////////////////////////////////////////////////////////////////////////////////
  
    // Counts Of Each NonConformance Type
  
  ///////////////////////////////////////////////////////////////////////////////////
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
  
  
   
    ///////////////////////////////////////////////////////////////////////////////////
  
   // nonCons of Multiple Batches
  
  ///////////////////////////////////////////////////////////////////////////////////
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