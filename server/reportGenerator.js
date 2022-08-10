import moment from 'moment';
import timezone from 'moment-timezone';
import Config from '/server/hardConfig.js';

import { countMulti } from '/server/utility.js';


function findRelevantSeries(from, to) {
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
      },{fields:{'batch':1,'groupId':1}}).fetch();
    
    let seriesPack = [];
    for(let b of batchPack) {
      const g = GroupDB.findOne({_id: b.groupId});
      const srs = XSeriesDB.findOne({batch: b.batch});
      if(srs && !g.internal) {
        seriesPack.push(srs);
      }
    }
    
    resolve(seriesPack);
  });
}

function loopSerieses(serieses) {
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
    const foundSH = countMulti(inTime);
    
    let serials = new Set();
    
    let numBreakdown = [];
    let parts = new Set();
    for(let sh of inTime) {
      parts.add(sh.partNum);
      serials.add(sh.serial);
    }
    for(let part of parts) {
      let ptTotal = 0;
      for(let shP of inTime) {
        if(shP.partNum === part) {
          ptTotal += ( Number(shP.multi) || 1 );
        }
      }
      numBreakdown.push( [ part, ptTotal ] );
    }
    
    const uniqueSerials = serials.size;
    
    resolve({ foundSH, uniqueSerials, numBreakdown });
  });
}

function loopItems(items, from, to) {
  return new Promise(resolve => {
    let completedItems = 0;
    let testFail = 0;
    let itemsFail = 0;
    let itemsRapid = 0;
    let scraps = 0;
    for(let i of items) {
      if(i.completed && moment(i.completedAt).isBetween(from, to) ) { 
        completedItems += 1;
      }
      const inTime = i.history.filter( x => moment(x.time).isBetween(from, to) );
      
      const didFail = inTime.filter( x => x.type === 'test' && x.good === false ).length;
      if(didFail > 0) {
        testFail += didFail;
        itemsFail += 1;
      }
      const didRap = i.altPath.filter( a => a.rapId !== false && moment(a.assignedAt).isBetween(from, to) ).length;
      if(didRap > 0) {
        itemsRapid += didRap;
      }
      i.scrapped === true && inTime.find( x => x.type === 'scrap' && x.good === true ) ?
        scraps += 1 : null;
    }
    
    resolve({completedItems, testFail, itemsFail, itemsRapid, scraps});
  });
}

function loopNCItems(items, from, to, nonCons) {
  return new Promise(resolve => {
    const completedItems = items.filter( i=> i.completed && moment(i.completedAt).isBetween(from, to) );
    const completedNum = completedItems.length;
    
    let ncItemsNum = 0;
    let ncTotalNum = 0;
    
    let itemsFail = 0;
    let testFail = 0;
    let itemsRapid = 0;
    let scraps = 0;
    
    for(let it of completedItems) {
      const itNC = nonCons.filter( x => x.serial === it.serial );
      if(itNC.length > 0) {
        ncItemsNum += 1;
        const cNC = countMulti(itNC);
        ncTotalNum += Number(cNC);
      }
      
      const didFail = it.history.filter( x => x.type === 'test' && x.good === false ).length;
      if(didFail > 0) {
        testFail += didFail;
        itemsFail += 1;
      }
      
      const didRap = it.altPath.filter( a => a.rapId !== false ).length;
      if(didRap > 0) {
        itemsRapid += didRap;
      }
      
      if(it.scrapped === true && it.history.find( x => x.type === 'scrap' && x.good === true ) ) {
        scraps += 1;
      }
    }
    
    resolve({completedNum, ncItemsNum, ncTotalNum, itemsFail, testFail, itemsRapid, scraps});
  });
}

function loopNonCons(nonCons, from, to, flatTypeListClean) {
  return new Promise(resolve => {
    const inTime = nonCons.filter( x => moment(x.time).isBetween(from, to) );
    const foundNC = countMulti(inTime);
    
    let serials = new Set();
    
    let typeBreakdown = [];
    let types = new Set();
    for(let nt of inTime) {
      types.add(nt.type);
      serials.add(nt.serial);
    }
    for(let type of types) {
      let tyTotal = 0;
      for(let ncT of inTime) {
        if(ncT.type === type) {
          tyTotal += ( Number(ncT.multi) || 1 );
        }
      }
      typeBreakdown.push( [ type, tyTotal ] );
    }
    
    let whereBreakdown = [];
    let wheres = new Set();
    for(let nw of inTime) {
      wheres.add(nw.where);
    }
    for(let where of wheres) {
      let whTotal = 0;
      for(let ncW of inTime) {
        if(ncW.where === where) {
          whTotal += 1;
        }
      }
      whereBreakdown.push( [where, whTotal ] );
    }
    
    const uniqueSerials = serials.size;
    
    resolve({foundNC, uniqueSerials, typeBreakdown, whereBreakdown});
  });
}


Meteor.methods({
  
  buildProblemReport(startDay, endDay, dataset) {
      
    const from = moment(startDay).tz(Config.clientTZ).startOf('day').format();
    const to = moment(endDay).tz(Config.clientTZ).endOf('day').format();
    const nc = dataset === 'noncon';
    const dn = dataset === 'completed';
    
    async function getBatches() {
      try {
        seriesSlice = await findRelevantSeries(from, to);
        seriesArange = await loopSerieses(seriesSlice, from, to);
        itemStats = dn ? [] : await loopItems(seriesArange.allItems, from, to);
        nonConStats = !nc ? [] : await loopNonCons(seriesArange.allNonCons, from, to);
        nonConItemStats = !dn ? [] : await loopNCItems(seriesArange.allItems, from, to, seriesArange.allNonCons);
        shortfallStats = nc || dn ? [] : await loopShortfalls(seriesArange.allShortfalls, from, to);
        
        const seriesInclude = seriesSlice.length;
        const itemsInclude = seriesArange.allItems.length;
       
        return JSON.stringify({
          seriesInclude, itemsInclude, itemStats, 
          nonConStats, nonConItemStats, 
          shortfallStats
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return getBatches();
  }
  
})