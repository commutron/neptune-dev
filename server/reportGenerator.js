import moment from 'moment';
import timezone from 'moment-timezone';
import { Interval, DateTime } from 'luxon';
// import Config from '/server/hardConfig.js';

import { 
  countMulti, 
  toLxDayStart, 
  toLxDayEnd,
  appValue
} from '/server/utility.js';

import { batchTideTime } from '/server/tideGlobalMethods';

function findRelevantSeries(from, to) {
  return new Promise(resolve => {
    const accessKey = Meteor.user().orgKey;
    const xid = appValue(accessKey, "internalID");
    
    let batchPack = XBatchDB.find({
      orgKey: accessKey,
      groupId: { $ne: xid },
      $and : [
        { createdAt: { $lte: new Date( to ) } },
        { $or : [ 
          { completed : false }, 
          { completedAt : { $gte: new Date( from ) } } 
        ] }
      ]
    },{fields:{'batch':1}})
    .map( (c)=> c.batch, []);
    
    const seriesPack = XSeriesDB.find({batch: { $in: batchPack }}).fetch();

    resolve(seriesPack);
  });
}

function loopSeriesesAll(serieses) {
  return new Promise(resolve => {
    let allItems = [];
    let allNonCons = [];
    let allShortfalls = [];
    
    for(let srs of serieses) {
      allNonCons.push(...srs.nonCon.filter( n => !n.trash && !(n.inspect && !n.fix) ));
      allShortfalls.push(...srs.shortfall);
      allItems.push(...srs.items);
    }
    resolve({allItems, allNonCons, allShortfalls});
  });
}

