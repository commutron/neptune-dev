import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { syncLocale, countMulti, countMultiRefs } from './utility';
import { asRate, round1Decimal } from './calcOps';
import { getEndWork } from '/server/shipOps';
import Config from '/server/hardConfig.js';

export function plotCreatedOrders(batches) {
  const now = moment.tz(Config.clientTZ).format();
  const gap = (did, sSt)=> round1Decimal( moment(did).workingDiff(sSt, 'days') );

  let orderset = [];
  for( let b of batches) {
    const did = b.completedAt || now;
    const trnGap = gap( did, b.salesStart );
    
    orderset.push({
      y1: b.quantity,
      x1: b.createdAt,
      y2: trnGap,
      x2: b.salesStart,
      z: `${b.batch} (so.${b.salesOrder})`,
      s1: 'plus',
      s2: b.completedAt ? 'diamond' : 'star',
      size: '2'
    });
  }
  return orderset;
}

export function plotPerform(batches) {
  let perfset = [];
  for( let batch of batches) {
    const p = Meteor.call('performTrace', batch._id);
    perfset.push({
      y: p,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = ${p > 0 ? '+'+p : p}`,
      symbol: batch.completedAt ? 'diamond' : 'star',
      size: '2'
    });
  }
  return perfset;
}

export function plotOnTime(batches) {
  const now = moment.tz(Config.clientTZ).format();
  
  let onset = [];
  for( let batch of batches) {
    const did = batch.completedAt || now;
    const fin = getEndWork(batch._id, batch.salesEnd);
    const finGap = round1Decimal( moment(fin).workingDiff(did, 'days', true) );

    onset.push({
      y: finGap,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = ${finGap}`,
      symbol: batch.completedAt ? 'diamond' : 'star',
      size: '2'
    });
  }
  return onset;
}

export function plotNonCons(batches, branches) {
  let ncnset = [];
  for( let batch of batches) {
    const srs = XSeriesDB.findOne({batch: batch.batch});
    const units = srs ? srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0 : 0;
    // -- nc rate calculation filter --
    const nncns = srs ? srs.nonCon.filter( n => !n.trash && !(n.inspect && !n.fix) ) : [];
      
    const ncQty = srs ? countMulti(nncns) : 0;
    const ncRte = asRate(ncQty, units);
    
    let brncQt = [ ncQty ];
    let brncRt = [ ncRte ];
    for(let br of branches) {
      const qty = ncQty === 0 ? 0 : countMulti(nncns.filter(n=> n.where === br));
      brncQt.push(qty);
      const ncRt = asRate(qty, units);
      brncRt.push(ncRt);
    }
    
    ncnset.push({
      r: brncRt,
      y: brncQt,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = `,
      symbol: 'square',
      size: 2
    });
  }
  return ncnset;
}

export function plotShorts(batches, branches) {
  let shtset = [];
  for( let batch of batches) {
    const srs = XSeriesDB.findOne({batch: batch.batch});
    const units = srs ? srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0 : 0;
    const shfls = srs ? srs.shortfall : [];
    
    const shQty = countMultiRefs(shfls);
    const shRte = asRate(shQty, units);
    
    let brshQt = [ shQty ];
    let brshRt = [ shRte ];
    for(let br of branches) {
      const qty = shQty === 0 ? 0 : countMulti(shfls.filter(n=> n.where === br));
      brshQt.push(qty);
      const shRt = asRate(qty, units);
      brshRt.push(shRt);
    }
    
    shtset.push({
      r: brshRt,
      y: brshQt,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = `,
      symbol: 'triangleUp',
      size: 2
    });
  }
  return shtset;
}

export function plotTest(batches) {
  let tSet = [];
  
  for( let batch of batches) {
    const srs = XSeriesDB.findOne({batch: batch.batch},{fields:{'items':1}});
    const itm = srs ? srs.items.some(i=> i.history.find(h=> h.type === 'test')) : false;
    if(itm) {
      let ngi = srs.items.filter(i=> i.history.find(h=> h.type === 'test' && h.good === false));
      let ngf = 0;
      for(let i of ngi) {
        ngf += i.history.filter(h=> h.type === 'test' && h.good === false).length;
      }
      tSet.push({
        y: ngi.length,
        x: batch.completedAt || new Date(),
        z: `${batch.batch} = ${ngi.length} items`,
        q: ngf
      });
    }
  }
  return tSet;
}

Meteor.methods({

  getBatchOnTime(idLimiter) {
    syncLocale(Meteor.user().orgKey);
    
    const batches = XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      widgetId: idLimiter
    },
      {fields:{'batch':1,'completedAt':1,'salesEnd':1}}
    ).fetch();
    
    let onset = plotOnTime(batches);
    return onset;
  },
  
  getBatchFailPlot(idLimiter) {
    const batches = XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      widgetId: idLimiter
    },
      {fields:{'batch':1,'completedAt':1}}
    ).fetch();
    
    let onset = plotTest(batches);
    return onset;
  },

  
});