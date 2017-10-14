Meteor.methods({
  
  serialLookup(orb) {
    const itemsBatch = BatchDB.findOne({'items.serial': orb});
    const found = itemsBatch ? itemsBatch.batch : false;
    return found;
  },
  
  
  WIPProgress(batches) {
    
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
            for(let i of items) {
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
              count: count
            });
          }
        }
        return stepCounts;
      }
    }
    
    let liveData = [];
    
    for(let batch of batches) {
      const b = BatchDB.findOne({_id: batch._id});
      const w = WidgetDB.findOne({_id: batch.widgetId});
      const g = GroupDB.findOne({_id: w.groupId});
      const done = b.finishedAt !== false;
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt);
      
      // pull out scrap function
      const outScrap = (itms)=> { return ( itms.filter( x => x.history.filter( y => y.type === 'scrap' ).length === 0 ) )};
      
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
        rmaCount = rmaCount + i.rma.length;
      }
      liveData.push({
        batch: b.batch,
        widget: w.widget,
        group: g.alias,
        finished: done,
        finishedAt: b.finishedAt,
        totalR: regItems.length,
        totalA: altItems.length,
        stepsReg: regStepCounts,
        stepsAlt: altStepCounts,
        rma: rmaCount,
        scrap: scrapCount
      });
    }
    
    return liveData;
  }
  
  
});