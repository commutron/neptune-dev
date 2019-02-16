import moment from 'moment';
import timezone from 'moment-timezone';
import business from 'moment-business';

//const now = moment().tz(clientTZ);
//const isNow = (t)=>{ return ( moment(t).isSame(now, 'day') ) };
  

function collectRelevant(accessKey, temp) {
  return new Promise(resolve => {
    const liveBatches = BatchDB.find({orgKey: accessKey, live: true},{sort: {batch:-1}}).fetch();
    // get the relevant batches
    if(temp === 'warm') {
      const warmBatches = liveBatches.filter( x => typeof x.floorRelease === 'object' );
      resolve(warmBatches);
    }else if(temp === 'cool') {
      const coolBatches = liveBatches.filter( x => x.floorRelease === false );
      resolve(coolBatches);
    }else{
      resolve([]);
    }
  });
}

function collectInfo(clientTZ, relevant) {
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
      const timeRemain = !complete ? business.weekDays( now, salesEnd ) : false; 
      // how many items
      const itemQuantity = b.items.length;
      // what percent of items are complete
      const percentOfDoneItems = (( b.items.filter( x => x.finishedAt !== false )
                                  .length / itemQuantity) * 100 ).toFixed(0);
      // how many nonCons
      const nonConTotal = b.nonCon.length;
      // how many items have nonCons
      const hasNonCon = [... new Set( Array.from(b.nonCon, x => { return x.serial }) ) ].length;
      // what percent of items have nonCons
      const percentOfNCitems = ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      // mean number of nonCons on items that have nonCons
      const nonConsPerNCitem = (nonConTotal / hasNonCon).toFixed(1);
      // how many items with RMA
      let itemHasRMA = b.items.filter( x => x.rma.length > 0).length;
      // how many items are scrapped
      const itemIsScrap = b.items.filter( x => x.history.find( 
                              y => y.type === 'scrap' ) )
                                .length;
      // is there new activity today
      const activeN = (nonCon)=> nonCon.find( n => moment(n.time)
                                              .isSame(now, 'day') )
                                                ? true : false;
      const activeH = (items)=> items.find( i => i.history.find( 
                                            h => moment(h.time)
                                              .isSame(now, 'day') ) )
                                                ? true : false;
      let isActive = activeN(b.nonCon) || activeH(b.items);
      
      collection.push({
        batchID: b._id,
        salesOrder: b.salesOrder,
        salesEnd: salesEnd.format("MMM Do, YYYY"),
        timeElapse: timeElapse,
        weekDaysRemain: timeRemain + ' weekdays left',
        itemQuantity: itemQuantity,
        percentOfDoneItems: isNaN(percentOfDoneItems) ? '0%' : percentOfDoneItems + '%',
        nonConTotal: b.nonCon.length,
        percentOfNCitems: isNaN(percentOfNCitems) ? '0%' : percentOfNCitems + '%',
        nonConsPerNCitem: isNaN(nonConsPerNCitem) ? '0.0' : nonConsPerNCitem,
        itemHasRMA: itemHasRMA,
        itemIsScrap: itemIsScrap,
        isActive: isActive
      });
    
    }
    resolve(collection);
  });
}

Meteor.methods({


//// Basic Status information for WIP Batches \\\\
  statusSnapshot(clientTZ, temp) {
    async function bundleStatus(clientTZ) {
      const accessKey = Meteor.user().orgKey;
      try {
        relevant = await collectRelevant(accessKey, temp);
        collection = await collectInfo(clientTZ, relevant);
        return collection;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleStatus(clientTZ, temp);
  }
 
 
 
 

  
  
  
});