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
      
      let stepCounts = [];
      let scrapCount = 0;
      let rmaCount = 0;
      if(!river) {
        null;
      }else{
        for(let step of river.flow) {
          if(step.type === 'first') {
            null;
          }else{
            let count = 0;
            for(let i of b.items) {
              const h = i.history;
              if(step.type === 'inspect') {
                const didDo = h.filter( x => x.key === step.key && x.good === true ).length;
                if(didDo > 0) {
                  count = count + 1;
                }else{
                  const didOther = h.filter( x => x.step === step.step && x.type === 'first' && x.good === true ).length;
                  didOther > 0 ? count = count + 1 : null;
                }
              }else{
                const didDo = h.filter( x => x.key === step.key && x.good === true ).length;
                didDo > 0 ? count = count + 1 : null;
              }
            }
            stepCounts.push({
              step: step.step,
              type: step.type,
              count: count
            });
          }
        }
        for(let i of b.items) {
          const didScrap = i.history.filter( x => x.type === 'scrap' ).length;
          didScrap > 0 ? scrapCount = scrapCount + 1 : null;
          rmaCount = rmaCount + i.rma.length;
        }
      }
      
      liveData.push({
        batch: b.batch,
        widget: w.widget,
        group: g.alias,
        finished: done,
        total: b.items.length,
        steps: stepCounts,
        rma: rmaCount,
        scrap: scrapCount
      });
    }
    return liveData;
  }
  
  
});