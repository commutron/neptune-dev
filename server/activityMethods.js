import moment from 'moment';
import timezone from 'moment-timezone';

Meteor.methods({
  
  
   activitySnapshot(range, clientTZ) {
    
    let now = moment().tz(clientTZ);
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
      let stepCounts = [];
      if(!river) {
        return [];
      }else{
        const byKey = (t, ky)=> { return ( x => x.key === ky && x.good === true )};
        for(let step of river.flow) {
          if(step.type === 'first') {
            null;
          }else{
            let itemCount = 0;
            let unitCount = 0;
            for(let i of items) {
              const h = i.history;
              if(i.finishedAt !== false) {
                itemCount += 1;
                unitCount += 1 * i.units;
              }else{
                h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
              }
            }
            stepCounts.push({
              step: step.step,
              type: step.type,
              itemCount: itemCount,
              unitCount: unitCount,
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
      const allLiveItems = outScrap(b.items);
      const scrapCount = b.items.length - allLiveItems.length;
      
      // split flows
      let regItems = allLiveItems;
      let altItems = [];
      
      if(!riverAlt) {
        null;
      }else{
        regItems = allLiveItems.filter( x => x.alt === 'no' || x.alt === false );
        altItems = allLiveItems.filter( x => x.alt === 'yes' );
      }
      
      let regStepCounts = flowLoop(river, regItems);
      let altStepCounts = flowLoop(riverAlt, altItems);
      
      let rmaCount = b.items.filter( x => x.rma.length > 0).length;
      
      let totalRegUnits = 0;
      for(let i of regItems) {
        totalRegUnits += i.units;
      }
      let totalAltUnits = 0;
      for(let i of altItems) {
        totalAltUnits += i.units;
      }
      
      let hasNonCon = 0;
      for(let i of b.items) {
        b.nonCon.find( n => n.serial === i.serial ) ? hasNonCon += 1 : null;
      }
      
      let activeH = b.items.find( 
                    i => i.history.find( 
                      h => moment(h.time)
                        .isBetween(sRange, eRange) ) )
                          ? true : false;
      let activeN = b.nonCon.find( 
                      n => moment(n.time)
                        .isBetween(sRange, eRange) )
                          ? true : false; 
      let active = activeH || activeN;
      
      wipLiveData.push({
        batch: b.batch,
        widget: w.widget,
        version: v.version,
        group: g.alias,
        start: b.start,
        floorRelease: b.floorRelease,
        endGoal: b.end,
        finished: done,
        finishedAt: b.finishedAt,
        itemsTotal: b.items.length,
        totalR: regItems.length,
        totalA: altItems.length,
        totalRU: totalRegUnits,
        totalAU: totalAltUnits,
        stepsReg: regStepCounts,
        stepsAlt: altStepCounts,
        nonConTotal: b.nonCon.length,
        hasNonCon: hasNonCon,
        rma: rmaCount,
        scrap: scrapCount,
        active: active
      });
    }
    
  //////// bigNow \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    const aNCOps = AppDB.findOne({orgKey: Meteor.user().orgKey}).nonConOption;
    
    let outstanding = wipLiveData.length;
    
    const mainActive = wipLiveData.filter(x => x.active === true ).length;
    
    const batchesNC = b.filter(
                      x => x.nonCon.find(
                        y => moment(y.time)
                          .isBetween(sRange, eRange) ) );
    
    const doneBatches = b.filter(
                          x => x.finishedAt !== false && 
                            moment(x.finishedAt)
                              .isBetween(sRange, eRange) )
                                .length;

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
    
    const bigDataPack = {
      start: sRange,
      end: eRange,
      outstanding: outstanding,
      today: mainActive,
      ncTypeCounts: ncTypeCounts,
      doneBatches: doneBatches
    };
    
    //////// Return Object \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    return { now: bigDataPack, wip: wipLiveData };
  }
  
});