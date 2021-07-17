import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { avgOfArray, asRate, percentOf, quadRegression } from './calcOps.js';
import { syncHoliday, countMulti, getEst } from './utility.js';
import { batchTideTime } from './tideGlobalMethods.js';
import { calcShipDay } from './reportCompleted.js';
import { getShipLoad } from '/server/shipOps';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

function dryPriorityCalc(bQuTmBdg, mEst, bTide, shipAim, now, shipLoad) {
  const shipAimMmnt = moment(shipAim);
  
  const mQuote = bQuTmBdg.length === 0 ? 0 : bQuTmBdg[0].timeAsMinutes;
  const estimatedMinutes = avgOfArray([mQuote, mEst]);
  
  const totalTideMinutes = batchTideTime(bTide);
  
  const quote2tide = estimatedMinutes - totalTideMinutes;
  const overQuote = totalTideMinutes > mQuote;
  const q2tNice = overQuote ? 0 : quote2tide;
  
  const aimAhead = shipAimMmnt.clone().subtractWorkingTime(Config.shipAhead, 'hours');
  const estSoonest = now.clone().addWorkingTime(q2tNice, 'minutes');

  const buffer = aimAhead.workingDiff(estSoonest, 'minutes');
  
  const estEnd2fillBuffer = buffer || null;
  
  const dayGap = shipAimMmnt.workingDiff(now, 'days', true);
  const shipPull = dayGap <= Config.shipSoon ? shipLoad * 2 : shipLoad;

  const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) + dayGap - shipPull );
  
  return { quote2tide, estSoonest, bffrRel, estEnd2fillBuffer, overQuote };
}

function collectPriority(privateKey, batchID, mockDay) {
  return new Promise(resolve => {
    const now = moment().tz(Config.clientTZ);

    const b = XBatchDB.findOne({_id: batchID});
    
    if(!b) {
      resolve(false);
    }else{
      const mEst = getEst(b.widgetId, b.quantity);

      const oRapid = XRapidsDB.findOne({extendBatch: b.batch, live: true});
      const rapIs = oRapid ? oRapid.rapid : false;
    
      const endDay = rapIs && moment(oRapid.deliverAt).isAfter(b.salesEnd) ? 
                      oRapid.deliverAt : b.salesEnd;
      
      const doneEntry = b.completedAt;
      
      const future = mockDay ? mockDay : endDay;
      const calcShip = calcShipDay( batchID, now, future );
      const shipAim = calcShip[1];
      const lateLate = calcShip[2];
      
      const qtBready = !b.quoteTimeBudget ? false : true;
      
      if(qtBready && b.tide && !doneEntry) {
        const shipLoad = getShipLoad(now);

        const dryCalc = dryPriorityCalc(b.quoteTimeBudget, mEst, b.tide, shipAim, now, shipLoad);

        resolve({
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: dryCalc.quote2tide,
          estSoonest: dryCalc.estSoonest.format(),
          completed: doneEntry, 
          bffrRel: dryCalc.bffrRel,
          estEnd2fillBuffer: dryCalc.estEnd2fillBuffer,
          overQuote: dryCalc.overQuote,
          shipAim: shipAim,
          lateLate: lateLate,
          oRapid: rapIs
        });
      }else{
        resolve({
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: false,
          completed: doneEntry,
          bffrRel: false,
          estEnd2fillBuffer: 0,
          overQuote: false,
          shipAim: shipAim,
          lateLate: lateLate,
          oRapid: rapIs
        });
      }
    }
  });
}

function getFastPriority(bData, now, shipAim) {
  return new Promise(resolve => {
    const doneEntry = bData.completedAt;

    const qtBready = !bData.quoteTimeBudget ? false : true;
    
    if(qtBready && bData.tide && !doneEntry) {
      const shipLoad = getShipLoad(now);
      
      const mEst = getEst(bData.widgetId, bData.quantity);
      
      const dryCalc = dryPriorityCalc(bData.quoteTimeBudget, mEst, bData.tide, shipAim, now, shipLoad);
      
      resolve({
        quote2tide: dryCalc.quote2tide,
        estSoonest: dryCalc.estSoonest.format(),
        bffrRel: dryCalc.bffrRel,
        estEnd2fillBuffer: dryCalc.estEnd2fillBuffer,
        overQuote: dryCalc.overQuote
      });
    }else{
      resolve({
        quote2tide: false,
        estSoonest: false,
        bffrRel: false,
        estEnd2fillBuffer: 0,
        overQuote: false
      });
    }
  });
}


