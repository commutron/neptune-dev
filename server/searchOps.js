Meteor.methods({
  
  serialLookup(orb) {
    const itemsBatch = BatchDB.findOne({'items.serial': orb});
    const found = itemsBatch ? itemsBatch.batch : false;
    return found;
  },
  
  
  WIPProgress(batches) {
    liveData = [];
    
    for(let batch of batches) {
      const b = BatchDB.findOne({_id: batch._id});
      const w = WidgetDB.findOne({_id: batch.widgetId});
      const g = GroupDB.findOne({_id: w.groupId});
      const done = b.finishedAt !== false;
      const river = w.flows.find( x => x.flowKey === b.river);
      //const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt);
      
      let normItems = b.items;
  
      normItems = normItems.filter( x => x.history.filter( y => y.type === 'scrap' ).length === 0 );
      
      const scrapCount = b.items.length - normItems.length;
      
      //let altItems = [];
      /*
      if(!riverAlt) {
        null;
      }else{
        normItems = b.items.filter( x => x.alt === false || x.alt === 'no' );
        altItems = b.items.filter( x => x.alt === 'yes' );
      }
      */
      
      const byKey = (t, ky)=> { return ( x => x.key === ky && x.good === true )};
      const byName = (t, nm, ty)=> { return ( x => x.step === nm && ty === 'first' && x.good === true )};
      
      let stepCounts = [];
      let rmaCount = 0;
      
      if(!river) {
        null;
      }else{
        for(let step of river.flow) {
          if(step.type === 'first') {
            null;
          }else{
            let count = 0;
            for(let i of normItems) {
              const h = i.history;
              if(i.finishedAt !== false) {
                count += 1;
              }else{
                if(step.type === 'inspect') {
                  h.find( byKey(this, step.key) ) ? count += 1 : null;
                  h.find( byName(this, step.step, step.type) ) ? count += 1 : null;
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
        for(let i of normItems) {
          rmaCount = rmaCount + i.rma.length;
        }
      }
      
      /*
      if(!riverAlt) {
        null;
      }else{
        // loop riverAlt
      }
      */
      
      liveData.push({
        batch: b.batch,
        widget: w.widget,
        group: g.alias,
        finished: done,
        total: normItems.length,
        steps: stepCounts,
        rma: rmaCount,
        scrap: scrapCount
      });
    }
    return liveData;
  }
  
  
});