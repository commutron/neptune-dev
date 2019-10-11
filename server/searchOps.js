import moment from 'moment';
import timezone from 'moment-timezone';
import business from 'moment-business';


export function whatIsBatch(keyword) {
  const batch = BatchDB.findOne({batch: keyword});
  if(!batch) {
    return false;
  }else{
    const widget = WidgetDB.findOne({_id: batch.widgetId});
    const version = widget.versions.find( x => x.versionKey === batch.versionKey);
    const group = GroupDB.findOne({_id: widget.groupId});
    const nice = `${group.alias.toUpperCase()} ${widget.widget.toUpperCase()} v.${version.version}`;
    return nice;
  }
}
export function whatIsBatchX(keyword) {
  const batch = XBatchDB.findOne({batch: keyword});
  const widget = WidgetDB.findOne({_id: batch.widgetId});
  const version = widget.versions.find( x => x.versionKey === batch.versionKey);
  const group = GroupDB.findOne({_id: batch.groupId});
  const nice = `${group.alias.toUpperCase()} ${widget.widget.toUpperCase()} v.${version.version}`;
  return nice;
}
/*
function getBatch(batchNum) {  
  return new Promise(resolve => { 
    const batch = BatchDB.findOne({batch: batchNum});
    resolve(batch);
  });
}
function getWidget(widgetId) {  
  return new Promise(resolve => { 
    const widget = WidgetDB.findOne({_id: widgetId});
    resolve(widget);
  });
}
function getVersion(widget, vKey) {  
  return new Promise(resolve => { 
    const version = widget.versions.find( x => x.versionKey === vKey);
    resolve(version);
  });
}
function getGroup(groupId) {  
  return new Promise(resolve => { 
    const group = GroupDB.findOne({_id: groupId});
    resolve(group);
  });
}

function unitTotalCount(items) {
  let totalUnits = 0;
  for(let i of items) {
    totalUnits += i.units;
  }
  return totalUnits;
}

*/
    