function loopSeriesesNC(serieses, interval) {
  return new Promise(resolve => {
    let totalSerials = 0;
    let allNonCons = [];
    for(let srs of serieses) {
      const itemQty = srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0;
      totalSerials += itemQty;
      
      const scopeNC = srs.nonCon.filter( n => !n.trash && !(n.inspect && !n.fix) && interval.contains(DateTime.fromJSDate(n.time)));

      allNonCons.push(...scopeNC);
    }
    resolve({totalSerials, allNonCons});
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

function loopNonCons(nonCons, from, to) {
  return new Promise(resolve => {
    const inTime = nonCons.filter( x => moment(x.time).isBetween(from, to) );
    const foundNC = countMulti(inTime);
    
    let serials = new Set();
    
    for(let nt of inTime) {
      serials.add(nt.serial);
    }
    const uniqueSerials = serials.size;
    
    resolve({foundNC, uniqueSerials});
  });
}

function loopNonConsCross(nonCons, branch) {
  return new Promise(resolve => {
    const inTime = nonCons; // prefiltered .filter( x => moment(x.time).isBetween(from, to) );
    const brAll = !branch || branch === 'ALL';
    const foundNC = brAll ? countMulti(inTime) : 0;
    
    let serials = new Set();
    
    let types = new Set();
    let wheres = new Set();
    
    for(let nt of inTime) {
      types.add(nt.type);
      serials.add(nt.serial);
      if(brAll) {
        wheres.add(nt.where);
      }else{
        wheres.add(branch);
      }
    }
    if(!brAll) {
      wheres.add(branch);
    }
    
    const locals = [...wheres].sort();
    
    let crossref = brAll ? [["",...locals,"Total"]] : [["",...locals]];
    
    let endline = Array.from(locals, ()=> 0);
    
    for(let type of types) {
      // const ncOfType = inTime.filter( n => n.type === type );
      
      let whArr = [type];
      let tyTtl = 0;
      for(const [index, loc] of locals.entries()) {
        let whCount = 0;
        for(let ncW of inTime) {
          if(ncW.type === type) {
            if(ncW.where === loc) {
              whCount += ( Number(ncW.multi) || 1 );
            }
          }
        }
        whArr.push( whCount );
        tyTtl += whCount;
        endline[index] += whCount;
      }
      if(brAll) {
        whArr.push(tyTtl);
      }
      if(brAll || tyTtl > 0) {
        crossref.push(whArr);
      }
    }
    if(brAll) {
      crossref.push(["total",endline,foundNC].flat());
    }else{
      crossref.push(["total",endline].flat());
    }
    
    const uniqueSerials = serials.size;
    
    resolve({foundNC, uniqueSerials, crossref});
  });
}


Meteor.methods({
  
  buildKPInDepthReport(startDay, endDay, dataset) {
    const startLx = toLxDayStart(startDay, "yyyy-LL-dd");
    const from = startLx.toISO();
    const endLx = toLxDayEnd(endDay, "yyyy-LL-dd");
    const to = endLx.toISO();
    
    const dn = dataset === 'completed';
    
    async function getBatches() {
      try {
        seriesSlice = await findRelevantSeries(from, to);
        seriesArange = await loopSeriesesAll(seriesSlice, from, to);
        itemStats = dn ? [] : await loopItems(seriesArange.allItems, from, to);
        nonConStats = dn ? [] : await loopNonCons(seriesArange.allNonCons, from, to);
        nonConItemStats = !dn ? [] : await loopNCItems(seriesArange.allItems, from, to, seriesArange.allNonCons);
        shortfallStats = dn ? [] : await loopShortfalls(seriesArange.allShortfalls, from, to);
        
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
  },
  
  buildNonConReport(startDay, endDay, branch) {
    const startLx = toLxDayStart(startDay, "yyyy-LL-dd");
    const endLx = toLxDayEnd(endDay, "yyyy-LL-dd");

    const interval = Interval.fromDateTimes(startLx, endLx);
    
    const from = startLx.toISO();
    const to = endLx.toISO();
    
    async function getBatches() {
      try {
        seriesSlice = await findRelevantSeries(from, to);
        seriesArangeNC = await loopSeriesesNC(seriesSlice, interval);
        nonConStats = await loopNonConsCross(seriesArangeNC.allNonCons, branch);
        
        const seriesInclude = seriesSlice.length;
        const itemsInclude = seriesArangeNC.totalSerials;
       
        return JSON.stringify({
          seriesInclude, itemsInclude, nonConStats
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return getBatches();
  },
  
  getBrItemsSpan(branch, spanDay, qkeys, subtasks, tsteps) {
    const startLx = toLxDayStart(spanDay, "yyyy-LL-dd", 'month');
    const endLx = toLxDayEnd(spanDay, "yyyy-LL-dd", 'month');
    const interval = Interval.fromDateTimes(startLx, endLx);
    const from = startLx.toISO();
    const to = endLx.toISO();
    
    const chkT = (t)=> interval.contains(DateTime.fromJSDate(t));
    
    const accessKey = Meteor.user().orgKey;
    const xid = appValue(accessKey, "internalID");
    const bRx = new RegExp(branch, 'i');
    
    const tlist = tsteps.join('|');
    const iRx = new RegExp(tlist, 'i');
    
    // const num = (si)=> si.length > 0 ? si.reduce((t,i)=> t + i.units, 0) : 0;
    const num = (si)=> si.length;
    
    const scp = (si)=> {
      if(si.length === 0) {
        return 0;
      }else{
        return si.reduce((t,i)=> {
          if(i.scrapped === true && i.history.find( h => h.type === 'scrap' && h.good === true) ) {
            return t + 1;
          }else{
            return t;
          }
        }, 0);
      }
    };
    
    const nserial = (narr)=> {
      let ncScope = new Set();
      for(let n of narr) {
        ncScope.add(n.serial);
      }
      return ncScope.size;
    };
    
    const asPcnt = (val, total)=> {
      if(val === 0) {
        return 0;
      }else{
        const prcnt = ((val / total) * 100 );
        return prcnt < 1 ? prcnt.toFixed(1) : prcnt.toFixed(0);
      }
    };
    
    let batchNums = [];
    
    const batchPack = XBatchDB.find({
      orgKey: accessKey,
      groupId: { $ne: xid },
      $and : [
        { createdAt: { $lte: new Date( to ) } },
        { $or : [ 
          { completed : false }, 
          { completedAt : { $gte: new Date( from ) } } 
        ] }
      ]
    },{fields:{
      'batch': 1,
      'widgetId': 1,
      'quoteTimeCycles': 1,
      'serialize': 1,
      'tide': 1
    }})
    .map( b => {
      if(b.serialize) {
        batchNums.push(b.batch);
      }
      
      const spantide = (b.tide || []).filter( x => chkT(x.startTime) );
      const minutesTotal = batchTideTime(spantide);
      
      const qttide = spantide.filter( x => qkeys.includes(x.qtKey) );
      
      const subtide = spantide.filter( x => subtasks.includes(x.subtask) );
      
      const quoteTimes = (b.quoteTimeCycles || []).filter( q=> qkeys.includes(q[0]) );
      
      return [
        ['batch', b.batch],
        ['widget id', b.widgetId],
        ['tides in span by qtkey', qttide.length],
        ['tides in span by subtask', subtide.length],
        ['quoted qtasks', quoteTimes],
        ['total logged minutes', minutesTotal]
      ];
    },[]);
      
    const seriesPack = XSeriesDB.find({
      batch: { $in: batchNums }
      },{fields:{'batch':1,'items':1,'nonCon':1}})
    .map( (srs)=> {
     
      const itemQty = num(srs.items);
      const scrap = scp(srs.items);
      
      const nbch = srs.nonCon.filter( (n)=> bRx.test(n.where) && !n.trash && !(n.inspect && !n.fix) );
      const nbchNCsrls = nserial(nbch);
      
      const ncprcnt = asPcnt(nbchNCsrls, itemQty);
      
      // Processed in time period
      const ispan = srs.items.filter( (i)=> i.history.find( h => iRx.test(h.step) && chkT(h.time)) );
      const ispanQty = num(ispan);
      const ispanScp = scp(ispan);
      
      const spanserialsNC = ispan.filter( i=> nbch.find( n=> n.serial === i.serial ) ).length;
      // const nspan = ndpmnt.filter( (n)=> spanserials.includes(n.serial) );
      // const nspanNCsrls = nserial(nspan);
      const ncspanprcnt = asPcnt(spanserialsNC, ispanQty);
      
      return [
        ['batch', srs.batch],
        ['total quantity', itemQty],
        ['total scrap', scrap],
        ['total serials with noncons', nbchNCsrls],
        ['percent of serials with noncons', ncprcnt],
        ['processed quantity', ispanQty],
        ['processed scrap', ispanScp],
        ['processed with noncons', spanserialsNC],
        ['percent of processed with noncons', ncspanprcnt],
      ];
    },[]);
    
    // console.log([ batchPack.length, seriesPack.length ]);
    
    return {
      batch: batchPack,
      series: seriesPack 
    };
  },
  
})