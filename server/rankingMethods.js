import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { round2Decimal, avg4est, asRate, percentOf, quadRegression } from './calcOps.js';
import { syncLocale, countMulti, getEst } from './utility.js';
import { batchTideTime } from './tideGlobalMethods.js';
import { calcShipDay } from './reportCompleted.js';
import { getShipLoad } from '/server/shipOps';

function dryPriorityCalc(bQuTmBdg, mEst, bTide, shipAim, now, shipLoad, timePer) {
  // console.time('dryPriorityCalc_run_time');
  const shipAimMmnt = moment(shipAim);
  
  const mQuote = Number( bQuTmBdg.length === 0 ? 0 : bQuTmBdg[0].timeAsMinutes || 0 );
  const isQuoted = mQuote > 0;
  
  const estimatedMinutes = avg4est(mQuote, mEst);
  
  const totalTideMinutes = batchTideTime(bTide);
  
  const quote2tide = mQuote - totalTideMinutes;
  const est2tide = estimatedMinutes - totalTideMinutes;
  const est2item = round2Decimal( !timePer ? est2tide : (estimatedMinutes * ( 1 - (timePer / 100) )) );
  
  const overQuote = totalTideMinutes > mQuote;
  const e2tNice = Math.max(0, est2tide);
  
  const aimAhead = shipAimMmnt.clone().subtract(Config.shipAhead, 'hours');
  const estSoonest = now.clone().addWorkingTime(e2tNice, 'minutes');
  
  const buffer = aimAhead.workingDiff(estSoonest, 'minutes');
  
  const estEnd2fillBuffer = buffer || null;
  
  const dayGap = shipAimMmnt.workingDiff(now, 'days', true);
  const shipPull = dayGap <= Config.shipSoon ? shipLoad * 2 : shipLoad;

  const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) + dayGap - shipPull );
  // console.timeEnd('dryPriorityCalc_run_time');
  
  return { quote2tide, est2tide, est2item, estSoonest, bffrRel, estEnd2fillBuffer, overQuote, isQuoted };
}