Meteor.methods({
  
  engagedState() {
    const user = Meteor.user();
    const eg = user && user.engaged;
    if(!eg) {
      return false;
    }else{
      const batch = BatchDB.findOne({'tide.tKey': eg.tKey, 'tide.who': Meteor.userId()});
      return batch.batch || false;
    }
  },
  
  getBasicBatchInfo(keyword) {
    const niceString = whatIsBatch(keyword) || whatIsBatchX(keyword);
    const niceObj = {
      batch: keyword, 
      isWhat: niceString
    };
    return niceObj;
  },
  
  serialLookup(orb) {
    const itemsBatch = BatchDB.findOne({'items.serial': orb});
    const found = itemsBatch ? itemsBatch.batch : false;
    return found;
  },
  
  serialLookupPartial(orb) {
    const bCache = CacheDB.findOne({orgKey: Meteor.user().orgKey, dataName: 'batchInfo'});
    const itemsBatch = BatchDB.find({
      "items.serial": { $regex: new RegExp( orb ) }
    }).fetch();
    const single = itemsBatch.length === 1;
    const exact = !single ? false : 
      itemsBatch[0].items.find( x => x.serial === orb ) ? true : false;
    //const results = Array.from(itemsBatch, x => x.batch);
    const results = [];
    for(let iB of itemsBatch) {
      let fill = bCache.dataSet.find( x => x.batch === iB.batch);
      results.push({
        batch: iB.batch, 
        meta: !fill ? undefined : fill.isWhat,
      });
    }
      
    return { results, exact };
  },
  
 /*
  autofillInfo(keyword) {
    const batch = BatchDB.findOne({batch: keyword});
    const widget = WidgetDB.findOne({_id: batch.widgetId});
    const version = widget.versions.find( x => x.versionKey === batch.versionKey);
    const group = GroupDB.findOne({_id: widget.groupId});
    const niceString = `${group.alias.toUpperCase()} ${widget.widget.toUpperCase()} v.${version.version}`;
    return niceString;
  },
  */
  quickVersion(vKey) {
    const widget = WidgetDB.findOne({'versions.versionKey': vKey});
    const version = widget ? widget.versions.find( x => x.versionKey === vKey) : false;
    const found = version.version;
    return found;
  },
  
  topViewStats(u, g, w, b, a) {
    const usrC = u ? Meteor.users.find({orgKey: Meteor.user().orgKey}).fetch().length : 0;
    const grpC = g ? GroupDB.find({orgKey: Meteor.user().orgKey}).fetch().length : 0;
    const wdgtC = w ? WidgetDB.find({orgKey: Meteor.user().orgKey}).fetch().length : 0;
    const btch = b ? BatchDB.find({orgKey: Meteor.user().orgKey}).fetch() : [];
    const btchC = b ? btch.length : 0;
    const btchLv = a ? btch.filter( x => x.finishedAt === false ).length : 0;
    return {
      usrC, grpC, wdgtC, btchC, btchLv
    };
  },
  
  popularWidgets() {
    const wdgts = WidgetDB.find({orgKey: Meteor.user().orgKey}).fetch();
    let numOfwdgt = [];
    for(let w of wdgts) {
      const num = BatchDB.find({widgetId: w._id}).fetch().length;
        numOfwdgt.push({group: w.groupId, meta: w.widget, value: num});
    }
    return numOfwdgt.sort((a, b)=> { return b.value - a.value });
  },
  
  widgetTops(wID) {
    const batches = BatchDB.find({orgKey: Meteor.user().orgKey, widgetId: wID}).fetch();
    const batchesX = XBatchDB.find({orgKey: Meteor.user().orgKey, widgetId: wID}).fetch();
    const batchInfo = Array.from(batches, x => { return { 
      start: x.start,
      finish: x.finishedAt,
      items: x.items.length,
      nonCons: x.nonCon.length,
    }});
    const batchInfoX = Array.from(batchesX, x => { return { 
      start: x.salesStart,
      complete: x.completedAt,
      quantity: x.quantity,
      nonCons: x.nonconformaces.length,
    }});
    return { batchInfo, batchInfoX };
  },
  
    ///////////////////////////////////////////////////////////////////////////////////
  
   // Layered History Rate
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  layeredHistoryRate(start, end, flowData, itemData, clientTZ) {
    let now = moment().tz(clientTZ);
    const endDay = end !== false ? 
      moment(end).endOf('day').add(2, 'd') : 
      now.clone().endOf('day').add(1, 'd');
    const startDay = moment(start).tz(clientTZ).endOf('day');
    const howManyDays = endDay.diff(startDay, 'day');
    
    //const b = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    //const itemData = b ? b.items : [];
    // + Alt handling
    const flowKeys = Array.from( 
                      flowData.filter( x => x.type !== 'first'), 
                        x => x.key );

    const outScrap = (itms)=> { return ( 
                                  itms.filter( 
                                    x => x.history.filter( 
                                      y => y.type === 'scrap' )
                                        .length === 0 ) ) };
    const items = outScrap(itemData); // without scraps
    const totalItems = items.length;
    
    const allItemHistory = Array.from( items, 
                              x => x.history.filter( 
                                y => y.type !== 'first' && y.good === true) );
    const historyFlat = [].concat(...allItemHistory);
    
    
    function historyPings(history, totalItems, flowKey, day) {
      const pings = history.filter( 
                      y => y.key === flowKey &&
                       moment(y.time).isSameOrBefore(day)
                    ).length;
      const remain = totalItems - pings;
      return remain;
    }
    
    function loopDays(historyFlat, totalItems, startDay, howManyDays, flowKey) {
      let historyRemainOverTime = [];
      
      for(let i = 0; i < howManyDays; i++) {
        const day = startDay.clone().add(i, 'day');
        
        if(business.isWeekDay(day)) {
          const historyRemain = historyPings(historyFlat, totalItems, flowKey, day);
          historyRemainOverTime.push({
            x: new Date( day.format() ),
            y: historyRemain
          });

          if(historyRemain === 0) { break }
        }
      }
      return historyRemainOverTime;
    }
    
    let flowSeries = [];
    for(let flowKey of flowKeys) {
      const dayCounts = loopDays(historyFlat, totalItems, startDay, howManyDays, flowKey);
      flowSeries.push({
        name: flowKey,
        data: dayCounts
      });
    }
    
    /*
    let timeLabels = [];
    for(let i = 0; i < howManyDays; i++) {
      const day = startDay.clone().add(i, 'day');
      if(business.isWeekDay(day)) {
        timeLabels.push(day.format() );
      }
    }
    */
    return flowSeries;
  },
  
      /////////////////////////////////////////////////////////////////////////
  
    // First Firsts
  
  ///////////////////////////////////////////////////////////////////////////
  
  firstFirst(batchId, clientTZ) {
    const b = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    let first = moment();
    if(!b) { null }else{
      for(let i of b.items) {
        let firstHistory = i.history[0];
        if(!firstHistory || moment(firstHistory.time).isSameOrAfter(first)) {
          null;
        }else{
          first = moment(firstHistory.time);
        }
      }
    }
    return first.tz(clientTZ).format();
  },
  
  
  ///////////////////////////////////////////////////////////////////////////////////
  
    // Counts Of Batches Tide Time
  
  ///////////////////////////////////////////////////////////////////////////////////
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
        return flatTypeList;
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
    
    /*
    // number of each nonCon type discovered in the window
    const aNCOps = AppDB.findOne({orgKey: Meteor.user().orgKey}).nonConOption;
    let ncTypeCounts = [];
    for(let ncType of aNCOps) {
      let typNum = 0;
      for(let b of relevantBatches) {
        let count = relevantNC(b.nonCon).filter( x => x.type === ncType );
        typNum += count.length;
      }
      ncTypeCounts.push({meta: ncType, value: typNum});
    }
    */
  },

      ///////////////////////////////////////////////////////////////////////////////////
  
    // Best and Worst batches by nonconformance
  
  ///////////////////////////////////////////////////////////////////////////////////
  /*
  BestWorstStats(best, worst, start, end, newOnly) {
    
    const allBatches = BatchDB.find({orgKey: Meteor.user().orgKey}).fetch();
    
    // time window - without timezone corection, assumes the server is onsite
    const from = !start ? 
                  moment().startOf('week').format() :
                  moment(start).startOf('day').format();
    const to = !end ? 
                moment().endOf('week').format() :
                moment(end).endOf('day').format();
      
    const inWindow = (finishedAt, createdAt)=>
      finishedAt !== false ?
      moment(finishedAt).isBetween(from, to) :
      moment(createdAt).isBefore(to);
      
    const relevantBatches = allBatches.filter( x => 
                              ( x.floorRelease === undefined || x.floorRelease === true) &&
                              inWindow(x.finishedAt, x.createdAt) === true );
    //  limit Low batches to only finished                       
    // const doneBatches = allBatches.filter( x => 
    //                       x.finishedAt !== false &&
    //                       moment(x.finishedAt).isBetween(from, to) === true );
    //                          
    const relevantNC = (ncArray)=>
                        !newOnly ? ncArray :
                        ncArray.filter( x => moment(x.time).isBetween(from, to) );
    
    let bestNC = [];
    let worstNC = [];
  
    // low filter
    const lowNC = relevantBatches.filter( x => relevantNC(x.nonCon).length <= best );
    //const lowNC = doneBatches.filter( x => relevantNC(x.nonCon).length <= best ); 
    const bestBatchNC = Array.from(lowNC,
                          x => { 
                            return ( {
                              b: x.batch,
                              w: x.widgetId,
                              v: x.versionKey,
                              done: x.finishedAt !== false,
                              value: relevantNC(x.nonCon).length } 
                          )}).sort((a, b)=> { 
                               return a.done === true ? a : a.value - b.value });
    // high filter
    const highNC = relevantBatches.filter( x => relevantNC(x.nonCon).length >= worst );
    const worstBatchNC = Array.from(highNC,
                          x => { 
                            return ( {
                              b: x.batch,
                              w: x.widgetId,
                              v: x.versionKey,
                              done: x.finishedAt !== false,
                              value: relevantNC(x.nonCon).length }
                          )}).sort((a, b)=> { return b.value - a.value });
    bestNC = bestBatchNC;
    worstNC = worstBatchNC;

    return {
      bestNC, worstNC
    };
  },
  */
  
  ///////////////////////////////////////////////////////////////////////////////////
  
    // Ranked Widgets by nonconformance
  
  ///////////////////////////////////////////////////////////////////////////////////
  /*
  BestWorstWidgetsStats() {
    
    function countWidgetNonCons(allWidgets) {
      const itsBatches = (wID) => BatchDB.find({orgKey: Meteor.user().orgKey, widgetId: wID}).fetch();
      
      return new Promise(resolve => {
        let widgetStats = [];
        for(let w of allWidgets) {
          const group = GroupDB.find({_id: w.groupId}).fetch();
          const groupAlias = group.alias;
          const batches = itsBatches(w._id);
          let ncCount = [];
          for(let b of batches) {
            ncCount.push(b.nonCon.length);
          }
          ncCount.reduce( x, y => x + y);
          widgetsStats.push({ group: groupAlias, widget: w.widget, ncCount: ncCount});
        }
        resolve(widgetStats);
      });
    }
    
    async function getStats() {
      const allWidgets = WidgetDB.find({orgKey: Meteor.user().orgKey}).fetch();
      try {
        widgetStats = await countWidgetNonCons(allWidgets);
        const widgetStatsSort = widgetStats.sort((a, b)=> { return a.ncCount - b.ncCount });
        return {widgetStatsSort};
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    
    return getStats();
  },
  */
  ///////////////////////////////////////////////////////////////////////////////////
  
  // nonCon Rate
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  nonConRateLoop(batches) {

    const allNC = Array.from( batches, x => BatchDB.findOne({batch: x}).nonCon );
    
    function oneRate(theseNC) {
      
      function recordedNC(noncons, qDay) {
        let relevant = noncons.filter(
                        x => moment(x.time)
                          .isSameOrBefore(qDay, 'day') );
        let ncPack = {
          'x': new Date(qDay),
          'y': relevant.length
        };
        return ncPack;
      }
      
      const begin = moment(theseNC[0].time);
      const end = moment(theseNC[theseNC.length - 1].time);
      const range = end.diff(begin, 'day') + 2;
      
      let nonconSet = [];
      // let labelSet = [];
      for(let i = 0; i < range; i++) {
        let qDay = begin.clone().add(i, 'day').format();
        
        let ncCount = recordedNC(theseNC, qDay);
        nonconSet.push(ncCount);
        // labelSet.push(ncCount.meta);
      }
      // return { counts: nonconSet, labels: labelSet };
      return nonconSet;
    }
    
    nonconCollection = [];
    for(let nc of allNC) {
      if(nc.length > 0) {
        let rateLoop = oneRate(nc);
        nonconCollection.push(rateLoop);
      }else{null}
    }
    
    // const allCounts = Array.from( nonconCollection, x => x.counts );
    
    // let buildLabels = [];
    // let combine = Array.from( nonconCollection, x => x.labels );
    // combine.forEach( x => x.forEach( y => buildLabels.push(y) ) );
    
    // let allLabels = [... new Set( buildLabels ) ];
    
    // return { counts: allCounts, labels: allLabels };
    return nonconCollection;
  },
  
  
   ///////////////////////////////////////////////////////////////////////////////////
  
  // Scrap Items
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  scrapItems() {
    const batchWithScrap = BatchDB.find({
                            orgKey: Meteor.user().orgKey,
                            'items.history.type': 'scrap'
                          }).fetch();
    let compactData = [];
    for(let b of batchWithScrap) {
      const w = WidgetDB.findOne({_id: b.widgetId});
      const g = GroupDB.findOne({_id: w.groupId});
      const items = b.items.filter( 
                      x => x.history.find( 
                        y => y.type === 'scrap' ) );
      compactData.push({
        batch: b.batch,
        widget: w.widget,
        group: g.alias,
        items: items
      });
    }
    return compactData;
  },
  
  
   ///////////////////////////////////////////////////////////////////////////////////
  
  // Component Search
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  componentFind(num, batchInfo, unitInfo) {
    const widgets = WidgetDB.find({'versions.assembly.component': num}).fetch();
    const data = [];
    for(let w of widgets) {
      let findG = GroupDB.findOne({ _id: w.groupId });
      let findV = w.versions.filter( x => x.assembly.find( y => y.component === num));
      let versions = [];
      for(let v of findV) {
        let batches = [];
        if(batchInfo) {
          const findB = BatchDB.find({live: true, versionKey: v.versionKey}).fetch();
          batches = Array.from(findB, x => { 
                                  countI = 0;
                                  unitInfo ? 
                                    x.items.forEach( y => countI += y.units )
                                  : null;
                                  return {
                                    btch: x.batch,
                                    cnt: countI
                                } } );
        }else{null}
        versions.push({ 
          vKey: v.versionKey,
          ver: v.version,
          places: 1,
          //v.assembly.filter( x => x.component === num ).length,
          btchs: batches
        });
      }
      data.push({ 
        wdgt: w.widget,
        dsc: w.describe,
        grp: findG.alias,
        vrsns: versions
      });
    }
    return data;
  },
  
     ///////////////////////////////////////////////////////////////////////////////////
  
  // Component Export
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  componentExportAll() {
    const widgets = WidgetDB.find({orgKey: Meteor.user().orgKey}).fetch();
    const data = [];
    for(let w of widgets) {
      for(let v of w.versions) {
        for(let a of v.assembly) {
          data.push(a.component);
        }
      }
    }
    const cleanData = [... new Set(data) ].sort();
    return cleanData;
  },
  
  componentExport(wID, vKey) {
    const widget = WidgetDB.findOne({_id: wID, orgKey: Meteor.user().orgKey});
    const data = [];
    const version = widget ? widget.versions.find( x => x.versionKey === vKey ) : null;
    if(version) {
      for(let a of version.assembly) {
        data.push(a.component);
      }
    }
    let cleanData = [... new Set(data) ].sort();
    cleanData.unshift(version.version);
    cleanData.unshift(widget.widget);
    return cleanData;
  },

  
});