function collectNonCon(privateKey, batchID, temp) {
  return new Promise(resolve => {
    let collection = false;
    const bx = XBatchDB.findOne({_id: batchID});
    if(bx) {
      const srs = XSeriesDB.findOne({batch: bx.batch});
      
      const items = !srs ? [] : srs.items;
      const itemQuantity = items.length;
      // nonCon relevant
      const rNC = !srs ? [] : srs.nonCon.filter( n => !n.trash );
      // how many nonCons
      const nonConTotal = temp === 'cool' ? 0 : countMulti(rNC);
      // how many are unresolved  
      const nonConLeft = countMulti( rNC.filter( x => x.inspect === false ) );
      // nc rate
      const ncRate = asRate(nonConTotal, itemQuantity, true);
      // how many items have nonCons
      const hasNonCon = temp === 'cool' ? 0 :
        [... new Set( Array.from(rNC, x => x.serial) ) ].length;
      // what percent of items have nonCons
      const percentOfNCitems = temp === 'cool' ? 0 :
        itemQuantity === 0 ? 0 : hasNonCon >= itemQuantity ? 100 :
        ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      // how many items are scrapped
      const itemIsScrap = temp === 'cool' ? 0 :
        items.filter( x => x.scrapped ).length;
      // how many items with RMA
      let itemHasRapid = temp === 'cool' ? 0 :
        items.filter( x => x.altPath.find( y => y.rapId !== false) ).length;
 
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
  
  priorityRank(batchID, serverAccessKey, mockDay) {
    async function bundlePriority() {//batchID, orgKey, mockDay) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      syncHoliday(accessKey);
      try {
        bundle = await collectPriority(accessKey, batchID, mockDay);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority();
  },
  priorityFast(serverAccessKey, bData, now, shipAim) {
    async function bundlePriority() {
      try {
        bundle = await getFastPriority(bData, now, shipAim);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority();
  },
  priorityTrace(batchID) {
    const t = TraceDB.findOne({batchID: batchID});
    
    if(!t) {
      return false;
    }else{
      return {
        batch: t.batch,
        batchID: t.batchID,
        salesOrder: t.salesOrder,
        quote2tide: t.quote2tide,
        estSoonest: t.estSoonest,
        completed: t.completed, 
        bffrRel: t.bffrRel,
        estEnd2fillBuffer: t.estEnd2fillBuffer,
        overQuote: t.overQuote,
        shipAim: t.shipAim,
        lateLate: t.lateLate,
        oRapid: t.oRapid
      };
    }
  },
  
  performTarget(batchID) {
    const b = XBatchDB.findOne({_id: batchID});
    
    if(!b) {
      return false;
    }else{
      const srs = XSeriesDB.findOne({batch: b.batch});
      const items = srs ? srs.items : [];
      
      const nc = srs ? srs.nonCon.filter( n => !n.trash ) : [];
      const rate = nc.length / b.quantity;
      const pb = isFinite(rate) ? rate < 1 ? Math.round(rate) : Math.ceil(rate*0.1) : 0;
          
      const done = items.filter( i => i.completed );
      const donePer = b.completed ? 100 : percentOf( items.length, done.length );
      
      const goalTimePer = quadRegression(donePer);
      
      const tide = b.tide || [];
      const totalTideMinutes = batchTideTime(tide);
      
      const mEst = getEst(b.widgetId, b.quantity);
      const budget = b.quoteTimeBudget || [];
      const mQuote = budget.length === 0 ? 0 : Number(budget[0].timeAsMinutes);
      const estMinutes = mQuote > 0 && mQuote < mEst ? mQuote : avgOfArray([mQuote, mEst]);
      
      const realTimePer = percentOf( estMinutes, totalTideMinutes );
      
      const diff = Math.round( goalTimePer - realTimePer );
                    
      const au = !isFinite(diff) || totalTideMinutes === 0 ? null :
                   donePer === 0 ? realTimePer < Config.qregA ? 0 : -1 :
                   Math.round( diff * 0.15 );
      
      const factor = isFinite(au) && isFinite(pb) ? au - pb : null;
      return factor;
    }
  },
  
  performTrace(batchID) {
    const b = XBatchDB.findOne({_id: batchID},{fields:{'lockTrunc':1}});
    if(b && b.lockTrunc && b.lockTrunc.performTgt !== undefined) {
      return b.lockTrunc.performTgt;
    }else{
      const t = TraceDB.findOne({batchID: batchID},{fields:{'performTgt':1}});
      if(t && t.performTgt !== undefined) {
        return t.performTgt;
      }else{
        return Meteor.call('performTarget', batchID);
      }
    }
  },
  
  nonconQuickStats(batchID, temp) {
    async function bundleNonCon(batchID) {
      const accessKey = Meteor.user().orgKey;
      try {
        bundle = await collectNonCon(accessKey, batchID, temp);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleNonCon(batchID);
  }
  
});