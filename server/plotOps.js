import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { syncLocale, countMulti, countMultiRefs } from './utility';
import { asRate, round1Decimal } from './calcOps';
import { getEndWork } from '/server/shipOps';
import Config from '/server/hardConfig.js';

export function plotCreatedOrders(batch) {
  const now = moment.tz(Config.clientTZ).format();
  const gap = (did, sSt)=> round1Decimal( moment(did).workingDiff(sSt, 'days') );

  const did = b.completedAt || now;
  const trnGap = gap( did, b.salesStart );
    
  return {
    x1: batch.createdAt,
    x2: batch.salesStart,
    y1: batch.quantity,
    y2: trnGap,
    z: `${batch.batch} (so.${batch.salesOrder})`,
  };
}

export function plotPerform(batch) {
  
  const p = Meteor.call('performTrace', batch._id);
  
  return {
    y: p,
    x: batch.completedAt || new Date(),
    z: `${batch.batch} = ${p > 0 ? '+'+p : p}`
  };
}

export function plotOnTime(batch) {
  const now = moment.tz(Config.clientTZ).format();
  
  const did = batch.completedAt || now;
  const fin = getEndWork(batch._id, batch.salesEnd);
  const finGap = round1Decimal( moment(fin).workingDiff(did, 'days', true) );

  return {
    y: finGap,
    x: batch.completedAt || new Date(),
    z: `${batch.batch} = ${finGap}`
  };
}

export function plotNonCons(batchList, doneDates, branches) {

  let ncnset = XSeriesDB.find({
    batch: { $in: batchList }},
    {fields:{'batch':1,'items.units':1,'nonCon':1}})
  .map( srs => {
    
    const units = srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0;
    // -- nc rate calculation filter --
    const nncns = srs.nonCon.filter( n => !n.trash && !(n.inspect && !n.fix) );
      
    let ncQty = 0;
        
    let brncQt = [];
    let brncRt = [];
    for(let br of branches) {
      const qty = countMulti(nncns.filter(n=> n.where === br));
      ncQty += qty;
      brncQt.push(qty);
      const ncRt = asRate(qty, units);
      brncRt.push(ncRt);
    }
    brncQt.unshift(ncQty);
    let ncRte = asRate(ncQty, units);
    brncRt.unshift(ncRte);
    
    const done = doneDates.find( d=> d[0] === srs.batch )?.[1];
    
    return {
      r: brncRt,
      y: brncQt,
      x: done || new Date(),
      z: `${srs.batch} = `
    };
  });
  
  const ncnsetS = ncnset.sort((a,b)=> a.x > b.x ? 1 : a.x < b.x ? -1 : 0);
      
  return ncnsetS;
}

export function plotShorts(batchList, doneDates, branches) {
  
  let shtset = XSeriesDB.find({
    batch: { $in: batchList }},
    {fields:{'batch':1,'items.units':1,'shortfall':1}})
  .map( srs => {
    
    const units = srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0;
    const shfls = srs.shortfall;
    
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
    
    const done = doneDates.find( d=> d[0] === srs.batch )?.[1];
    
    return {
      r: brshRt,
      y: brshQt,
      x: done || new Date(),
      z: `${srs.batch} = `,
    };
  });
  
  const shtsetS = shtset.sort((a,b)=> a.x > b.x ? 1 : a.x < b.x ? -1 : 0);
  
  return shtsetS;
}

export function plotTest(batchList, doneDates) {
  let tSet = XSeriesDB.find({
    batch: { $in: batchList }},
    {fields:{'batch':1,'items':1}})
  .map( srs => {
    
    const done = doneDates.find( d=> d[0] === srs.batch )?.[1];
    
    const itm = srs.items.some(i=> i.history.find(h=> h.type === 'test'));
    if(itm) {
      let ngi = srs.items.filter(i=> i.history.find(h=> h.type === 'test' && h.good === false));
      let ngf = 0;
      for(let i of ngi) {
        ngf += i.history.filter(h=> h.type === 'test' && h.good === false).length;
      }
      return {
        y: ngi.length,
        x: done || new Date(),
        z: `${srs.batch} = ${ngi.length} items`,
        r: ngf
      };
    }else{
      return {
        y: 0,
        x: done || new Date(),
        z: `${srs.batch} = 0 items`,
        r: 0
      };
    }
  });
  return tSet;
}

Meteor.methods({

  getBatchOnTime(idLimiter) {
    syncLocale(Meteor.user().orgKey);
    
    const onset = XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      widgetId: idLimiter
    },
      {fields:{'batch':1,'completedAt':1,'salesEnd':1}}
    ).map( b => plotOnTime(b) );
    
    const onsetS = onset.sort((a,b)=> a.x > b.x ? 1 : a.x < b.x ? -1 : 0);
  
    return onsetS;
  },
  
  getBatchFailPlot(idLimiter) {
    let batchList = [];
    let doneDates = [];
    
    XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      widgetId: idLimiter
    },
      {fields:{'batch':1,'completedAt':1}}
    ).forEach( b => {
        batchList.push(b.batch);
        doneDates.push([
          b.batch, 
          b.completedAt
        ]);
      });
    
    let onset = plotTest(batchList, doneDates);
    return onset;
  },

  
});