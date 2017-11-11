import moment from 'moment';
import timezone from 'moment-timezone';

Meteor.methods({
  
  serialLookup(orb) {
    const itemsBatch = BatchDB.findOne({'items.serial': orb});
    const found = itemsBatch ? itemsBatch.batch : false;
    return found;
  },
  
  
  activitySnapshot(range, clientTZ, mod) {
    
    let now = mod === 'last' ? 
              moment().tz(clientTZ).subtract(1, range) :
              moment().tz(clientTZ);
    const plainStart = now.clone().startOf(range);
    const sRange = plainStart.format();
    const plainEnd = now.clone().endOf(range);
    const eRange = plainEnd.format();
    
    const b = BatchDB.find({orgKey: Meteor.user().orgKey}).fetch();
    
  //////// WIPProgress \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  
    const inRange = (fin)=> { return ( moment(fin).isBetween(sRange, eRange) ) };
    const upTo = (fin)=> { return ( moment(fin).isBefore(eRange) ) };
    const wipBatches = b.filter( x => ( x.finishedAt === false || 
                                          inRange(x.finishedAt) === true ) &&
                                            upTo(x.createdAt) === true);
    
    // flow counts loop function
    function flowLoop(river, items) {
      if(!river) {
        return [];
      }else{
        const byKey = (t, ky)=> { return ( x => x.key === ky && x.good === true )};
        const byName = (t, nm)=> { return ( x => x.step === nm && x.type === 'first' && x.good === true )};
        let stepCounts = [];
        for(let step of river.flow) {
          if(step.type === 'first') {
            null;
          }else{
            let count = 0;
            let units = 1;
            for(let i of items) {
              units = i.units;
              const h = i.history;
              if(i.finishedAt !== false) {
                count += 1;
              }else{
                if(step.type === 'inspect') {
                  h.find( byKey(this, step.key) ) ? count += 1 : null;
                  h.find( byName(this, step.step) ) ? count += 1 : null;
                }else{
                  h.find( byKey(this, step.key) ) ? count = count + 1 : null;
                }
              }
            }
            stepCounts.push({
              step: step.step,
              type: step.type,
              count: count,
              units: units,
            });
          }
        }
        return stepCounts;
      }
    }
    
    let wipLiveData = [];
    
    for(let batch of wipBatches) {
      const b = BatchDB.findOne({_id: batch._id});
      const w = WidgetDB.findOne({_id: batch.widgetId});
      const v = w.versions.find( x => x.versionKey === b.versionKey );
      const g = GroupDB.findOne({_id: w.groupId});
      const done = b.finishedAt !== false;
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt);
      
      // pull out scrap function
      const outScrap = (itms)=> { return ( itms.filter( x => x.history
                                                              .filter( y => y.type === 'scrap' )
                                                                .length === 0 ) )};
      
      // split flows, filter scraps
      let regItems = b.items;
      let altItems = [];
      
      if(!riverAlt) {
        regItems = outScrap(regItems);
      }else{
        regItems = outScrap( b.items.filter( x => x.alt === false || x.alt === 'no' ) );
        altItems = outScrap( b.items.filter( x => x.alt === 'yes' ) );
      }
      
      const scrapCount = b.items.length - regItems.length - altItems.length;
      
      let regStepCounts = flowLoop(river, regItems);
      let altStepCounts = flowLoop(riverAlt, altItems);
      
      let rmaCount = 0;
      for(let i of b.items) {
        rmaCount += i.rma.length;
      }
      
      let totalUnits = 0;
      for(let i of regItems) {
        totalUnits += i.units;
      }
      for(let i of altItems) {
        totalUnits += i.units;
      }
      
      let active = b.items.find( 
                    x => x.history.find( 
                      y => moment(y.time)
                            .isBetween(sRange, eRange) ) ) 
                              ? true : false; 
      
      wipLiveData.push({
        batch: b.batch,
        widget: w.widget,
        version: v.version,
        group: g.alias,
        finished: done,
        finishedAt: b.finishedAt,
        totalU: totalUnits,
        totalR: regItems.length,
        totalA: altItems.length,
        stepsReg: regStepCounts,
        stepsAlt: altStepCounts,
        rma: rmaCount,
        scrap: scrapCount,
        active: active
      });
    }
    
  //////// bigNow \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    const aNCOps = AppDB.findOne({orgKey: Meteor.user().orgKey}).nonConOption;
    
    let outstanding = b.filter( x => x.finishedAt === false && 
                                      moment(x.createdAt)
                                        .isBefore(eRange) );
    
    function active(batches, startRange, endRange) {
      let records = batches.filter(
                      x => x.items.find(
                        y => y.history.find( 
                          z => moment(z.time)
                                .isBetween(startRange, endRange) ) ) );
      return records;
    }
    const mainActive = active(b, sRange, eRange);
    
    const todayNC = b.filter(
                      x => x.nonCon.find(
                        y => moment(y.time)
                          .isBetween(sRange, eRange) ) );
    
    function doneBatches(batches, startRange, endRange) {
      const records = batches.filter(
                        x => x.finishedAt !== false && 
                          moment(x.finishedAt)
                            .isBetween(startRange, endRange) );
      return records.length;
    }
    const mainDoneBatches = doneBatches(b, sRange, eRange);                        
           
    function doneItems(batches, startRange, endRange) {
      let items = 0;
      for(let t of batches) {
        let fin = t.items.filter(
                    x => x.history.find(
                      y => y.type === 'finish' && 
                        moment(y.time)
                          .isBetween(startRange, endRange) ) );
        items += fin.length;
      }
      return items;
    }
    const mainDoneItems = doneItems(mainActive, sRange, eRange);
    
    let newNC = 0;
    for(let t of todayNC) {
      let nw = t.nonCon.filter(
                  x => moment(x.time)
                    .isBetween(sRange, eRange) );
      newNC += nw.length;
    }
    
    let ncTypeCounts = [];
    for(let n of aNCOps) {
      let typNum = 0;
      for(let t of todayNC) {
        let nw = t.nonCon.filter(
                  x => x.type === n &&
                    moment(x.time)
                      .isBetween(sRange, eRange) );
        typNum += nw.length;
      }
      ncTypeCounts.push(typNum);
    }
    
    //// Rates ///////
    let rate = mod === 'last' ?
               plainEnd.diff(plainStart, 'days') + 1 :
               now.diff(plainStart, 'days') + 1;
    //console.log(rate);
               
    let rateDay = mod === 'last' ?
                  plainEnd.clone() :
                  now.clone();
    //console.log(rateDay.format());
    let rateStart = rateDay.clone().startOf('day');
    //console.log(rateStart.format());
    let rateEnd = rateDay.clone().endOf('day');
    //console.log(rateEnd.format());
    
    let doneItemsOverTime = [];
    for(let i = 0; i < rate; i++) {
      let start = rateStart.clone().subtract(i, 'day').format();
      let end = rateEnd.clone().subtract(i, 'day').format();
      let count = doneItems(mainActive, start, end);
      doneItemsOverTime.unshift(count);
    }
    
    const bigDataPack = {
      live: mod === 'last' ? false : true,
      start: sRange,
      end: eRange,
      outstanding: outstanding.length,
      today: mainActive.length,
      todayNC: todayNC.length,
      newNC: newNC,
      ncTypeCounts: ncTypeCounts,
      doneItems: mainDoneItems,
      doneItemsOverTime: doneItemsOverTime,
      doneBatches: mainDoneBatches
    };
    
    //////// Return Object \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    return { now: bigDataPack, wip: wipLiveData };
  }
  
  
});