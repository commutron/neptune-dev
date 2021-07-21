import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import { countMulti, countMultiRefs } from './utility';
import { asRate, round1Decimal } from './calcOps';
import { getShipAim, getEndWork } from '/server/shipOps';
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
    const aim = getShipAim(batch._id, batch.salesEnd);
    const aimGap = round1Decimal( moment(aim).workingDiff(did, 'days', true) );
    const fin = getEndWork(batch._id, batch.salesEnd);
    const finGap = round1Decimal( moment(fin).workingDiff(did, 'days', true) );

    onset.push({
      v: finGap,
      w: `${batch.batch} = ${finGap}`,
      y: aimGap,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = ${aimGap}`,
      symbol: batch.completedAt ? 'diamond' : 'star',
      size: '2'
    });
  }
  return onset;
}

function plotItemOnTime(batches) {
  let ontm = 0;
  let late = 0;
  for( let batch of batches) {
    const srs = XSeriesDB.findOne({batch: batch.batch});
    if(!srs) {
      continue;
    }else{
      const fin = getEndWork(batch._id, batch.salesEnd);
      const nowLate = moment().isAfter(fin);
      
      const ontmItems = srs.items.filter( 
          x => x.completed && moment(x.completedAt).isSameOrBefore(fin) 
        ).length;
      const lateItems = srs.items.filter( 
          x => (!x.completed && nowLate) || ( x.completed && moment(x.completedAt).isAfter(fin) )
        ).length;
      
      ontm += ontmItems;
      late += lateItems;
    }
  }
  let onset = [{
    x: 'on time',
    y: Math.round( (ontm / (ontm+late || 1)) * 100 )
  },
  {
    x: 'late',
    y: Math.round( (late / (ontm+late || 1)) * 100 )
  }];
  return onset;
}

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
      size: '2'
    });
    probset.push({
      r: shRte,
      s: `${batch.batch} = ${shRte}`,
      y: shQty,
      x: batch.completedAt || new Date(),
      z: `${batch.batch} = ${shQty} shortfalls`,
      symbol: 'triangleUp',
      size: '2'
    });
  }
  return probset;
}


Meteor.methods({
  
  groupPlotPerform(groupId) {
    const accessKey = Meteor.user().orgKey;

    const app = AppDB.findOne({ orgKey: accessKey });
    const tideWall = app && app.tideWall;

    const batches = XBatchDB.find({
      orgKey: accessKey,
      groupId: groupId,
      createdAt: { 
        $gte: new Date(tideWall)
      }
    },
      {fields:{'batch':1,'completedAt':1}}
    ).fetch();
    
    let perfset = plotPerform(batches);
    return perfset;
  },
  
  groupPlotProb(groupId) {
    const batches = XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      groupId: groupId
    },
      {fields:{'batch':1,'completedAt':1}}
    ).fetch();
    
    let probset = plotProblems(batches);
    return probset;
  },
  
  groupPlotOnTime(groupId) {
    const batches = XBatchDB.find({
      orgKey: Meteor.user().orgKey,
      groupId: groupId
    },
      {fields:{'batch':1,'completedAt':1,'salesEnd':1}}
    ).fetch();
    
    let onset = plotItemOnTime(batches);
    return onset;
  }

  
});