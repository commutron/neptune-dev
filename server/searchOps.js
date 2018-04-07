import moment from 'moment';
import timezone from 'moment-timezone';

Meteor.methods({
  
  serialLookup(orb) {
    const itemsBatch = BatchDB.findOne({'items.serial': orb});
    const found = itemsBatch ? itemsBatch.batch : false;
    return found;
  },
  
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
    return numOfwdgt;
  },

// Best and Worst batches by nonconformance
  BestWorstStats(best, worst, start, end, newOnly, widgetSort) {
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
                              inWindow(x.finishedAt, x.createdAt) === true );
                              
    const relevantNC = (ncArray)=>
                        !newOnly ? ncArray :
                        ncArray.filter( x => moment(x.time).isBetween(from, to) );
    
    let bestNC = [];
    let worstNC = [];
    
    if( !widgetSort ) {
      // low filter
      const lowNC = relevantBatches.filter( x => relevantNC(x.nonCon).length <= best ); 
      const bestBatchNC = Array.from(lowNC,
                            x => { 
                              return ( 
                                {b: x.batch, w: x.widgetId, value: relevantNC(x.nonCon).length} 
                            )}).sort((a, b)=> { return a.value - b.value });
      // high filter
      const highNC = relevantBatches.filter( x => relevantNC(x.nonCon).length >= worst );
      const worstBatchNC = Array.from(highNC,
                            x => { 
                              return ( 
                                {b: x.batch, w: x.widgetId, value: relevantNC(x.nonCon).length}
                            )}).sort((a, b)=> { return b.value - a.value });
      bestNC = bestBatchNC;
      worstNC = worstBatchNC;
    }else{
      const widgetsInWindow = new Set( Array.from(relevantBatches, x => x.widgetId ));
      countsBywidget = [];
      for(let wW of [...widgetsInWindow]) {
        let wBstack = relevantBatches.filter( x => x.widgetId === wW );
        let wTotal = 0;
        for(let b of wBstack) {
          let bTotal = relevantNC(b.nonCon).length;
          wTotal += bTotal;
        }
        countsBywidget.push({b: wBstack.length, w: wW, value: wTotal});
      }
      // low filter
      const bestWidgetNC = countsBywidget.filter( x => x.value <= best )
                            .sort((a, b)=> { return a.value - b.value });
      // high filter
      const worstWidgetNC = countsBywidget.filter( x => x.value >= worst )
                            .sort((a, b)=> { return b.value - a.value });
      bestNC = bestWidgetNC;
      worstNC = worstWidgetNC;
    }

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

    return {
      bestNC, worstNC, ncTypeCounts
    };
  },
  
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  // History Rate
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  /*
  historyPings(batches, startRange, endRange) {
    let count = 0;
    for(let b of batches) {
      for(let i of b.items) {
        let pings = i.history.filter( 
                      x => moment(x.time)
                            .isBetween(startRange, endRange) );
        count += pings.length;
      }
    }
    return count;
  },
  */
  
  historyRate(start, end, flowData, flowAltData, itemData, clientTZ) {
    //const b = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey});
    //const itemData = b ? b.items : [];
    const flowKeys = Array.from( 
                      flowData.filter( x => x.type !== 'first'), 
                        x => x.key );
    const altKeys = Array.from( 
                      flowAltData.filter( x => x.type !== 'first'), 
                        x => x.key );
    const outScrap = (itms)=> { return ( 
                                  itms.filter( 
                                    x => x.history.filter( 
                                      y => y.type === 'scrap' )
                                        .length === 0 ) ) };
    // split flows, filter scraps
    let regItems = itemData;
    let altItems = [];
      
    if(altKeys.length === 0) {
      regItems = outScrap(regItems);
    }else{
      regItems = outScrap( itemData.filter( x => x.alt === false || x.alt === 'no' ) );
      altItems = outScrap( itemData.filter( x => x.alt === 'yes' ) );
    }
    
    const totalRegSteps = flowKeys.length * regItems.length;
    const totalAltSteps = altKeys.length * altItems.length;
    
    let now = moment().tz(clientTZ);
    const endDay = end !== false ? moment(end).endOf('day') : now.clone().endOf('day');
    const startDay = moment(start).endOf('day');
    const howManyDays = endDay.diff(startDay, 'day') + 1;
    
    function historyPings(regItems, flowKeys, totalSteps, day) {
      let count = 0;
      for(let ky of flowKeys) {
        const ping = regItems.filter( 
                      x => x.history.find( 
                        y => y.key === ky &&
                             y.good === true &&
                             moment(y.time).isSameOrBefore(day) ) );
        count += ping.length;
      }
      const remain = totalSteps - count;
      return remain;
    }
    
    let historyPingsOT = [];
    let labelsOT = [];
    for(let i = 0; i < howManyDays; i++) {
      const day = startDay.clone().add(i, 'day');
      
      const historyCountR = historyPings(regItems, flowKeys, totalRegSteps, day);
      const historyCountA = historyPings(altItems, altKeys, totalAltSteps, day);
      
      historyPingsOT.push( historyCountR + historyCountA );
      labelsOT.push(day.format('MMM.D'));
    }
    
    return { counts: historyPingsOT, labels: labelsOT };
                    
  },
  
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  // nonCon Rate
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  nonConRateLoop(batches) {

    const allNC = Array.from( batches, x => BatchDB.findOne({batch: x}).nonCon );
    
    function oneRate(theseNC) {
      
      function recordedNC(noncons, qDay) {
        let relevant = noncons.filter(
                        x => moment(x.time)
                          .isSame(qDay, 'day') );
        let ncPack = {
          'value': relevant.length,
          'meta': moment(qDay).format('MMM.D')
        };
        return ncPack;
      }
      
      const begin = moment(theseNC[0].time);
      const end = moment(theseNC[theseNC.length - 1].time);
      const range = end.diff(begin, 'day') + 2;
      
      let nonconSet = [];
      let labelSet = [];
      for(let i = 0; i < range; i++) {
        let qDay = begin.clone().add(i, 'day').format();
        
        let ncCount = recordedNC(theseNC, qDay);
        nonconSet.push(ncCount.value);
        labelSet.push(ncCount.meta);
      }
      return { counts: nonconSet, labels: labelSet };
    }
    
    nonconCollection = [];
    for(let nc of allNC) {
      if(nc.length > 0) {
        let rateLoop = oneRate(nc);
        nonconCollection.push(rateLoop);
      }else{null}
    }
    
    const allCounts = Array.from( nonconCollection, x => x.counts );
    
    let buildLabels = [];
    let combine = Array.from( nonconCollection, x => x.labels );
    combine.forEach( x => x.forEach( y => buildLabels.push(y) ) );
    
    let allLabels = [... new Set( buildLabels ) ];
    
    return { counts: allCounts, labels: allLabels };
  },
  
  
   ///////////////////////////////////////////////////////////////////////////////////
  
  // Scap Items
  
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
    const send = [];
    for(let w of widgets) {
      let findG = GroupDB.findOne({ _id: w.groupId });
      let findV = w.versions.filter( x => x.assembly.find( y => y.component === num));
      let versions = [];
      for(let v of findV) {
        let batches = [];
        if(batchInfo) {
          const findB = BatchDB.find({active: true, versionKey: v.versionKey}).fetch();
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
      send.push({ 
        wdgt: w.widget,
        dsc: w.describe,
        grp: findG.alias,
        vrsns: versions
      });
    }
    return send;
  }
  
  
});