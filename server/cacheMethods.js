import moment from 'moment';
import Config from '/server/hardConfig.js';
import { syncLocale, noIg } from './utility';
import { 
  plotPerform,
  plotOnTime,
  plotNonCons,
  plotShorts,
  plotTest,
  plotCreatedOrders } from '/server/plotOps';

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
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const perfShade = CacheDB.findOne({orgKey: accessKey, dataName: 'performShadow'});
    const preftime = perfShade ? perfShade.lastUpdated : null;
    const stale = !preftime ? true :
              moment.duration(moment().diff(moment(preftime))).as('hours') > Config.freche;
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
      
      let perfset = plotPerform(batches);
      
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
  
  getAllOnTime() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const onShade = CacheDB.findOne({orgKey: accessKey, dataName: 'ontimeShadow'});
    const ontime = onShade ? onShade.lastUpdated : null;
    const stale = !ontime ? true :
              moment.duration(moment().diff(moment(ontime))).as('hours') > Config.freche;
    if(stale) {
      syncLocale(accessKey);
      
      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid }
      },
        {fields:{'batch':1,'completedAt':1, 'salesEnd':1}}
      ).fetch();
      
      let onset = plotOnTime(batches);

      CacheDB.upsert({dataName: 'ontimeShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'ontimeShadow',
          dataArray: onset
      }});
    
      return onset;
    }else{
      return onShade.dataArray;
    }
  },
  
  getAllNConCount(brOps) {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const ncShade = CacheDB.findOne({orgKey: accessKey, dataName: 'nccountShadow'});
    const nctime = ncShade ? ncShade.lastUpdated : null;
    const stale = !nctime ? true :
              moment.duration(moment().diff(moment(nctime))).as('hours') > Config.freche;
    if(stale) {
      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
      },
        {fields:{'batch':1,'completedAt':1}}
      ).fetch();
      
      let ncset = plotNonCons(batches, brOps);
      
      CacheDB.upsert({dataName: 'nccountShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'nccountShadow',
          dataArray: ncset
      }});
    
      return ncset;
    }else{
      return ncShade.dataArray;
    }
  },
  
  getAllShortCount(brOps) {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const shShade = CacheDB.findOne({orgKey: accessKey, dataName: 'shcountShadow'});
    const shtime = shShade ? shShade.lastUpdated : null;
    const stale = !shtime ? true :
              moment.duration(moment().diff(moment(shtime))).as('hours') > Config.freche;
    if(stale) {
      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
      },
        {fields:{'batch':1,'completedAt':1}}
      ).fetch();
      
      let shset = plotShorts(batches, brOps);
      
      CacheDB.upsert({dataName: 'shcountShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'shcountShadow',
          dataArray: shset
      }});

      return shset;
    }else{
      return shShade.dataArray;
    }
  },
  
  getAllFailCount() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const failShade = CacheDB.findOne({orgKey: accessKey, dataName: 'failShadow'});
    const tftime = failShade ? failShade.lastUpdated : null;
    const stale = !tftime ? true :
              moment.duration(moment().diff(moment(tftime))).as('hours') > Config.freche;
    if(stale) {
      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
      },
        {fields:{'batch':1,'completedAt':1}}
      ).fetch();
      
      let failset = plotTest(batches);
      
      CacheDB.upsert({dataName: 'failShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'failShadow',
          dataArray: failset
      }});
    
      return failset;
    }else{
      return failShade.dataArray;
    }
  },
  
  getAllOrders() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const xid = noIg();

    const bchShade = CacheDB.findOne({orgKey: accessKey, dataName: 'bchShadow'});
    const bchtime = bchShade ? bchShade.lastUpdated : null;
    const stale = !bchtime ? true :
              moment.duration(moment().diff(moment(bchtime))).as('hours') > Config.freche;
    if(stale) {
      syncLocale(accessKey);
      
      const batches = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid }
      },
        {fields:{
          'batch':1,'createdAt':1,'quantity':1,
          'salesOrder':1,'salesStart':1,'completedAt':1
        }}
      ).fetch();
      
      let bchset = plotCreatedOrders(batches);
      
      CacheDB.upsert({dataName: 'bchShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'bchShadow',
          dataArray: bchset
      }});
      
      return bchset;
    }else{
      return bchShade.dataArray;
    }
  },
  
  fetchWeekAvg(accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;

    Meteor.call('fetchWeekAvgTime', privateKey);
    Meteor.call('fetchWeekAvgSerial', privateKey);
    return true;
  },
  
  updateAllWidgetAvg(accessKey) {

    const widgets = WidgetDB.find({},{fields:{'_id':1}}).fetch();

    for(let w of widgets) {
      Meteor.call('nonConBatchTrend', w._id);
      Meteor.call('countMultiBatchTideToQuote', w._id);
      Meteor.call('oneWidgetTurnAround', w._id, accessKey);
    }
    return true;
  }
  
});