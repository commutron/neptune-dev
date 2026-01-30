import moment from 'moment';

import Config from '/server/hardConfig.js';
import { batchTideTime } from './tideGlobalMethods.js';
import { syncLocale, noIg, countWaterfall, countMulti } from './utility';
import { avgOfArray, asRate } from './calcOps';
import { getEndWork } from '/server/shipOps';


function countItemsWith(accessKey, rangeStart, rangeEnd, historyType) {
  
  let itemCount = 0;
  
  XSeriesDB.find({
    orgKey: accessKey, 
    items: { $elemMatch: { createdAt: {
      $lte: new Date(rangeEnd) 
    }}}
  }).forEach( gf => {
    const theseItems = gf.items.filter( x =>
      x.history.find( y =>
        moment(y.time).isBetween(rangeStart, rangeEnd) &&
        y.type === historyType && y.good === true )
    );
    itemCount = itemCount + theseItems.length;
  });
  return itemCount;
}

export const itemsWithPromise = (accessKey, rangeStart, rangeEnd, historyType)=> {
  return new Promise(function(resolve) {
    const fetch = countItemsWith(accessKey, rangeStart, rangeEnd, historyType);
    resolve(fetch);
  });
};

export const totalTideTimePromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve) {
    let totalCount = 0;
    const rSdate = new Date(rangeStart);
    const rEdate = new Date(rangeEnd);
    
    XBatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: rEdate
      },
      tide: { $elemMatch: { startTime: {
        $gte: rSdate,
        $lte: rEdate
      }}}
    }).forEach( gfx => {
      const windowedTide = gfx.tide.filter( x =>
        moment(x.startTime).isBetween(rangeStart, rangeEnd)
      );
      const tcount = batchTideTime(windowedTide);
      totalCount += tcount;
    });
    
    resolve(totalCount);
  });
};

function collectNonCon(batchID) {
  return new Promise(resolve => {
    let collection = false;
    const bx = XBatchDB.findOne({_id: batchID},{fields:{'batch':1}});
    if(bx) {
      const srs = XSeriesDB.findOne({batch: bx.batch});
      
      const items = !srs ? [] : srs.items;
      const itemQty = items.length > 0 ? items.reduce((t,i)=> t + i.units, 0) : 0;
      // nonCon relevant
      // -- nc rate calculation filter --
      const rNC = !srs ? [] : srs.nonCon.filter( n => !n.trash && !(n.inspect && !n.fix) );
      // how many nonCons
      const nonConTotal = countMulti(rNC);
      // how many are unresolved  
      const nonConLeft = countMulti( rNC.filter( x => x.inspect === false ) );
      // nc rate
      const ncRate = asRate(nonConTotal, itemQty, true);
      // how many items have nonCons
      const hasNonCon = new Set( Array.from(rNC, x => x.serial) ).size;
      // what percent of items have nonCons
      const percentOfNCitems = itemQty === 0 ? 0 : hasNonCon >= itemQty ? 100 :
        ((hasNonCon / itemQty) * 100 ).toFixed(0);
      // how many items are scrapped
      const itemIsScrap = items.filter( x => x.scrapped ).length;
      // how many items with RMA
      let itemHasRapid = items.filter( x => x.altPath.find( y => y.rapId !== false) ).length;
 
      collection = {
        batch: bx.batch,
        batchID: bx._id,
        nonConTotal: nonConTotal,
        nonConRate: ncRate,
        nonConLeft: nonConLeft,
        percentOfNCitems: isNaN(percentOfNCitems) ? '0%' : percentOfNCitems + '%',
        itemIsScrap: itemIsScrap,
        itemHasRMA: itemHasRapid
      };
      
      resolve(collection);
    }else{
      resolve(collection);
    }
  });
}

