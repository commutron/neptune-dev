// import { Random } from 'meteor/random'
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { deliveryState } from '/server/reportCompleted.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});


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
          structured: true,
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
          structured: true,
          minified: false
      }});
    }
  }
}
  
function minifyComplete(accessKey) {
  const app = AppDB.findOne({orgKey: accessKey});
  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
    
  const batches = BatchDB.find({orgKey: accessKey, live: false}).fetch();
  const slimL = batches.map( x => {
    const bFinish = x.finishedAt !== false ? x.finishedAt : new Date();
    const dlv = deliveryState(x.end, bFinish, Config.clientTZ);
    //ARRAY: salesEnd, shipAim, didFinish, gapZone
    return {
      batch: x.batch,
      batchID: x._id,
      widgetID: x.widgetId,
      versionKey: x.versionKey,
      salesOrder: x.salesOrder,
      salesEnd: dlv[0],
      shipAim: dlv[1],
      completedAt: dlv[2],
      gapZone: dlv[3],
      quantity: x.items.length,
      serialize: true,
    };
  });
  const batchesX = XBatchDB.find({orgKey: accessKey, completed: true}).fetch();
  const slimX = batchesX.map( x => {
    const dlv = deliveryState(x.salesEnd, x.completedAt, Config.clientTZ);
    
    return {
      batch: x.batch,
      batchID: x._id,
      widgetID: x.widgetId,
      versionKey: x.versionKey,
      salesOrder: x.salesOrder,
      salesEnd: dlv[0],
      shipAim: dlv[1],
      completedAt: dlv[2],
      gapZone: dlv[3],
      quantity: x.quantity,
      serialize: x.serialize,
    };
  });
  const slim = [...slimL,...slimX];
  return slim;
}


Meteor.methods({

///////////// CACHES //////////////////
  FORCEcacheUpdate() {
    this.unblock();
    if(Roles.userIsInRole(Meteor.userId(), 'active')) {
      const key = Meteor.user().orgKey;
      batchCacheUpdate(key, true);
      Meteor.call('priorityCacheUpdate', key, true);
      Meteor.call('activityCacheUpdate', key, true);
      branchConCacheUpdate(key, true);
      Meteor.call('completeCacheUpdate', key, true);
    }
  },
  
  REQUESTcacheUpdate(clientTZ, batchUp, priorityUp, activityUp, branchConUp, compUp) {
    this.unblock();
    if(Roles.userIsInRole(Meteor.userId(), 'active')) {
      const key = Meteor.user().orgKey;
      batchUp && Meteor.defer( ()=>{
        batchCacheUpdate(key, false) });
      priorityUp && Meteor.defer( ()=>{
        Meteor.call('priorityCacheUpdate', key, false) });
      activityUp && Meteor.defer( ()=>{
        Meteor.call('activityCacheUpdate', key, false) });
      branchConUp && Meteor.defer( ()=>{
        branchConCacheUpdate(key, false) });
      compUp && Meteor.defer( ()=>{
        Meteor.call('completeCacheUpdate', key, false) });
    }
  },
  
  priorityCacheUpdate(accessKey, force) {
    this.unblock();
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(30, 'minutes').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'priorityRank'});
      
      if(force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey, live: true}).fetch();
        const batchesX = XBatchDB.find({orgKey: accessKey, live: true}).fetch();
        const slim = [...batches,...batchesX].map( x => {
          return Meteor.call('priorityRank', x._id, accessKey);
        });
        // console.log(slim.length);
        /*
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
        });*/
        // const shaddowPriority = {
        //   lastUpdated: new Date(),
        //   ranking: Array.from(slimSort, (x, ix) =>  {
        //             return { batch: x.batch, pIX: ix } })
        // };
        // console.log(shaddowPriority);
        CacheDB.upsert({orgKey: accessKey, dataName: 'priorityRank'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'priorityRank',
            dataSet: slim,
            structured: true,
            minified: false
        }});
      }
    }
  },
  
  activityCacheUpdate(accessKey, force) {
    this.unblock();
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(5, 'minutes').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'activityLevel'});
      
      if(force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey, live: true}).fetch();
        const batchesX = XBatchDB.find({orgKey: accessKey, live: true}).fetch();
        const slim = [...batches,...batchesX].map( x => {
          return Meteor.call('tideActivityLevel', x._id, accessKey);
        });
        CacheDB.upsert({orgKey: accessKey, dataName: 'activityLevel'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'activityLevel',
            dataSet: slim,
            structured: true,
            minified: false
        }});
      }
    }
  },
  
  //CacheDB.remove({orgKey: accessKey, dataName: 'phaseCondition'}
  
  completeCacheUpdate(accessKey, force) {
    this.unblock();
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(12, 'hours').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey,
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'completeBatch'});

      if( force || !currentCache ) {
        const slim = minifyComplete(accessKey);
        CacheDB.upsert({orgKey: accessKey, dataName: 'completeBatch'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'completeBatch',
            dataSet: slim,
            structured: true,
            minified: false
        }});
      }
    }
  },
  
  
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
        structured: false,
        minified: true
    }});
            
  }
  
});