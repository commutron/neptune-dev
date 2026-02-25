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
    
    const app = AppDB.findOne({orgKey: accessKey},{fields:{'partsGlobal':1}});
    
    if( app && app.partsGlobal ) {
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
    }
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
      const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
      const perfset = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        createdAt: { 
          $gte: new Date(cutoff)
        }
      },
        {fields:{'batch':1,'completedAt':1}}
      ).map( b => plotPerform(b) );
      
      const perfsetS = perfset.sort((a,b)=> a.x > b.x ? 1 : a.x < b.x ? -1 : 0);

      CacheDB.upsert({dataName: 'performShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'performShadow',
          dataArray: perfsetS
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
      const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
      const onset = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        createdAt: { 
          $gte: new Date(cutoff)
        }
      },
        {fields:{'batch':1,'completedAt':1, 'salesEnd':1}}
      ).map( b => plotOnTime(b) );
      
      const onsetS = onset.sort((a,b)=> a.x > b.x ? 1 : a.x < b.x ? -1 : 0);

      CacheDB.upsert({dataName: 'ontimeShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'ontimeShadow',
          dataArray: onsetS
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
      const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
      let batchList = [];
      let doneDates = [];
      
      XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        createdAt: { 
          $gte: new Date(cutoff)
        }
      },
        {fields:{'batch':1,'completedAt':1}}
      ).forEach( b => {
        batchList.push(b.batch);
        doneDates.push([
          b.batch, 
          b.completedAt
        ]);
      });
      
      let ncset = plotNonCons(batchList, doneDates, brOps);
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
      const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
      let batchList = [];
      let doneDates = [];
      
      XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        createdAt: { 
          $gte: new Date(cutoff)
        }
      },
        {fields:{'batch':1,'completedAt':1}}
      ).forEach( b => {
        batchList.push(b.batch);
        doneDates.push([
          b.batch, 
          b.completedAt
        ]);
      });
      
      let shset = plotShorts(batchList, doneDates, brOps);
      
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
      const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
      let batchList = [];
      let doneDates = [];
      
      XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        createdAt: { 
          $gte: new Date(cutoff)
        }
      },
        {fields:{'batch':1,'completedAt':1}}
      ).forEach( b => {
        batchList.push(b.batch);
        doneDates.push([
          b.batch, 
          b.completedAt
        ]);
      });
      
      let failset = plotTest(batchList, doneDates);
      
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
      const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
      const bchset = XBatchDB.find({
        orgKey: accessKey,
        groupId: { $ne: xid },
        createdAt: { 
          $gte: new Date(cutoff)
        }
      },
        {fields:{
          'batch':1,'createdAt':1,'quantity':1,
          'salesOrder':1,'salesStart':1,'completedAt':1
        }}
      ).map( b => plotCreatedOrders(b) );
      
      const bchsetS = bchset.sort((a,b)=> a.x1 > b.x1 ? 1 : a.x1 < b.x1 ? -1 : 0);

      CacheDB.upsert({dataName: 'bchShadow'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'bchShadow',
          dataArray: bchsetS
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
      Meteor.call('countMultiBatchTideToQuote', w._id, accessKey);
      Meteor.call('oneWidgetTurnAround', w._id, accessKey);
    }
    return true;
  }
  
  // countDoneBatchTarget cache is in cronOps
  
});