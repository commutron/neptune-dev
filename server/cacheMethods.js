// import { Random } from 'meteor/random'
import moment from 'moment';
import { noIg, countMulti, countMultiRefs } from './utility';
import { asRate } from './calcOps';
// import Config from '/server/hardConfig.js';

Meteor.methods({

  // a cache for a plain list of all part numbers for autocomplete
  partslistCacheUpdate(internalKey) {
    this.unblock();
    const accessKey = internalKey || Meteor.user().orgKey;
    
    const variants = VariantDB.find({orgKey: accessKey, live: true}).fetch();
    
    let allParts = [];
    for(let v of variants) {
      const locations = Array.from(v.assembly, pt => pt.component);
      const parts = [...new Set(locations) ];
      allParts.push(parts);
    }
    const allPartsFlat = [].concat(...allParts);
    const allPartsClean = [...new Set(allPartsFlat) ];
      
    CacheDB.upsert({orgKey: accessKey, dataName: 'partslist'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'partslist',
        dataSet: allPartsClean,
        minified: true
    }});
  },
  
  lockingCacheUpdate(internalKey, force) {
    this.unblock();
    const accessKey = internalKey || Meteor.user().orgKey;
      
    if(typeof accessKey === 'string') {
      const lstyear = ( d => new Date(d.setDate(d.getDate()-365)) )(new Date);
      const lstweek = ( d => new Date(d.setDate(d.getDate()-7)) )(new Date);

      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(lstweek) },
        dataName:'lockingTask'});
      
      if(force || !currentCache ) {
          
        XBatchDB.find({
          orgKey: accessKey, 
          live: false,
          $or: [ { lock: false },
                 { lock: { $exists: false } }
               ],
          completedAt: { $lt: lstyear }
        }).forEach( (bx)=> {
          Meteor.defer( ()=>{ Meteor.call('enableLockX', bx._id, accessKey) });
        });
      
        CacheDB.upsert({orgKey: accessKey, dataName: 'lockingTask'}, {
          $set : {
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'lockingTask',
        }});
      }
    }
  },
  
  getAllPerform() {
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const perfShade = CacheDB.findOne({orgKey: accessKey, dataName: 'performShadow'});
    const preftime = perfShade ? perfShade.lastUpdated : null;
    const stale = !preftime ? true :
              moment.duration(moment().diff(moment(preftime))).as('hours') > 12;
    if(stale) {
      const app = AppDB.findOne({ orgKey: accessKey });
      const tideWall = app && app.tideWall;

      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        createdAt: { 
          $gte: new Date(tideWall)
        }
      },
        {fields:{'batch':1,'completedAt':1}}
      ).fetch();
      
      let perfset = [];
      for( let batch of batches) {
        const p = Meteor.call('performTrace', batch._id);
        perfset.push({
          y: p,
          x: batch.completedAt || new Date(),
          z: `${batch.batch} = ${p > 0 ? '+'+p : p}`,
          symbol: batch.completedAt ? 'diamond' : 'star',
          size: '3'
        });
      }
      
      CacheDB.upsert({dataName: 'performShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'performShadow',
          dataArray: perfset
      }});
    
      return perfset;
    }else{
      return perfShade.dataArray;
    }
  },
  
  getAllNCCount() {
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const probShade = CacheDB.findOne({orgKey: accessKey, dataName: 'nccountShadow'});
    const nctime = probShade ? probShade.lastUpdated : null;
    const stale = !nctime ? true :
              moment.duration(moment().diff(moment(nctime))).as('hours') > 12;
    if(stale) {
      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
      },
        {fields:{'batch':1,'completedAt':1}}
      ).fetch();
      
      let probset = [];
      for( let batch of batches) {
        const srs = XSeriesDB.findOne({batch: batch.batch});
        const ncQty = countMulti( srs ? srs.nonCon : [] );
        const ncRte = srs ? asRate(ncQty, srs.items.length) : 0;
        const shQty = countMultiRefs( srs ? srs.shortfall : [] );
        const shRte = srs ? asRate(shQty, srs.items.length) : 0;
        probset.push({
          r: ncRte,
          s: `${batch.batch} = ${ncRte}`,
          y: ncQty,
          x: batch.completedAt || new Date(),
          z: `${batch.batch} = ${ncQty} noncons`,
          symbol: 'square',
          size: '3'
        });
        probset.push({
          r: shRte,
          s: `${batch.batch} = ${shRte}`,
          y: shQty,
          x: batch.completedAt || new Date(),
          z: `${batch.batch} = ${shQty} shortfalls`,
          symbol: 'triangleUp',
          size: '3'
        });
      }
      
      CacheDB.upsert({dataName: 'nccountShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'nccountShadow',
          dataArray: probset
      }});
    
      return probset;
    }else{
      return probShade.dataArray;
    }
  },
  
  getAllQuantity() {
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const qtyShade = CacheDB.findOne({orgKey: accessKey, dataName: 'qtyShadow'});
    const qtytime = qtyShade ? qtyShade.lastUpdated : null;
    const stale = !qtytime ? true :
              moment.duration(moment().diff(moment(qtytime))).as('hours') > 12;
    if(stale) {
      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid }
      },
        {fields:{'batch':1,'createdAt':1,'quantity':1,'salesOrder':1}}
      ).fetch();
      
      let qtyset = [];
      for( let batch of batches) {
        qtyset.push({
          y: batch.quantity,
          x: batch.createdAt,
          z: `${batch.batch} (so.${batch.salesOrder}) = ${batch.quantity}`,
          symbol: 'plus',
          size: '3'
        });
      }
      
      CacheDB.upsert({dataName: 'qtyShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'qtyShadow',
          dataArray: qtyset
      }});
    
      return qtyset;
    }else{
      return qtyShade.dataArray;
    }
  }
  
});