Meteor.methods({
  
  exploreTops() {
    this.unblock();
    const xid = noIg();
    
    const allB = XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      groupId: { $ne: xid },
    },{fields:{'live':1, 'completed':1, 'lock':1}}).fetch();
    
    const xTotal = allB.length;
    const xlive = allB.filter( x => x.live === true ).length;
    const xDone = allB.filter( x => x.completed === true ).length;
    const xlocked = allB.filter( x => x.lock === true ).length;
    
    const xRapid = XRapidsDB.find({
      orgKey: Meteor.user().orgKey,
      groupId: { $ne: xid },
      live: true
    },{fields:{'_id':1}}).count();
    
    return [ xTotal, xlive, xDone, xlocked, xRapid ];
  },

  widgetTops(wID) {
    this.unblock();
    const variants = 0;// VariantDB.find({widgetId: wID},{fields:{_id:1}}).count();
    
    let batchQty = 0;
    let itemQty = 0;
    XBatchDB.find({
      orgKey: Meteor.user().orgKey, widgetId: wID},
      {fields:{'quantity':1}})
    .forEach( b => {
      batchQty += 1;
      itemQty += b.quantity;
    });

    return [ variants, batchQty, itemQty ];
  },
  
  groupTops(gID) {
    this.unblock();
    
    const group = GroupDB.findOne({ _id: gID });
    const topStats = group.topStats || null;
    const statime = topStats ? topStats.updatedAt : null;
    const stale = !statime ? true :
            moment.duration(moment().diff(moment(statime))).as('hours') > Config.freche;
    if(stale) {
      syncLocale(Meteor.user().orgKey);
      const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
      const batches = XBatchDB.find({
        orgKey: Meteor.user().orgKey,
        groupId: gID,
        createdAt: { 
          $gte: new Date(cutoff)
        }
      },{fields:{'batch':1,'salesEnd':1,'completedAt':1,'lockTrunc.performTgt':1}}
      ).fetch();
      
      let ontm = 0;
      let late = 0;
      let pftargets = [];
      
      for( let batch of batches) {
        const fin = getEndWork(batch._id, batch.salesEnd);
        const nowLate = moment().isAfter(fin);
        
        if( batch.completedAt && moment(batch.completedAt).isSameOrBefore(fin) ) {
          ontm += 1;
        }else if( (!batch.completedAt && nowLate) || ( batch.completedAt && moment(batch.completedAt).isAfter(fin) ) ) {
          late += 1;
        }else{
          null;
        }
        
        if(batch.lockTrunc) {
    			batch.lockTrunc.performTgt ? pftargets.push(batch.lockTrunc.performTgt) : null;
        }else{
          const t = TraceDB.findOne({batchID: batch._id},{fields:{'performTgt':1}});
          t && t.performTgt !== undefined ? pftargets.push(t.performTgt) : null;
        }
      }
      let ontime = [{
        x: 'on time',
        y: Math.round( (ontm / (ontm+late || 1)) * 100 )
      },{
        x: 'late',
        y: Math.round( (late / (ontm+late || 1)) * 100 )
      }];
      const avgPf = Math.round( avgOfArray(pftargets, true) );
        
      const widgets = WidgetDB.find({ groupId: gID},{fields:{'ncRate':1}}).fetch();
      const avgNC = avgOfArray(Array.from(widgets, x=> x.ncRate ? x.ncRate.rate : 0), true);
      
      const last = topStats ? topStats.stats : null;
      let tt = !last || ontime[0].y == last.ontime[0].y ? 0 : ontime[0].y > last.ontime[0].y ? 1 : -1;
      let nt = !last || avgNC == last.avgNC ? 0 : avgNC < last.avgNC ? 1 : -1;
      let tp = !last || avgPf == last.avgPf ? 0 : avgPf > last.avgPf ? 1 : -1;
      const trend = !last ? 'flat' :
                    ( tt == 0 && nt == 0 && tp == 0 ) ? last.trend :
                    tt + nt + tp >= 1 ? 'up' :
                    tt + nt + tp <= -1 ? 'down' : 
                    /* tt + nt + tp == 0 ? */ 'flat';
      
      const top = {
        ontime: ontime,
        avgNC: avgNC,
        avgPf: avgPf,
        trend: trend
      };
      
      GroupDB.update({ _id: gID }, {
        $set : {
          topStats: {
            stats: top,
            updatedAt: new Date(),
          }
      }});
      return top;
    }else{
      return topStats.stats;
    }
  },
  
  nonconQuickStats(batchID) {
    this.unblock();
    async function bundleNonCon(batchID) {
      try {
        bundle = await collectNonCon(batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleNonCon(batchID);
  },
  
  nonConSelfCount(nonConCol) {
    if(!Array.isArray(nonConCol)) {
      return [];
    }else{
      const nonConClean = nonConCol.filter( x => !x.trash );
      const types = _.uniq( Array.from(nonConClean, x => x.type) );
      
      let typeCounts = [];
      for( let t of types) {
        const ncCount = countMulti( nonConClean.filter( n => n.type === t ) );
        typeCounts.push({
          type: t,
          count: ncCount
        });
      }
      return typeCounts;
    }
  },
  
  shortfallSelfCount(shortfallCol) {
    if(!Array.isArray(shortfallCol)) {
      return [];
    }else{
      const pnums = _.uniq( Array.from(shortfallCol, x => x.partNum) );
      
      let pnCounts = [];
      for( let pn of pnums) {
        const shOf = shortfallCol.filter( s => s.partNum === pn );
        let shCount = 0;
        for(let sh of shOf) {
          shCount += ( sh.refs.length * (sh.multi || 1) );
        }
        pnCounts.push({
          partNum: pn,
          count: shCount
        });
      }
      return pnCounts;
    }
  },
  
  riverStepSelfCount(itemsCol) {
    const itemHistory = Array.from( itemsCol, x => 
              x.history.filter( y => 
                y.type !== 'first' && y.type !== 'scrap' && y.good === true) );
    
    const itemHkeys = Array.from( itemHistory, x => x.map( s => 
                                      `${s.key}<|>${s.step}<|>${s.type}` ) );
    
    const keysFlat = [].concat(...itemHkeys);
    const keyObj = _.countBy(keysFlat, x => x);
    const itr = Object.entries(keyObj);

    const keyArr = Array.from(itr, (a)=> ( {keystep: a[0], count: a[1]} ) );
    return keyArr;
  },
  
  waterfallSelfCount(waterfallCol) {
    let keyArr = [];
    for(let wf of waterfallCol) {
      const wfstep = `${wf.wfKey}<|>${wf.gate}<|>${wf.type}`;
      const wfCount = countWaterfall(wf.counts);
      
      keyArr.push({
        keystep: wfstep,
        count: wfCount
      });
    }
    return keyArr;
  },
  
  serverDatabaseSize() {
    const u = Meteor.users.find().count();
    const uA = Meteor.users.find({roles: { $in: ['active']}}).count();
    
    const g = GroupDB.find().count();
    const w = WidgetDB.find().count();
    const v = VariantDB.find().count();
    
    const b = XBatchDB.find().count();
    const bL = XBatchDB.find({live: true}).count();
    
    const i = XSeriesDB.find().count();
    const r = XRapidsDB.find().count();
    const t = TraceDB.find().count();
    const e = EquipDB.find().count();
    const m = MaintainDB.find().count();
    
    const tm = TimeDB.find().count();
    const ch = CacheDB.find().count();
    const em = EmailDB.find().count();

    
    return { u, uA, g, w, v, b, bL, i, r, t, e, m, tm, ch, em };
  }

});