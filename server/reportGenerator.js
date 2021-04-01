import moment from 'moment';
import timezone from 'moment-timezone';
import Config from '/server/hardConfig.js';

function findRelevantSeries(orgKey, from, to) {
  return new Promise(resolve => {
    const batchPack = XBatchDB.find({
        orgKey: Meteor.user().orgKey,
        $and : [
          { createdAt: { $lte: new Date( to ) } },
          { $or : [ 
            { completed : false }, 
            { completedAt : { $gte: new Date( from ) } } 
          ] }
        ]
      },{fields:{'batch':1}}).fetch();
    
    let seriesPack = [];
    for(let b of batchPack) {
      const srs = XSeriesDB.findOne({batch: b.batch});
      !srs ? null : seriesPack.push(srs);
    }
    
    resolve(seriesPack);
  });
}

function loopSerieses(serieses, from, to) {
  return new Promise(resolve => {
    let allItems = [];
    let allNonCons = [];
    let allShortfalls = [];
    
    for(let srs of serieses) {
      allNonCons.push(...srs.nonCon.filter( x => !x.trash ));
      allShortfalls.push(...srs.shortfall);
      allItems.push(...srs.items);
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
    let completedItems = 0;
    // let firstPass = 0;
    // let firstFail = 0;
    let testFail = 0;
    let scraps = 0;
    for(let i of items) {
      if(i.completed && moment(i.completedAt).isBetween(from, to) ) { 
        completedItems += 1;
      }
      const inTime = i.history.filter( x => moment(x.time).isBetween(from, to) );
      
      // firstPass += inTime.filter( x => x.type === 'first' && x.good !== false ).length;
      // firstFail += inTime.filter( x => x.type === 'first' && x.good === false ).length;
      testFail += inTime.filter( x => x.type === 'test' && x.good === false ).length;
      scraps += inTime.filter( x => x.type === 'scrap' && x.good === true ).length;
    }
    
    resolve({completedItems, testFail, scraps});
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
        seriesSlice = await findRelevantSeries(orgKey, from, to);
        seriesArange = await loopSerieses(seriesSlice, from, to);
        itemStats = await loopItems(seriesArange.allItems, from, to);
        nonConStats = !nc ? [] : await loopNonCons(seriesArange.allNonCons, from, to);
        shortfallStats = nc ? [] : await loopShortfalls(seriesArange.allShortfalls, from, to);
        
        const seriesInclude = seriesSlice.length;
        const itemsInclude = seriesArange.allItems.length;
        //const itemsWithPercent = ( ( nonConStats.uniqueSerials / itemsInclude ) * 100 ).toFixed(1) + '%';
        
        return JSON.stringify({
          seriesInclude, itemsInclude, itemStats, nonConStats, shortfallStats
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return getBatches();
  }
  
})