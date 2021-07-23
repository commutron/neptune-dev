import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { batchTideTime } from './tideGlobalMethods.js';
import { countWaterfall, countMulti } from './utility';
import { avgOfArray } from './calcOps';
import { getEndWork } from '/server/shipOps';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});


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


Meteor.methods({

  widgetTops(wID) {
    const widget = WidgetDB.findOne({ _id: wID });
    const ncRate = widget.ncRate || null;
    const rate = ncRate ? ncRate.rate : 0;
    
    const variants = VariantDB.find({widgetId: wID},{fields:{_id:1}}).count();
    
    const batchesX = XBatchDB.find({
      orgKey: Meteor.user().orgKey, widgetId: wID},
      {fields:{'quantity':1}}).fetch();
    const batchInfoX = Array.from(batchesX, x => x.quantity);
    
    return [ variants, batchInfoX, rate ];
  },
  
  groupTops(gID) {
    this.unblock();
    
    const group = GroupDB.findOne({ _id: gID });
    const topStats = group.topStats || null;
    const statime = topStats ? topStats.updatedAt : null;
    const stale = !statime ? true :
            moment.duration(moment().diff(moment(statime))).as('hours') > 24;
    if(stale) {
      const batches = XBatchDB.find({
        orgKey: Meteor.user().orgKey,
        groupId: gID
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
        
      const widgets = WidgetDB.find({ groupId: gID 
      },{fields:{'ncRate':1}}).fetch();
      const avgNC = avgOfArray(Array.from(widgets, x=> x.ncRate ? x.ncRate.rate : 0), true);
      
      const last = topStats ? topStats.stats : null;
      let tt = !last || ontime == last.ontime ? 0 : ontime > last.ontime ? 1 : -1;
      let nt = !last || avgNC == last.avgNC ? 0 : avgNC < last.avgNC ? 1 : -1;
      let tp = !last || avgPf == last.avgPf ? 0 : avgPf > last.avgPf ? 1 : -1;
      const trend = tt + nt + tp === 3 ? 'up' :
                    tt + nt + tp === -3 ? 'down' : 'flat';
      
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
  }

});