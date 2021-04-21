import moment from 'moment';
// import timezone from 'moment-timezone';

import Config from '/server/hardConfig.js';

export function whatIsBatchX(keyword, labelString) {
  const batch = XBatchDB.findOne({batch: keyword});
  const group = GroupDB.findOne({_id: batch.groupId});
  const groupH = group.hibernate ? "."+group.alias : group.alias;
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
    const nice = [ groupH.toUpperCase(), widget.widget.toUpperCase(), vNice ];
    return [ nice, more ];
  }
}

    
Meteor.methods({
  
  getBasicBatchInfo(keyword) {
    const niceString = whatIsBatchX(keyword);
    const niceObj = {
      batch: keyword, 
      isWhat: niceString[0],
      more: niceString[1],
    };
    return niceObj;
  },
  
  getBatchPrintLink(keyword) {
    const labelString = whatIsBatchX(keyword, true);
    return labelString;
  },
  
  batchLookup(orb) { // significantly faster than findOne
   const onexBatch = XBatchDB.find({ batch: orb },{fields:{'batch':1},limit:1}).count();
    if(onexBatch) {
      return 'trueX';
    }else{
      return false;
    }
  },
  
  serialLookup(orb) {
    const itemsBatch = XSeriesDB.findOne({'items.serial': orb},{fields:{'batch':1}});
    return itemsBatch ? itemsBatch.batch : false;
  },
  
  serialLookupPartial(orb) {
    const itemsSeries = XSeriesDB.find({
                          "items.serial": { $regex: new RegExp( orb ) }
                        },{fields:{'batch':1,'items.serial':1}}).fetch();
                        
    const single = itemsSeries.length === 1;
    
    const exact = !single ? false : 
      itemsSeries[0].items.find( x => x.serial === orb ) ? true : false;

    const results = [];
    for(let iS of itemsSeries) {
      const describe = whatIsBatchX(iS.batch)[0].join(' ');
      results.push([ iS.batch, describe ]);
    }
  
    return [ results, exact ];
  },
  
  quickVariant(vKey) {
    const variant = VariantDB.findOne({versionKey: vKey});
    const found = variant.variant;
    return found;
  },
  
      /////////////////////////////////////////////////////////////////////////
    // First Firsts
   ///////////////////////////////////////////////////////////////////////////
  firstFirst(seriesId) {
    const srs = XSeriesDB.findOne({_id: seriesId});
                   
    let first = moment();
    if(!srs) { null }else{
      for(let i of srs.items) {
        let firstHistory = i.history[0];
        if(!firstHistory || moment(firstHistory.time).isSameOrAfter(first)) {
          null;
        }else{
          first = moment(firstHistory.time);
        }
      }
    }
    return first.tz(Config.clientTZ).format();
  },
  
     /////////////////////////////////////////////////////////////////////////
   // Shortfall Items
  ///////////////////////////////////////////////////////////////////////////
  fetchShortfallParts() {
    
    let sMatch = [];
    
    /* All, Complete or Not
      XSeriesDB.find({
      shortfall: { $elemMatch: { inEffect: { $ne: true }, reSolve: { $ne: true } } }
    }); // s.inEffect !== true && s.reSolve !== true
    */
    // Complete Only
    XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      completed: false
    }).forEach( bx => {
      const srs = XSeriesDB.findOne({batch: bx.batch});
      if(srs) {
        const mShort = srs.shortfall.filter( s => !(s.inEffect || s.reSolve) );
          
        if(mShort.length > 0) {
          const describe = whatIsBatchX(bx.batch)[0].join(' ');
          
          const unqShort = _.uniq(mShort, false, n=> n.partNum );
  
          let bsMatch = [];
          for(let mS of unqShort) {
            bsMatch.push([
              bx.batch, bx.salesOrder, describe, mS.partNum
            ]);
          }
    	    bsMatch.map((ent, ix)=>{
    	      const same = srs.shortfall.filter( s => s.partNum === ent[3] );
    	      const locations = [].concat(...Array.from(same, sm => sm.refs));
    	      ent.push(_.uniq(locations).join(", "), locations.length);
    	      sMatch.push(ent);
    	    });
        }
      }
    });
    return sMatch;
  },
  
  
    //////////////////////////////////////////////////////////////////////////
   // Scrap Items
  ///////////////////////////////////////////////////////////////////////////
  scrapItems() {
    let compactData = [];
    
    XSeriesDB.find({
      orgKey: Meteor.user().orgKey,
      'items.scrapped': true
    }).forEach( srs => {
      const w = WidgetDB.findOne({_id: srs.widgetId});
      const g = GroupDB.findOne({_id: srs.groupId});
      const items = srs.items.filter( x => x.scrapped === true );
      for(let i of items) {
        const scEntry = i.history.find( y => 
                          y.type === 'scrap' && 
                          y.good === true );
        compactData.push({
          batch: srs.batch,
          widget: w.widget,
          group: g.alias,
          serial: i.serial,
          scEntry: scEntry
        });
      }
    });
    return compactData;
  },
  
    ////////////////////////////////////////////////////////////////////////
   // Test Fail Items
  ////////////////////////////////////////////////////////////////////////////
  testFailItems() {
    let compactData = [];
    
    XSeriesDB.find({
      orgKey: Meteor.user().orgKey,
      'items.history.type': 'test',
      'items.history.good': false
    }).forEach( srs => {
      const w = WidgetDB.findOne({_id: srs.widgetId});
      const g = GroupDB.findOne({_id: srs.groupId});
      
      const items = srs.items.filter( x => {
        let fail = x.history.find( y => y.type === 'test' && y.good === false );
        if(fail) {
          let passAfter = x.history.find( y => y.key === fail.key && y.good === true );
          if(!passAfter && !x.completed) {
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
          batch: srs.batch,
          widget: w.widget,
          group: g.alias,
          serial: i.serial,
          tfEntries: tfEntries
        });
      }
    });
    return compactData;
  },
  
  
   ///////////////////////////////////////////////////////////////////////////
  // Component Search
  ////////////////////////////////////////////////////////////////////////////
  componentFind(num, batchInfo, unitInfo) {
    const data = [];
    
    VariantDB.find({
      'assembly.component': num
    }).forEach( v => {
      let findG = GroupDB.findOne({ _id: v.groupId });
      let findW = WidgetDB.findOne({ _id: v.widgetId });

      let batches = [];
      if(batchInfo) {
        const findB = XBatchDB.find({live: true, versionKey: v.versionKey}).fetch();
        batches = Array.from(findB, x => { 
                    let countI = 0;
                    !unitInfo ? null : 
                      x.items.forEach( y => countI += y.units );
                    return {
                      btch: x.batch,
                      cnt: countI
                  }});
      }else{null}

      data.push({
        grp: findG.alias,
        wdgt: findW.widget,
        vrnt: v.variant,
        dsc: findW.describe,
        btchs: batches,
        places: 1
      });
    });
    return data;
  },
  
    /////////////////////////////////////////////////////////////////////////
   // Component Export
  ///////////////////////////////////////////////////////////////////////////
  componentExportAll() {
    const data = [];
    
    VariantDB.find({
      orgKey: Meteor.user().orgKey
    }).forEach( v => {
      for(let a of v.assembly) {
        data.push(a.component);
      }
    });
    const cleanData = [... new Set(data) ].sort();
    return cleanData;
  }

  
});