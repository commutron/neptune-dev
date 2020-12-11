import moment from 'moment';
import timezone from 'moment-timezone';
import Config from '/server/hardConfig.js';

function findRelevantBatches(orgKey, from, to) {
  return new Promise(resolve => {
    const batchPack = BatchDB.find({
        orgKey: Meteor.user().orgKey,
        $and : [
          { createdAt: { $lte: new Date( to ) } },
          { $or : [ 
            { finishedAt : false }, 
            { finishedAt : { $gte: new Date( from ) } } 
          ] }
        ]
      }).fetch();
    resolve(batchPack);
  });
}

function loopBatches(batches, from, to) {
  return new Promise(resolve => {
    let allItems = [];
    let allNonCons = [];
    let allShortfalls = [];
    
    for(let b of batches) {
      allNonCons.push(...b.nonCon.filter( x => !x.trash ));
      allShortfalls.push(...b.shortfall);
      allItems.push(...b.items);
    }
    resolve({allItems, allNonCons, allShortfalls});
  });
}

function loopShortfalls(shortfall, from, to) {
  return new Promise(resolve => {
    const inTime = shortfall.filter( x => moment(x.cTime).isBetween(from, to) );
    const foundSH = inTime.length;
    const uniqueSerials = [... new Set( Array.from(inTime, x => x.serial ) ) ].length;
    
    const numObj = _.countBy(inTime, x => x.partNum);
    const numBreakdown = Object.entries(numObj);
    
    resolve({ foundSH, uniqueSerials, numBreakdown });
  });
}

function loopItems(items, from, to ) {
  return new Promise(resolve => {
    let finishedItems = 0;
    // let firstPass = 0;
    // let firstFail = 0;
    let testFail = 0;
    let scraps = 0;
    for(let i of items) {
      if(i.finishedAt !== false && moment(i.finishedAt).isBetween(from, to) ) { 
        finishedItems += 1;
      }
      const inTime = i.history.filter( x => moment(x.time).isBetween(from, to) );
      
      // firstPass += inTime.filter( x => x.type === 'first' && x.good !== false ).length;
      // firstFail += inTime.filter( x => x.type === 'first' && x.good === false ).length;
      testFail += inTime.filter( x => x.type === 'test' && x.good === false ).length;
      scraps += inTime.filter( x => x.type === 'scrap' && x.good === true ).length;
    }
    
    resolve({finishedItems, testFail, scraps});
  });
}

function loopNonCons(nonCons, from, to, flatTypeListClean) {
  return new Promise(resolve => {
    const inTime = nonCons.filter( x => moment(x.time).isBetween(from, to) );
    let foundNC = inTime.length;
    let uniqueSerials = [... new Set( Array.from(inTime, x => x.serial ) ) ].length;
    
    const typeObj = _.countBy(inTime, x => x.type);
    const typeBreakdown = Object.entries(typeObj);
    
    const whereObj = _.countBy(inTime, x => x.where);
    const whereBreakdown = Object.entries(whereObj);
    
    resolve({foundNC, uniqueSerials, typeBreakdown, whereBreakdown});
  });
}


Meteor.methods({
  
  buildProblemReport(startDay, endDay, dataset) {
    const orgKey = Meteor.user().orgKey;
        
    const from = moment(startDay).tz(Config.clientTZ).startOf('day').format();
    const to = moment(endDay).tz(Config.clientTZ).endOf('day').format();
    const nc = dataset === 'noncon';
    
    async function getBatches() {
      try {
        batchSlice = await findRelevantBatches(orgKey, from, to);
        batchArange = await loopBatches(batchSlice, from, to);
        itemStats = await loopItems(batchArange.allItems, from, to);
        nonConStats = !nc ? [] : await loopNonCons(batchArange.allNonCons, from, to);
        shortfallStats = nc ? [] : await loopShortfalls(batchArange.allShortfalls, from, to);
        
        const batchInclude = batchSlice.length;
        const itemsInclude = batchArange.allItems.length;
        //const itemsWithPercent = ( ( nonConStats.uniqueSerials / itemsInclude ) * 100 ).toFixed(1) + '%';
        
        return JSON.stringify({
          batchInclude, itemsInclude, itemStats, nonConStats, shortfallStats
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return getBatches();
  }
  
})