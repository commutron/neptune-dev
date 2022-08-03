import moment from 'moment';
import timezone from 'moment-timezone';
import Config from '/server/hardConfig.js';

export function whatIsBatchX(keyword) {
  const batch = XBatchDB.findOne({batch: keyword},{fields:
                {'groupId':1,'widgetId':1,'versionKey':1,'salesOrder':1,'quantity':1}});
  const group = GroupDB.findOne({_id: batch.groupId},{fields:{'alias':1,'hibernate':1}});
  const groupH = group.hibernate ? "."+group.alias : group.alias;
  const widget = WidgetDB.findOne({_id: batch.widgetId},{fields:{'widget':1,'describe':1}});
  const variant = VariantDB.findOne({versionKey: batch.versionKey},{fields:{'variant':1,'radioactive':1}});
  const more = widget.describe;
  
  const vNice = `v.${variant.variant}`;
  const nice = [ groupH.toUpperCase(), widget.widget.toUpperCase(), vNice ];
  const rad = variant.radioactive ? variant.radioactive : false;
  return [ nice, more, rad ];
}

    
Meteor.methods({
  
  getBasicBatchInfo(keyword) {
    const niceString = whatIsBatchX(keyword);
    const niceObj = {
      batch: keyword, 
      isWhat: niceString[0],
      more: niceString[1],
      rad: niceString[2]
    };
    return niceObj;
  },
  
  batchLookup(orb) { // significantly faster than findOne
   const onexBatch = XBatchDB.find({ batch: orb },{fields:{'batch':1},limit:1}).count();
    if(onexBatch) {
      return 'trueX';
    }else{
      return false;
    }
  },
  
  newBatchLookup(daysBack) {
    const ystrday = ( d => new Date(d.setDate(d.getDate()-Number(daysBack))) )(new Date);

    let newList = [];
    
    XBatchDB.find({
      createdAt: { $gte: ystrday }
    },
    {fields:{ 'batch':1,'salesOrder':1,'live':1 }}
    ).forEach( x => {
      const is = whatIsBatchX(x.batch);
      newList.push([
        x.batch,
        x.salesOrder || 'n/a',
        is[0][0],
        is[0][1],
        is[0][2],
        x.live,
        is[2]
      ]);
    });
    
    return newList;
  },
  
  batchExtraLookup(orb) {
    this.unblock();
    let newList = [];
    
    const enterLine = (x)=> {
      const is = whatIsBatchX(x.batch);
      newList.push([
        x.batch,
        x.salesOrder || 'n/a',
        is[0][0],
        is[0][1],
        is[0][2],
        x.live,
      ]);
    };
    
    XBatchDB.find({
      $or: [ 
        { batch: { $regex: new RegExp( orb ) } },
        { salesOrder: { $regex: new RegExp( orb ) } },
        { tags: { $in: [ orb ] } },
        { 'blocks.block': { $regex: new RegExp( orb ), $options: 'i' } },
        { 'blocks.solve.action': { $regex: new RegExp( orb ), $options: 'i' } }
      ]
    },{fields:{'batch':1,'salesOrder':1,'live':1}}
    ).forEach( x => enterLine(x) );
    
    XSeriesDB.find({
      "shortfall.partNum": { $regex: new RegExp( orb ), $options: 'i' }
    },{fields:{'batch':1}}
    ).forEach( srs => {
      XBatchDB.find({batch: srs.batch},{fields:{'batch':1,'salesOrder':1,'live':1}})
        .forEach( x => enterLine(x) );
    });
    
    GroupDB.find({
      $or: [ 
        { group: { $regex: new RegExp( orb ), $options: 'i' } },
        { alias: { $regex: new RegExp( orb ) } },
        { tags: { $in: [ orb ] } }
      ]
    },{fields:{'_id':1}}
    ).forEach( g => {
      XBatchDB.find({groupId: g._id},{fields:{'batch':1,'salesOrder':1,'live':1}})
        .forEach( x => enterLine(x) );
    });
    
    WidgetDB.find({
      $or: [ 
        { widget: { $regex: new RegExp( orb ), $options: 'i' } },
        { describe: { $regex: new RegExp( orb ), $options: 'i' } },
      ]
    },{fields:{'_id':1}}
    ).forEach( w => {
      XBatchDB.find({widgetId: w._id},{fields:{'batch':1,'salesOrder':1,'live':1}})
        .forEach( x => enterLine(x) );
    });
    
    VariantDB.find({
      radioactive: { $regex: new RegExp( orb ) }
    },{fields:{'versionKey':1}}
    ).forEach( v => {
      XBatchDB.find({versionKey: v.versionKey},{fields:{'batch':1,'salesOrder':1,'live':1}})
        .forEach( x => enterLine(x) );
    });
    
    XRapidsDB.find({
      $or: [ 
        { rapid: { $regex: new RegExp( orb ) } },
        { issueOrder: { $regex: new RegExp( orb ) } }
      ]},
      {fields:{'extendBatch':1}}
    ).forEach( r => {
      XBatchDB.find({batch: r.extendBatch},{fields:{'batch':1,'salesOrder':1,'live':1}})
        .forEach( x => enterLine(x) );
    });

    return newList;
  },
  
  serialLookup(orb) {
    const itemsBatch = XSeriesDB.findOne({'items.serial': orb},{fields:{'batch':1}});
    return itemsBatch ? itemsBatch.batch : false;
  },
  
  serialLookupPartial(orb) {
    this.unblock();
    const itemsSeries = XSeriesDB.find({
      $or: [ 
        { "items.serial": { $regex: new RegExp( orb ) } },
        { "items.subItems": { $in: [ orb ] } }
      ]
    },{fields:{'batch':1,'items.serial':1}}).fetch();
                        
    const single = itemsSeries.length === 1 || itemsSeries.length === 2;

    let results = [];
    for(let iS of itemsSeries) {
      const whatIs = whatIsBatchX(iS.batch);
      const exact = !single ? false : iS.items.findIndex( x => x.serial === orb ) >= 0;
      results.push([ iS.batch, ...whatIs[0], exact ]);
    }
    return results;
  },
  
  proLookupPartial(orb) {
    let results = [];
    
    XSeriesDB.find({
      "items.serial": { $regex: new RegExp( orb ) }
    },{fields:{'batch':1}})
    .forEach( (srs)=> {
      const whatIs = whatIsBatchX(srs.batch);
      results.push([ srs.batch, whatIs[0] ]);
    });
    
    return results;
  },
  
  firstVerifyLookup(orb) {
    this.unblock();
    const itemsSeries = XSeriesDB.find({
      $or: [ 
        { 'items.history.info.builder': orb },
        { 'items.history.info.buildMethod': { $regex: new RegExp( orb ), $options: 'i' } },
        { 'items.history.info.buildConsume': { $regex: new RegExp( orb ), $options: 'i' } },
        { 'items.history.info.verifyMethod': { $regex: new RegExp( orb ), $options: 'i' } }
      ]},
      {fields:{'batch':1}}
    ).fetch();

    const results = [];
    for(let iS of itemsSeries) {
      const whatIs = whatIsBatchX(iS.batch);
      results.push([ iS.batch, ...whatIs[0], false ]);
    }
  
    return results;
  },
  
  quickVariant(vKey) {
    const variant = VariantDB.findOne({versionKey: vKey},{fields:{'variant':1}});
    const found = variant ? null : variant.variant;
    return found;
  },
  
  getNextBatch() {
    const last = XBatchDB.find({},{
                  fields:{'batch':1}, 
                  sort: { batch: -1 },
                  limit: 1
                }).fetch();
    const next = !last || last.length === 0 ? '00000' : 
                  ( parseInt( last[0].batch, 10 ) + 1 ).toString();
    return next;
  },
  
  getLiveBatch() {
    const batches = XBatchDB.find({live: true},{fields:{'batch':1}}).fetch();
    const plain = [];
    for(let b of batches) {
      plain.push(b.batch);
    }
    return plain;
  },
  
  getPastBatch(wID, vKey) {
    const distile = (arrArr)=> Math.floor( 
                      arrArr.sort( (a,b)=> a[0] > b[0] ? -1 : a[0] < b[0] ? 1 : 0 )
                      .slice(0, 3)
                      .reduce((c,d)=> c + d[1], 0) / 3 );
                    
    const batches = XBatchDB.find({widgetId: wID, versionKey: vKey},{fields:{'batch':1}}).fetch();
    
    const perfCache = CacheDB.findOne({orgKey: Meteor.user().orgKey, dataName: 'performShadow'});
    const perfData = perfCache ? perfCache.dataArray : [];
    
    const shipCache = CacheDB.findOne({orgKey: Meteor.user().orgKey, dataName: 'ontimeShadow'});
    const shipData = shipCache ? shipCache.dataArray : [];
    
    let perfs = [];
    let ships = [];
    for(let b of batches) {
      const perf = perfData.find( x => x.z.includes(b.batch) );
      perf && perfs.push([perf.x, perf.y]);
      const ship = shipData.find( x => x.z.includes(b.batch) );
      ship && ships.push([ship.x, ship.y]);
    }
    
    const perfS = distile(perfs);
    const shipS = distile(ships);
    
    return [ perfS, shipS ];
  },
  
  getEquipAssigned() {
    let nextService = [];
    const equip = EquipDB.find({online: true, stewards: { $in: [Meteor.userId()] }}, {
      fields: {
        'equip': 1,
        'alias': 1
    }}).fetch();
    
    for(let eq of equip) {
      const maint = MaintainDB.find({equipId: eq._id, status: false}, {
        fields: {
          'close': 1,
          'name': 1
      }}).fetch();
      nextService.push({
        equip: eq.equip,
        alias: eq.alias,
        serve: maint
      });
    }
    
    return nextService;
  },
      /////////////////////////////////////////////////////////////////////////
    // First Firsts
   ///////////////////////////////////////////////////////////////////////////
  firstFirst(seriesId) {
    const srs = XSeriesDB.findOne({_id: seriesId},{fields:{'items.history':1}});
                   
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
  
  getVariantOrderDates() {

    const allXBatch = XBatchDB.find({},{
      fields:{
        'versionKey':1,'completedAt':1,'live':1
    }}).fetch();
    
    let orderDates = [];
    
    VariantDB.find({orgKey: Meteor.user().orgKey},{
      fields:{
        'versionKey':1, 'variant':1,
        'groupId':1, 'widgetId':1, 
      }}).forEach( v => {
        const btchsX = allXBatch.filter( b => b.versionKey === v.versionKey);
        const datesX = Array.from(btchsX, b => !b.completedAt ? new Date() : b.completedAt);
        orderDates.push({
          variant: v.variant,
          widgetId: v.widgetId,
          groupId: v.groupId,
          dates: datesX
        });
      });
    
    return orderDates;
  },
  
     /////////////////////////////////////////////////////////////////////////
   // Shortfall Items
  ///////////////////////////////////////////////////////////////////////////
  fetchShortfallParts() {
    
    let sMatch = [];
    
    XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      completed: false
    }).forEach( bx => {
      const srs = XSeriesDB.findOne({batch: bx.batch});
      if(srs) {
        const mShort = srs.shortfall.filter( s => !(s.inEffect || s.reSolve) );
          
        if(mShort.length > 0) {
          const whatIs = whatIsBatchX(bx.batch);
          const describe = whatIs[0].join(' ');
          
          const unqShort = _.uniq(mShort, false, n=> n.partNum );
  
          let bsMatch = [];
          for(let mS of unqShort) {
            bsMatch.push([
              [ bx.batch, whatIs[2] ], bx.salesOrder, describe, mS.partNum,
            ]);
          }
    	    bsMatch.map((ent, ix)=>{
    	      const same = srs.shortfall.filter( s => s.partNum === ent[3] );
    	      const locations = [].concat(...Array.from(same, sm => sm.refs));
    	      const total = same.reduce((x,y)=> ( x + (Number(y.multi) || 1) * y.refs.length ), 0);
    	      ent.push(_.uniq(locations).join(", "), total);
    	      
    	      sMatch.push(ent);
    	    });
        }
      }
    });
    return sMatch;
  },
  
  //////////////////////////////////////////////////////////////////////////
   // Radioactive Lite
  ///////////////////////////////////////////////////////////////////////////
  fetchRadioactiveThin() {
    let compactData = [];
    
    VariantDB.find({
      orgKey: Meteor.user().orgKey, 
      radioactive: { $exists: true, $ne: false }
    }).forEach( v => {
      const w = WidgetDB.findOne({_id: v.widgetId},{fields:{'widget':1}});
      const g = GroupDB.findOne({_id: v.groupId},{fields:{'alias':1}});
      const b = XBatchDB.find({versionKey: v.versionKey, live: true},{fields:{'_id':1}}).count();
      
      compactData.push({
        vKey: v.versionKey,
        group: g.alias,
        widget: w.widget,
        variant: v.variant,
        live: v.live,
        rad: v.radioactive,
        liveBatch: b
      });
    });
    
    const thin = JSON.stringify(compactData);
    return thin;
  },
  
  //////////////////////////////////////////////////////////////////////////
   // Rapid Extend Lite
  ///////////////////////////////////////////////////////////////////////////
  fetchRapidsThin() {
    let compactData = [];
    
    XRapidsDB.find({orgKey: Meteor.user().orgKey})
    .forEach( r => {
      const b = XBatchDB.findOne({batch: r.extendBatch},{fields:{'widgetId':1}});
      const w = WidgetDB.findOne({_id: b.widgetId},{fields:{'widget':1}});
      const g = GroupDB.findOne({_id: r.groupId},{fields:{'alias':1}});

      compactData.push({
        rapid: r.rapid, 
        type: r.type,
        extendBatch: r.extendBatch,
        group: g.alias,
        widget: w.widget,
        issueOrder: r.issueOrder,
        live: r.live,
        createdAt: r.createdAt,
        closedAt: r.closedAt
      });
    });
    
    const thin = JSON.stringify(compactData);
    return thin;
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
      const w = WidgetDB.findOne({_id: srs.widgetId},{fields:{'widget':1}});
      const g = GroupDB.findOne({_id: srs.groupId},{fields:{'alias':1}});
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
   // Test Fail
  ////////////////////////////////////////////////////////////////////////////
  testFailItems() {
    let compactData = [];
    
    XSeriesDB.find({
      orgKey: Meteor.user().orgKey,
      'items.history.type': 'test',
      'items.history.good': false
    }).forEach( srs => {
      const w = WidgetDB.findOne({_id: srs.widgetId},{fields:{'widget':1}});
      const g = GroupDB.findOne({_id: srs.groupId},{fields:{'alias':1}});
      
      for(let i of srs.items) {
        const tfEntries = i.history.filter( y => 
                            y.type === 'test' && y.good === false );
        if(tfEntries.length > 0) {
          compactData.push({
            batch: srs.batch,
            widget: w.widget,
            group: g.alias,
            serial: i.serial,
            tfEntries: tfEntries
          });
        }
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
      orgKey: Meteor.user().orgKey,
      'assembly.component': num
    }).forEach( v => {
      let findG = GroupDB.findOne({ _id: v.groupId },{fields:{'alias':1}});
      let findW = WidgetDB.findOne({ _id: v.widgetId },{fields:{'widget':1,'describe':1}});

      let batches = [];
      if(batchInfo) {
        const findB = XBatchDB.find({live: true, versionKey: v.versionKey},{fields:{'batch':1}}).fetch();
        for(let b of findB) {
          const srs = XSeriesDB.findOne({batch: b.batch},{fields:{'items.units':1}});
          const countI = !unitInfo ? null : srs.items.reduce((x,y)=> x + y.units, 0);
          batches.push({
            btch: b.batch,
            cnt: countI
          });
        }
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
    
    XBatchDB.find({
      $or: [ 
        { 'blocks.block': { $regex: new RegExp( num ), $options: 'i' } },
        { 'blocks.solve.action': { $regex: new RegExp( num ), $options: 'i' } }
      ]
    },{fields:{'batch':1}}
    ).forEach( x => { 
      data.push({
        grp: x.batch,
        wdgt: '',
        vrnt: '',
        dsc: 'part number mentioned in notes',
        btchs: [],
        places: 1
      });
    });
        
    XSeriesDB.find({
      "shortfall.partNum": { $regex: new RegExp( num ), $options: 'i' }
    },{fields:{'batch':1}}
    ).forEach( srs => {
      data.push({
        grp: srs.batch,
        wdgt: '',
        vrnt: '',
        dsc: 'item recorded part number short',
        btchs: [],
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