import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import { countMulti, countMultiRefs } from './utility';
import { asRate, round1Decimal } from './calcOps';
import { getEndWork } from '/server/shipOps';
import Config from '/server/hardConfig.js';

export function plotCreatedQty(batches) {
  let qtyset = [];
  for( let batch of batches) {
    qtyset.push({
      y: batch.quantity,
      x: batch.createdAt,
      z: `${batch.batch} (so.${batch.salesOrder}) = ${batch.quantity}`,
      symbol: 'plus',
      size: '2'
    });
  }
  return qtyset;
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
  let onset = [];
  for( let batch of batches) {
    const did = batch.completedAt || moment.tz(Config.clientTZ).format();
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

/*function plotItemOnTime(batch) {
  const srs = XSeriesDB.findOne({batch: batch},
          {fields:{'items.serial':1,'items.completed':1,'items.completedAt':1}});
  if(!srs) {
    return [];
  }else{
    let onset = [];
    
    const fin = getEndWork(batch._id, batch.salesEnd);
    
    const doneitems = srs.items.filter( x=> x.completed );
    
    for(let i of doneitems) {
      const finGap = round1Decimal( moment(fin).workingDiff(i.completedAt, 'days', true) );

      onset.push({
        y: finGap,
        x: i.completedAt,
        z: `${i.serial} = ${finGap}`,
        symbol: 'diamond',
        size: '2'
      });
    }
  }
  return onset;
}*/

export function plotProblems(batches) {
  let probset = [];
  for( let batch of batches) {
    const srs = XSeriesDB.findOne({batch: batch.batch});
    const units = srs ? srs.items.length > 0 ? srs.items.reduce((t,i)=> t + i.units, 0) : 0 : 0;
    const ncQty = srs ? countMulti(srs.nonCon) : 0;
    const ncRte = asRate(ncQty, units);
    const shQty = srs ? countMultiRefs(srs.shortfall) : 0;
    const shRte = asRate(shQty, units);
    probset.push({
      r: ncRte,
      s: `${batch.batch} = ${ncRte}`,
      y: ncQty,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = ${ncQty} noncons`,
      symbol: 'square',
      size: 2+ncRte
    });
    probset.push({
      r: shRte,
      s: `${batch.batch} = ${shRte}`,
      y: shQty,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = ${shQty} shortfalls`,
      symbol: 'triangleUp',
      size: 2+shRte
    });
  }
  return probset;
}

export function plotBranchNC(batches, branches) {
  let bSet = [];
  
  for( let batch of batches) {
    const srs = XSeriesDB.findOne({batch: batch.batch},{fields:{'nonCon':1}});
    const ncs = srs ? srs.nonCon : [];
    let brnc = [];
    for(let br of branches) {
      const qty = countMulti(ncs.filter(n=> n.where === br));
      brnc.push(qty);
    }
    bSet.push({
      y: brnc,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = `,
      symbol: 'square',
      size: '2'
    });
  }
  return bSet;
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
  
  
  // widgetPlotOnTime(groupId) {
  //   const batches = XBatchDB.find({
  //     orgKey: Meteor.user().orgKey,
  //     groupId: groupId
  //   },
  //     {fields:{'batch':1,'completedAt':1,'salesEnd':1}}
  //   ).fetch();
    
  //   let onset = plotItemOnTime(batches);
  //   return onset;
  // },

  
});