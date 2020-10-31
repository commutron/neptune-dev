import moment from 'moment';
import timezone from 'moment-timezone';


export function whatIsBatch(keyword, labelString) {
  const batch = BatchDB.findOne({batch: keyword});
  if(!batch) {
    return false;
  }else{
    const widget = WidgetDB.findOne({_id: batch.widgetId});
    const group = GroupDB.findOne({_id: widget.groupId});
    const variant = VariantDB.findOne({versionKey: batch.versionKey});
    const more = widget.describe;
    
    if(labelString) {
      const label = '/print/generallabel/' + keyword +
                    '?group=' + group.alias +
                    '&widget=' + widget.widget +
                    '&ver=' + variant.variant +
                    '&desc=' + more +
                    '&sales=' + batch.salesOrder +
                    '&quant=' + batch.items.length; 
      return label;     
    }else{
      const vNice = `v.${variant.variant}`;
      const nice = [ group.alias.toUpperCase(), widget.widget.toUpperCase(), vNice ];
      return [ nice, more ];
    }
  }
}

export function whatIsBatchX(keyword, labelString) {
  const batch = XBatchDB.findOne({batch: keyword});
  const group = GroupDB.findOne({_id: batch.groupId});
  const widget = WidgetDB.findOne({_id: batch.widgetId});
  const variant = VariantDB.findOne({versionKey: batch.versionKey});
  const more = widget.describe;
  
  if(labelString) {
    const label = '/print/generallabel/' + keyword +
                  '?group=' + group.alias +
                  '&widget=' + widget.widget +
                  '&ver=' + variant.variant +
                  '&desc=' + more +
                  '&sales=' + batch.salesOrder +
                  '&quant=' + batch.quantity; 
    return label;     
  }else{
    const vNice = `v.${variant.variant}`;
    const nice = [ group.alias.toUpperCase(), widget.widget.toUpperCase(), vNice ];
    return [ nice, more ];
  }
}


    
Meteor.methods({
  
  getBasicBatchInfo(keyword) {
    const niceString = whatIsBatch(keyword) || whatIsBatchX(keyword);
    const niceObj = {
      batch: keyword, 
      isWhat: niceString[0],
      more: niceString[1],
    };
    return niceObj;
  },
  
  getBatchPrintLink(keyword) {
    const labelString = whatIsBatch(keyword, true) || whatIsBatchX(keyword, true);
    return labelString;
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
  
  quickVariant(vKey) {
    const variant = VariantDB.findOne({versionKey: vKey});
    const found = variant.variant;
    return found;
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
                      x => x.history.find( y => 
                        y.type === 'scrap' && 
                        y.good === true ) );
      for(let i of items) {
        const scEntry = i.history.find( y => 
                          y.type === 'scrap' && 
                          y.good === true );
        compactData.push({
          batch: b.batch,
          widget: w.widget,
          group: g.alias,
          serial: i.serial,
          scEntry: scEntry
        });
      }
    }
    return compactData;
  },
  
   ///////////////////////////////////////////////////////////////////////////////////
  
  // Test Fail Items
  
  ///////////////////////////////////////////////////////////////////////////////////
 
  testFailItems() {
    const batchWithTest = BatchDB.find({
                            orgKey: Meteor.user().orgKey,
                            // live: true,
                            'items.history.type': 'test',
                            'items.history.good': false
                          }).fetch();
    let compactData = [];
    for(let b of batchWithTest) {
      const w = WidgetDB.findOne({_id: b.widgetId});
      const g = GroupDB.findOne({_id: w.groupId});
      const items = b.items.filter( x => {
        let fail = x.history.find( y => y.type === 'test' && y.good === false );
        if(fail) {
          let passAfter = x.history.find( y => y.key === fail.key && y.good === true );
          let finished = x.finishedAt !== false;
          if(!passAfter && !finished) {
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      });
      for(let i of items) {
        const tfEntries = i.history.filter( y => 
                            y.type === 'test' && y.good === false );
        compactData.push({
          batch: b.batch,
          widget: w.widget,
          group: g.alias,
          serial: i.serial,
          tfEntries: tfEntries
        });
      }
    }
    return compactData;
  },
  
  
   ///////////////////////////////////////////////////////////////////////////////////
  
  // Component Search
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  componentFind(num, batchInfo, unitInfo) {
    const variants = VariantDB.find({'assembly.component': num}).fetch();
    const data = [];
    for(let v of variants) {
      let findG = GroupDB.findOne({ _id: v.groupId });
      let findW = WidgetDB.findOne({ _id: v.widgetId });

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

      data.push({
        grp: findG.alias,
        wdgt: findW.widget,
        vrnt: v.variant,
        dsc: findW.describe,
        btchs: batches,
        places: 1
        //v.assembly.filter( x => x.component === num ).length,
      });
    }
    return data;
  },
  
     ///////////////////////////////////////////////////////////////////////////////////
  
  // Component Export
  
  ///////////////////////////////////////////////////////////////////////////////////
  
  componentExportAll() {
    const variants = VariantDB.find({orgKey: Meteor.user().orgKey}).fetch();
    
    const data = [];
    for(let v of variants) {
      for(let a of v.assembly) {
        data.push(a.component);
      }
    }
    const cleanData = [... new Set(data) ].sort();
    return cleanData;
  }

  
});