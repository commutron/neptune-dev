import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { avgOfArray, percentOf, quadRegression } from './calcOps.js';
import { syncHoliday, countMulti, getEst } from './utility.js';
import { batchTideTime } from './tideGlobalMethods.js';
import { calcShipDay } from './reportCompleted.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

function dryPriorityCalc(bQuTmBdg, mEst, bTide, shipAim, now, shipLoad) {
  const shipAimMmnt = moment(shipAim);
  
  const totalQuoteMinutes = bQuTmBdg.length === 0 ? 0 : bQuTmBdg[0].timeAsMinutes;
  const estimatedMinutes = avgOfArray([totalQuoteMinutes, mEst]);
  const minDiff = `${mEst} (${mEst - totalQuoteMinutes})`;
  
  const totalTideMinutes = batchTideTime(bTide);
  
  const quote2tide = estimatedMinutes - totalTideMinutes;
  const overQuote = quote2tide < 0 ? true : false;
  const q2tNice = overQuote ? 0 : quote2tide;
  
  // additional ship bumper
  // const estConclude = shipAimMmnt.clone().subtractWorkingTime(0, 'hours');
  const estSoonest = now.clone().addWorkingTime(q2tNice, 'minutes');

  const buffer = shipAimMmnt.workingDiff(estSoonest, 'minutes');
  
  const estEnd2fillBuffer = buffer || null;
  
  const dayGap = shipAimMmnt.workingDiff(now, 'days', true);
  const shipPull = dayGap <= Config.shipSoon ? shipLoad * 2 : shipLoad;

  const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) + dayGap - shipPull );
  
  return { quote2tide, estSoonest, bffrRel, estEnd2fillBuffer, minDiff };
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
      const calcShip = calcShipDay( now, future );
      const shipAim = calcShip[1].format();
      const lateLate = calcShip[2];
      
      const qtBready = !b.quoteTimeBudget ? false : true;
      
      if(qtBready && b.tide && !doneEntry) {
        const shipLoad = TraceDB.find({shipAim: { 
          $gte: new Date(now.clone().nextShippingTime().startOf('day').format()),
          $lte: new Date(now.clone().nextShippingTime().endOf('day').format()) 
        }},{fields:{'batchID':1}}).count();

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
          minDiff: dryCalc.minDiff,
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
          minDiff: false,
          shipAim: shipAim,
          lateLate: lateLate,
          oRapid: rapIs
        });
      }
    }
  });
}

function getFastPriority(privateKey, bData, now, shipAim) {
  return new Promise(resolve => {
    const doneEntry = bData.completedAt;

    const qtBready = !bData.quoteTimeBudget ? false : true;
    
    if(qtBready && bData.tide && !doneEntry) {
      const shipLoad = TraceDB.find({shipAim: { 
        $gte: new Date(now.clone().nextShippingTime().startOf('day').format()),
        $lte: new Date(now.clone().nextShippingTime().endOf('day').format()) 
      }},{fields:{'batchID':1}}).count();
      
      const mEst = getEst(bData.widgetId, bData.quantity);
      
      const dryCalc = dryPriorityCalc(bData.quoteTimeBudget, mEst, bData.tide, shipAim, now, shipLoad);
      
      resolve({
        quote2tide: dryCalc.quote2tide,
        estSoonest: dryCalc.estSoonest.format(),
        bffrRel: dryCalc.bffrRel,
        estEnd2fillBuffer: dryCalc.estEnd2fillBuffer,
        minDiff: dryCalc.minDiff
      });
    }else{
      resolve({
        quote2tide: false,
        estSoonest: false,
        bffrRel: false,
        estEnd2fillBuffer: 0,
        minDiff: false
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
      const ncRate = ( nonConTotal / itemQuantity ).toFixed(1, 10);
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
        nonConRate: isNaN(ncRate) ? 0 : ncRate,
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
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await getFastPriority(accessKey, bData, now, shipAim);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundlePriority();
  },
  priorityTrace(batchID) {
    const b = XBatchDB.findOne({_id: batchID});
    const t = b && TraceDB.findOne({batch: b.batch});
    
    if(!b || !t) {
      return false;
    }else{
      return {
        batch: b.batch,
        batchID: b._id,
        salesOrder: b.salesOrder,
        quote2tide: t.quote2tide,
        estSoonest: t.estSoonest,
        completed: b.completed, 
        bffrRel: t.bffrRel,
        estEnd2fillBuffer: t.estEnd2fillBuffer,
        minDiff: t.minDiff,
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
      const done = items.filter( i => i.completed );
      
      const donePer = percentOf( items.length, done.length );
      const goalTimePer = quadRegression(donePer);
      
      const tide = b.tide || [];
      const totalTideMinutes = batchTideTime(tide);
      
      const mEst = getEst(b.widgetId, b.quantity);
      const budget = b.quoteTimeBudget || [];
      const totalQuoteMinutes = budget.length === 0 ? 0 : Number(budget[0].timeAsMinutes);
      const estimatedMinutes = avgOfArray([totalQuoteMinutes, mEst]);
      
      const realTimePer = percentOf( estimatedMinutes, totalTideMinutes );
      
      const diff = Math.round( goalTimePer - realTimePer );
                    
      const gold = !isFinite(diff) || donePer === 0 ? false : 
                   Math.round( diff * 0.075 );
      
      return {
        estimatedMinutes: estimatedMinutes,
        donePer: donePer,
        goalTimePer: goalTimePer,
        realTimePer: realTimePer,
        diff: diff,
        gold: gold
      };
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