import moment from 'moment';
import business from 'moment-business';
import 'moment-timezone';
import 'moment-business-time';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['07:00:00', '16:30:00'],
      2: ['07:00:00', '16:30:00'],
      3: ['07:00:00', '16:30:00'],
      4: ['07:00:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
  }// including lunch breaks!
});

// moment.defineLocale('en-foo', {
//   parentLocale: 'en',
//   /* */
// });

//const now = moment().tz(clientTZ);
//const isNow = (t)=>{ return ( now.isSame(moment(t), 'day') ) };

function batchTideTime(batchTide) {
    
  if(!batchTide) {
    return undefined;
  }else{
    let tideTime = 0;
    for(let bl of batchTide) {
      const mStart = moment(bl.startTime);
      const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
      const block = moment.duration(mStop.diff(mStart)).asMinutes();
      tideTime = tideTime + block;
    }
    //console.log(tideTime);
    if( !tideTime || typeof tideTime !== 'number' ) {
      return false;
    }else{
      return tideTime.toFixed(2, 10);
    }
  }
}

function collectRelevant(accessKey, temp, activeList, sortBy) {
  return new Promise(resolve => {
    const liveBatches = 
      sortBy === 'sales' ?
        BatchDB.find({orgKey: accessKey, live: true},{sort: {salesOrder:-1}}).fetch() :
      sortBy === 'due' ?
        BatchDB.find({orgKey: accessKey, live: true},{sort: {end:-1}}).fetch() :
      BatchDB.find({orgKey: accessKey, live: true},{sort: {batch:-1}}).fetch();
    // get the relevant batches
    if(temp === 'cool') {
      const coolBatches = liveBatches.filter( x => x.floorRelease === false );
      resolve(coolBatches);
    }else if(temp === 'warm') {
      const warmBatches = liveBatches.filter( x => typeof x.floorRelease === 'object' );
      resolve(warmBatches);
    }else if(temp === 'luke') {
      const lukeBatches = liveBatches.filter( x => 
        typeof x.floorRelease === 'object' && activeList.includes( x.batch ) === false);
      resolve(lukeBatches);
    }else if(temp === 'hot') {
      const hotBatches = liveBatches.filter( x => activeList.includes( x.batch ) === true );
      resolve(hotBatches);
    }else {
      [];
    }
  });
}

function collectActive(accessKey, clientTZ, relevant) {
  return new Promise(resolve => {
    
    const now = moment().tz(clientTZ);
    let list = [];
    
    for(let b of relevant) {
      const tide = b.tide || [];
      let isActive = tide.find( x => 
        now.isSame(moment(x.startTime), 'day')
      ) ? true : false;
      isActive === true && list.push(b.batch);
    }
    
    resolve(list);
  });
}


function collectStatus(privateKey, batchID, clientTZ) {
  return new Promise(resolve => {
    let collection = false;
    const b = BatchDB.findOne({_id: batchID});
    if(!b) {
      resolve(collection);
    }else{
      const now = moment().tz(clientTZ);
      // is it done
      const complete = b.finishedAt !== false;
      // when is it due
      const salesEnd = moment(b.end);
      // how long since start
      const timeElapse = moment.duration(now.diff(b.start)).humanize();
      // how long untill due
      const timeRemain = !complete ? business.weekDays( now, salesEnd ) : 0; 
      // how many items
      const itemQuantity = b.items.length;
      // River Setup
      const riverChosen = b.river !== false;
      // what percent of items are complete
      // const percentOfDoneItems = temp === 'cool' ? 0 : 
      //   (( b.items.filter( x => x.finishedAt !== false )
      //     .length / itemQuantity) * 100 ).toFixed(0);
      
      //////////////////////////////////
     
      collection = {
        batch: b.batch,
        batchID: b._id,
        timeElapse: timeElapse,
        weekDaysRemain: timeRemain,
        riverChosen: riverChosen,
        itemQuantity: itemQuantity,
      };
      
      resolve(collection);
    }
  });
}

function collectPriority(privateKey, batchID, clientTZ) {
  return new Promise(resolve => {
    let collection = false;
    const b = BatchDB.findOne({_id: batchID});
    if(!b) {
      resolve(collection);
    }else{
      
      const qtBready = !b.quoteTimeBudget ? false : true;
      
      let estEnd2fillBuffer = false;
      let overQuote = false;
      
      if(qtBready) {
        const qtB = qtBready && b.quoteTimeBudget.length > 0 ? 
                    b.quoteTimeBudget[0].timeAsMinutes : 0;
        
        const totalQuoteMinutes = qtB || 0;
        
        const totalTideMinutes = batchTideTime(b.tide);
        
        const quote2tide = totalQuoteMinutes - totalTideMinutes;
        const q2tNice = Math.abs(quote2tide);
  
        const estComplete = moment().addWorkingTime(q2tNice, 'minutes');
        
        const prevShipDay = moment(b.end).tz(clientTZ).locale('shipDays', {
          workinghours: { 0: null, 1: null,
            2: ['11:00:00', '11:00:00'], 3: null, 4: ['11:00:00', '11:00:00'],
            5: null, 6: null }
        }).lastWorkingTime();
        
        const fulfill = prevShipDay || moment(b.end).tz(clientTZ);
        
        const buffer = fulfill.workingDiff(estComplete, 'minutes');
        
        estEnd2fillBuffer = buffer || 0;
        overQuote = quote2tide < 0 ? true : false;
      }
     
      collection = {
        batch: b.batch,
        batchID: b._id,
        estEnd2fillBuffer: estEnd2fillBuffer,
        overQuote: overQuote
      };
      
      resolve(collection);
    }
  });
}


