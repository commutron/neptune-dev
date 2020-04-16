// import { Random } from 'meteor/random'
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time-ship';

import Config from '/server/hardConfig.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

    
  function distTime(clientTZ, bSalesStart, bSalesEnd, bComplete, qtB, bTide) {
  
    const localEnd = moment.tz(bSalesEnd, clientTZ);
    const shipDue = localEnd.isShipDay() ?
                      localEnd.clone().nextShippingTime().format() :
                      localEnd.clone().lastShippingTime().format();
    const didEnd = moment(bComplete).tz(clientTZ).format();
      
    const gapSale2Ship = moment(shipDue).workingDiff(bSalesStart, 'minutes');
    const gapSale2End = moment(didEnd).workingDiff(bSalesStart, 'minutes');
    
    const tideBegin = bTide && bTide.length > 0 ? bTide[0] : null;
    const beginTime = tideBegin ? tideBegin.startTime : null;
    
    const tideDone = bTide && bTide.length > 0 ? bTide[bTide.length-1] : null;
    const doneTime = tideDone ? tideDone.stopTime : null;
    
    const gapBegin2Done = beginTime && doneTime ?
                            moment(doneTime).workingDiff(beginTime, 'minutes')
                          : null;
  
    const quoteTotal = !qtB || qtB.length === 0 ? null :
                          Math.round( qtB[0].timeAsMinutes );
                          
    const trialObj = { gapSale2Ship, gapSale2End, gapBegin2Done, quoteTotal };
    
    return trialObj;
  }
  
    


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
  
function minifyComplete(accessKey, clientTZ) {
  const app = AppDB.findOne({orgKey: accessKey});
  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
    
  const batches = BatchDB.find({orgKey: accessKey, live: false}).fetch();
  const slimL = batches.map( x => {
    const testTheTime = distTime(
      clientTZ, x.start, x.end, x.finishedAt, 
      x.quoteTimeBudget, x.tide
    );
    return {
      batchNum: x.batch,
      widgetID: x.widgetId,
      versionKey: x.versionKey,
      salesOrder: x.salesOrder,
      salesEnd: x.end,
      completedAt: x.finishedAt,
      quantity: x.items.length,
      serialize: true,
      testTheTime: testTheTime
    };
  });
  const batchesX = XBatchDB.find({orgKey: accessKey, completed: true}).fetch();
  const slimX = batchesX.map( x => {
    const testTheTime = false;
    return {
      batchNum: x.batch,
      widgetID: x.widgetId,
      versionKey: x.versionKey,
      salesOrder: x.salesOrder,
      salesEnd: x.salesEnd,
      completedAt: x.completedAt,
      quantity: x.quantity,
      serialize: x.serialize,
      testTheTime: testTheTime
    };
  });
  const slim = [...slimL,...slimX];
  return slim;
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
      Meteor.call('completeCacheUpdate', key, clientTZ, true);
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
        Meteor.call('completeCacheUpdate', key, clientTZ, false) });
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
  
  completeCacheUpdate(accessKey, clientTZ, force) {
    this.unblock();
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(60, 'minutes').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'completeBatch'});

      if( force || !currentCache ) {
        const slim = minifyComplete(accessKey, clientTZ);
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