function collectPriority(batchID, mockDay) {
  return new Promise(resolve => {
    const now = moment().tz(Config.clientTZ);

    const b = XBatchDB.findOne({_id: batchID});
    
    if(!b) {
      resolve(false);
    }else{
      const trc = TraceDB.findOne({batchID: b._id},{fields:{'performTgt':1,'donePnt': 1}});
      const tgt = trc ? trc.performTgt || 0 : 0;
      
      const mEst = getEst(b.widgetId, b.quantity, tgt);
      
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

        const donePnt = trc ? trc.donePnt || 0 : 0;
        const donePer = b.completed ? 100 : round2Decimal(donePnt * 100);
        const timeReg = quadRegression(donePer);
        const timePer = timeReg > Config.qregA ? timeReg : undefined;
      
        const dryCalc = dryPriorityCalc(b.quoteTimeBudget, mEst, b.tide, shipAim, now, shipLoad, timePer);

        resolve({
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: dryCalc.quote2tide,
          est2tide: dryCalc.est2tide,
          est2item: dryCalc.est2item,
          estSoonest: dryCalc.estSoonest.format(),
          completed: doneEntry, 
          bffrRel: dryCalc.bffrRel,
          estEnd2fillBuffer: dryCalc.estEnd2fillBuffer,
          overQuote: dryCalc.overQuote,
          shipAim: shipAim,
          lateLate: lateLate,
          oRapid: rapIs,
          hold: b.hold
        });
      }else{
        resolve({
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: 0,
          est2tide: false,
          est2item: 0,
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

function getFastPriority(bData, now, shipAim, shipLoaded) {
  return new Promise(resolve => {
    const doneEntry = bData.completedAt;

    const qtBready = !bData.quoteTimeBudget ? false : true;
    
    if(qtBready && bData.tide && !doneEntry) {
      const shipLoad = !isNaN(shipLoaded) ? shipLoaded : getShipLoad(now);
      const trc = TraceDB.findOne({batchID: bData._id},{fields:{'performTgt':1,'donePnt': 1}});
      const tgt = trc ? trc.performTgt || 0 : 0;
      
      const mEst = getEst(bData.widgetId, bData.quantity, tgt);
      
      const donePnt = trc ? trc.donePnt || 0 : 0;
      const donePer = bData.completed ? 100 : round2Decimal(donePnt * 100);
      const timeReg = quadRegression(donePer);
      const timePer = timeReg > Config.qregA ? timeReg : undefined;
      
      const dryCalc = dryPriorityCalc(bData.quoteTimeBudget, mEst, bData.tide, shipAim, now, shipLoad, timePer);
      
      resolve({
        quote2tide: dryCalc.quote2tide,
        est2tide: dryCalc.est2tide,
        est2item: dryCalc.est2item,
        estSoonest: dryCalc.estSoonest.format(),
        bffrRel: dryCalc.bffrRel,
        estEnd2fillBuffer: dryCalc.estEnd2fillBuffer,
        overQuote: dryCalc.overQuote,
        isQuoted: dryCalc.isQuoted
      });
    }else{
      resolve({
        quote2tide: 0,
        est2tide: false,
        est2item: 0,
        estSoonest: false,
        bffrRel: false,
        estEnd2fillBuffer: 0,
        overQuote: false,
        isQuoted: false
      });
    }
  });
}


Meteor.methods({
  
  priorityRank(batchID, serverAccessKey, mockDay, recalc) {
    async function bundlePriority() {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      syncLocale(accessKey);
      try {
        bundle = await collectPriority(batchID, mockDay, recalc);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority();
  },
  priorityFast(serverAccessKey, bData, now, shipAim, shipLoad) {
    async function bundlePriority() {
      syncLocale(serverAccessKey);
      try {
        bundle = await getFastPriority(bData, now, shipAim, shipLoad);
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
        est2tide: t.est2tide,
        estSoonest: t.estSoonest,
        completed: t.completed, 
        bffrRel: t.bffrRel,
        estEnd2fillBuffer: t.estEnd2fillBuffer,
        overQuote: t.overQuote,
        shipAim: t.shipAim,
        lateLate: t.lateLate,
        oRapid: t.oRapid,
        hold: t.hold
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
      
      // -- nc rate calculation filter --
      const nc = countMulti( srs ? srs.nonCon.filter( n => !n.trash && !(n.inspect && !n.fix) ) : [] );
      const units = items.length > 0 ? items.reduce((t,i)=> t + i.units, 0) : 0;
      const rate = asRate(nc, units);
      const pb = rate < 1 ? Math.round(rate) : Math.ceil(rate*0.1);
          
      const done = items.filter( i => i.completed );
      const donePer = b.completed ? 100 : percentOf( items.length, done.length );
      
      const goalTimePer = quadRegression(donePer);
      
      const tide = b.tide || [];
      const totalTideMinutes = batchTideTime(tide);
      
      const mEst = getEst(b.widgetId, b.quantity, 0);
      const budget = b.quoteTimeBudget || [];
      const mQuote = budget.length === 0 ? 0 : Number(budget[0].timeAsMinutes) || 0;
      const estMinutes = mQuote === 0 ? mEst :
                         mQuote < mEst ? mQuote : avg4est(mQuote, mEst);
      
      const realTimePer = percentOf( estMinutes, totalTideMinutes );
      
      const diff = Math.round( goalTimePer - realTimePer );
                    
      const au = !isFinite(diff) || totalTideMinutes === 0 ? null :
                   donePer === 0 ? realTimePer < Config.qregA ? 0 : -1 :
                   Math.round( diff * 0.15 );
      
      const factor = isFinite(au) && isFinite(pb) ? au - pb : null;
      const safeFactor = Math.min(factor, 100);
      return safeFactor;
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
  }
  
});