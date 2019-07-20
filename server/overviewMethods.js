import moment from 'moment';
import timezone from 'moment-timezone';
import business from 'moment-business';

//const now = moment().tz(clientTZ);
//const isNow = (t)=>{ return ( now.isSame(moment(t), 'day') ) };
  

function collectRelevant(accessKey, temp, activeList) {
  return new Promise(resolve => {
    const liveBatches = BatchDB.find({orgKey: accessKey, live: true},{sort: {batch:-1}}).fetch();
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

function collectInfo(clientTZ, temp, relevant) {
  return new Promise(resolve => {
    const now = moment().tz(clientTZ);
    let collection = [];
    for(let b of relevant) {
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
      // how many nonCons
      const nonConTotal = temp === 'cool' ? 0 : 
        b.nonCon.length;
      // how many items have nonCons
      const hasNonCon = temp === 'cool' ? 0 :
        [... new Set( Array.from(b.nonCon, x => { return x.serial }) ) ].length;
      // what percent of items have nonCons
      const percentOfNCitems = temp === 'cool' ? 0 :
        ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      // mean number of nonCons on items that have nonCons
      const nonConsPerNCitem = temp === 'cool' ? 0 :
        (nonConTotal / hasNonCon).toFixed(1);
      // how many items with RMA
      let itemHasRMA = temp === 'cool' ? 0 :
        b.items.filter( x => x.rma.length > 0).length;
      // how many items are scrapped
      const itemIsScrap = temp === 'cool' ? 0 :
        b.items.filter( x => x.history.find( 
                          y => y.type === 'scrap' ) )
                            .length;
      collection.push({
        batch: b.batch,
        batchID: b._id,
        salesOrder: b.salesOrder,
        salesEnd: salesEnd.format("MMM Do, YYYY"),
        timeElapse: timeElapse,
        weekDaysRemain: timeRemain,
        riverChosen: riverChosen,
        itemQuantity: itemQuantity,
        nonConTotal: b.nonCon.length,
        percentOfNCitems: isNaN(percentOfNCitems) ? '0%' : percentOfNCitems + '%',
        nonConsPerNCitem: isNaN(nonConsPerNCitem) ? '0.0' : nonConsPerNCitem,
        itemHasRMA: itemHasRMA,
        itemIsScrap: itemIsScrap,
      });
    
    }
    resolve(collection);
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


Meteor.methods({


//// Basic Status information for WIP Batches \\\\
  activeCheck(clientTZ) {
    async function bundleActive(clientTZ) {
      const accessKey = Meteor.user().orgKey;
      try {
        relevant = await collectRelevant(accessKey, 'warm');
        collection = await collectActive(accessKey, clientTZ, relevant);
        return collection;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleActive(clientTZ);
  },
  
  statusSnapshot(clientTZ, temp, activeList) {
    async function bundleStatus(clientTZ) {
      const accessKey = Meteor.user().orgKey;
      try {
        relevant = await collectRelevant(accessKey, temp, activeList);
        collection = await collectInfo(clientTZ, temp, relevant);
        return collection;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleStatus(clientTZ, temp);
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
  }
});

/*
  let ncTypeCounts = [];
    for(let ncType of aNCOps) {
      let typNum = 0;
      for(let t of batchesNC) {
        let nw = t.nonCon.filter(
                  x => x.type === ncType &&
                    moment(x.time)
                      .isBetween(sRange, eRange) );
        typNum += nw.length;
      }
      ncTypeCounts.push({meta: ncType, value: typNum});
    }
*/