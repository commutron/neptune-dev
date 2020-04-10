// import { Random } from 'meteor/random'
import moment from 'moment';


export function batchCacheUpdate(accessKey, force) {
  if(typeof accessKey === 'string') {
    const timeOut = moment().subtract(12, 'hours').toISOString();
    const currentCache = CacheDB.findOne({
      orgKey: accessKey, 
      lastUpdated: { $gte: new Date(timeOut) },
      dataName:'batchInfo'});
    
    if(force || !currentCache ) {
      const batches = BatchDB.find({orgKey: accessKey}).fetch();
      const batchesX = XBatchDB.find({orgKey: accessKey}).fetch();
      const slim = [...batches,...batchesX].map( x => {
        return Meteor.call('getBasicBatchInfo', x.batch);
      });
      CacheDB.upsert({orgKey: accessKey, dataName: 'batchInfo'}, {
        $set : { 
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'batchInfo',
          dataSet: slim,
          assembled: true,
          minified: true
      }});
    }
  }
}

export function branchConCacheUpdate(accessKey, force) {
  if(typeof accessKey === 'string') {
    const timeOut = moment().subtract(15, 'minutes').toISOString();
    const currentCache = CacheDB.findOne({
      orgKey: accessKey, 
      lastUpdated: { $gte: new Date(timeOut) },
      dataName:'branchCondition'});

    if( force || !currentCache ) {
      const batches = BatchDB.find({orgKey: accessKey, live: true}).fetch();
      const batchesX = XBatchDB.find({orgKey: accessKey, live: true}).fetch();
      const slim = [...batches,...batchesX].map( x => {
        return Meteor.call('branchCondition', x._id, accessKey);
      });
      CacheDB.upsert({orgKey: accessKey, dataName: 'branchCondition'}, {
        $set : { 
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'branchCondition',
          dataSet: slim,
          assembled: true,
          minified: false
      }});
    }
  }
}
  
  
Meteor.methods({

///////////// CACHES //////////////////
  FORCEcacheUpdate(clientTZ) {
    if(Roles.userIsInRole(Meteor.userId(), 'active')) {
      const key = Meteor.user().orgKey;
      batchCacheUpdate(key, true);
      Meteor.call('priorityCacheUpdate', key, clientTZ, true);
      Meteor.call('activityCacheUpdate', key, clientTZ, true);
      branchConCacheUpdate(key, true);
      Meteor.call('completeCacheUpdate', key, true);
    }
  },
  
  REQUESTcacheUpdate(clientTZ, batchUp, priorityUp, activityUp, branchConUp, compUp) {
    if(Roles.userIsInRole(Meteor.userId(), 'active')) {
      const key = Meteor.user().orgKey;
      batchUp && Meteor.defer( ()=>{
        batchCacheUpdate(key, false) });
      priorityUp && Meteor.defer( ()=>{
        Meteor.call('priorityCacheUpdate', key, clientTZ, false) });
      activityUp && Meteor.defer( ()=>{
        Meteor.call('activityCacheUpdate', key, clientTZ, false) });
      branchConUp && Meteor.defer( ()=>{
        branchConCacheUpdate(key, false) });
      compUp && Meteor.defer( ()=>{
        Meteor.call('completeCacheUpdate', key, false) });
    }
  },
  
  priorityCacheUpdate(accessKey, clientTZ, force) {
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(15, 'minutes').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'priorityRank'});
      
      if(force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey, live: true}).fetch();
        const slim = batches.map( x => {
          return Meteor.call('priorityRank', x._id, clientTZ, accessKey);
        });
        const slimSort = slim.sort((pB1, pB2)=> { // insert a master index~
          const pB1ffr = pB1.estEnd2fillBuffer;
          const pB2ffr = pB2.estEnd2fillBuffer;
          if (!pB1ffr) { return 1 }
          if (!pB2ffr) { return -1 }
          if (pB1.lateLate) { return -1 }
          if (pB2.lateLate) { return 1 }
          if (pB1ffr < pB2ffr) { return -1 }
          if (pB1ffr > pB2ffr) { return 1 }
          return 0;
        });
        CacheDB.upsert({orgKey: accessKey, dataName: 'priorityRank'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'priorityRank',
            dataSet: slimSort,
            assembled: true,
            minified: false
        }});
      }
    }
  },
  
  activityCacheUpdate(accessKey, clientTZ, force) {
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(1, 'minutes').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'activityLevel'});
      
      if(force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey, live: true}).fetch();
        const batchesX = XBatchDB.find({orgKey: accessKey, live: true}).fetch();
        const slim = [...batches,...batchesX].map( x => {
          return Meteor.call('tideActivityLevel', x._id, clientTZ, accessKey);
        });
        CacheDB.upsert({orgKey: accessKey, dataName: 'activityLevel'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'activityLevel',
            dataSet: slim,
            assembled: true,
            minified: false
        }});
      }
    }
  },
  
  //CacheDB.remove({orgKey: accessKey, dataName: 'phaseCondition'}
  
  completeCacheUpdate(accessKey, force) {
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(60, 'minutes').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'completeBatch'});

      if( force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey, live: false}).fetch();
        const slimL = batches.map( x => {
          return {
            batchNum: x.batch,
            widgetID: x.widgetId,
            versionKey: x.versionKey,
            salesOrder: x.salesOrder,
            salesEnd: x.end,
            completedAt: x.finishedAt,
            quantity: x.items.length,
            serialize: true
          };
        });
        const batchesX = XBatchDB.find({orgKey: accessKey, completed: true}).fetch();
        const slimX = batchesX.map( x => {
          return {
            batchNum: x.batch,
            widgetID: x.widgetId,
            versionKey: x.versionKey,
            salesOrder: x.salesOrder,
            salesEnd: x.salesEnd,
            completedAt: x.completedAt,
            quantity: x.quantity,
            serialize: x.serialize
          };
        });
        const slim = [...slimL,...slimX];
        CacheDB.upsert({orgKey: accessKey, dataName: 'completeBatch'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'completeBatch',
            dataSet: slim,
            assembled: true,
            minified: false
        }});
      }
    }
  },
  
  
  // a cache for a plain list of all part numbers for autocomplete
  partslistCacheUpdate(internalKey) {
    const accessKey = internalKey || Meteor.user().orgKey;
    
    const widgets = WidgetDB.find({orgKey: accessKey, 'versions.live': true}).fetch();
    
    let allParts = [];
    for(let w of widgets) {
      let findV = w.versions.filter( x => x.live === true );
      for(let v of findV) {
        const locations = Array.from(v.assembly, pt => pt.component);
        const parts = [...new Set(locations) ];
        allParts.push(parts);
      }
    }
    const allPartsFlat = [].concat(...allParts);
    const allPartsClean = [...new Set(allPartsFlat) ];
      
    CacheDB.upsert({orgKey: accessKey, dataName: 'partslist'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'partslist',
        dataSet: allPartsClean,
        assembled: false,
        minified: true
    }});
      
            
  }
  
});