function collectProgress(privateKey, batchID) {
  return new Promise(resolve => {
    let collection = false;
    const batch = BatchDB.findOne({_id: batchID});
    if(!batch) {
      resolve(collection);
    }else{
      const app = AppDB.findOne({orgKey: privateKey});
      const docW = WidgetDB.findOne({_id: batch.widgetId});
      const flow = docW.flows.find( x => x.flowKey === batch.river );
      const riverFlow = flow ? flow.flow : [];
      
      let phaseSets = [];
      for(let phase of app.phases) {
        const steps = riverFlow.filter( x => x.phase === phase && x.type !== 'first' );
        phaseSets.push({
          phase: phase,
          steps: steps,
          count: 0 
        });
      }
      
      const doneItems = batch.items.filter( x => x.finishedAt !== false ).length;
      const wipItems = batch.items.filter( 
                        x => x.finishedAt === false ); // not done
      const wipItemHistory = Array.from( wipItems, 
                              x => x.history.filter( 
                                y => y.type !== 'first' && y.good === true) );
      const historyFlat = [].concat(...wipItemHistory);

      phaseSets.map( (phet, index)=> {
        for(let stp of phet.steps) {
          const wipTally = historyFlat.filter( x => x.key === stp.key ).length;
          phaseSets[index].count = phet.count + doneItems + wipTally;
        }
      });
 
      collection = {
        batch: batch.batch,
        batchID: batch._id,
        totalItems: batch.items.length,
        phaseSets: phaseSets,
      };
      
      resolve(collection);
    }
  });
}


function collectNonCon(privateKey, batchID, temp) {
  return new Promise(resolve => {
    let collection = false;
    const b = BatchDB.findOne({_id: batchID});
    if(!b) {
      resolve(collection);
    }else{
      const itemQuantity = b.items.length;
      // nonCon relevant
      const rNC = b.nonCon.filter( n => !n.trash );
      // how many nonCons
      const nonConTotal = temp === 'cool' ? 0 : 
        rNC.length;
      // how many are unresolved  
      const nonConLeft = rNC.filter( x => 
        x.inspect === false && ( x.skip === false || x.snooze === true )
      ).length;
      // how many items have nonCons
      const hasNonCon = temp === 'cool' ? 0 :
        [... new Set( Array.from(rNC, x => { return x.serial }) ) ].length;
      // what percent of items have nonCons
      const percentOfNCitems = temp === 'cool' ? 0 :
        ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      // how many items are scrapped
      const itemIsScrap = temp === 'cool' ? 0 :
        b.items.filter( x => x.history.find( 
                          y => y.type === 'scrap' && y.good === true ) )
                            .length;
      // how many items with RMA
      let itemHasRMA = temp === 'cool' ? 0 :
        b.items.filter( x => x.rma.length > 0).length;
 
      collection = {
        batch: b.batch,
        batchID: b._id,
        nonConTotal: nonConTotal,
        nonConLeft: nonConLeft,
        percentOfNCitems: isNaN(percentOfNCitems) ? '0%' : percentOfNCitems + '%',
        itemIsScrap: itemIsScrap,
        itemHasRMA: itemHasRMA
      };
      
      resolve(collection);
    }
  });
}


Meteor.methods({


//// Basic Status information for WIP Batches \\\\
  activeCheck(clientTZ, sortBy) {
    async function bundleActive(clientTZ) {
      const accessKey = Meteor.user().orgKey;
      try {
        relevant = await collectRelevant(accessKey, 'warm', false, sortBy);
        collection = await collectActive(accessKey, clientTZ, relevant);
        return collection;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleActive(clientTZ);
  },
  
  overviewBatchStatus(batchID, clientTZ) {
    async function bundleProgress(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectStatus(accessKey, batchID, clientTZ);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleProgress(batchID);
  },
  
  priorityRank(batchID, clientTZ) {
    async function bundlePriority(batchID, clientTZ) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectPriority(accessKey, batchID, clientTZ);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority(batchID, clientTZ);
  },
  
  phaseProgress(batchID) {
    async function bundleProgress(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectProgress(accessKey, batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleProgress(batchID);
  },
  
  nonconQuickStats(batchID, temp) {
    async function bundleNonCon(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectNonCon(accessKey, batchID, temp);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleNonCon(batchID);
  }
  
  
});