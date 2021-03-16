import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';

import { batchTideTime } from './tideGlobalMethods.js';
import { calcShipDay } from './reportCompleted.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

//const isNow = (t)=>{ return ( now.isSame(moment(t), 'day') ) };

function dryPriorityCalc(bQuTmBdg, bTide, shipAim, now, shipLoad) {
  const shipAimMmnt = moment(shipAim);
  
  const totalQuoteMinutes = bQuTmBdg.length === 0 ? 0 :
                                bQuTmBdg[0].timeAsMinutes;
                                
  const totalTideMinutes = batchTideTime(bTide);
  
  const quote2tide = totalQuoteMinutes - totalTideMinutes;
  const overQuote = quote2tide < 0 ? true : false;
  const q2tNice = overQuote ? 0 : quote2tide;
  
  const estLatestBegin = shipAimMmnt.clone().subtractWorkingTime(q2tNice, 'minutes');
  
  // additional ship bumper
  // const estConclude = shipAimMmnt;//shipAimMmnt.clone().subtractWorkingTime(0, 'hours');
  const estSoonest = now.clone().addWorkingTime(q2tNice, 'minutes');

  const buffer = shipAimMmnt.workingDiff(estSoonest, 'minutes');
  
  const estEnd2fillBuffer = buffer || null;
  
  const dayGap = shipAimMmnt.workingDiff(now, 'days', true);
  const shipPull = dayGap <= 2.5 ? shipLoad * 2 : shipLoad;
  // const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) - dayGap );
  const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) + dayGap - shipPull );
  
  return { quote2tide, estSoonest, estLatestBegin, bffrRel, estEnd2fillBuffer };
}

function collectPriority(privateKey, batchID, mockDay) {
  return new Promise(resolve => {
    
    const app = AppDB.findOne({orgKey:privateKey}, {fields:{'nonWorkDays':1}});
    if(Array.isArray(app.nonWorkDays) ) {  
      moment.updateLocale('en', { holidays: app.nonWorkDays });
    }

    const now = moment().tz(Config.clientTZ);
    
    const b = BatchDB.findOne({_id: batchID}) ||
              XBatchDB.findOne({_id: batchID});
    
    if(!b) {
      resolve(false);
    }else{
      const endEntry = b.salesEnd || b.end;
      const doneEntry = b.completed ? b.completedAt : b.finishedAt;
      
      const future = mockDay ? mockDay : endEntry;
      const calcShip = calcShipDay( now, future );
      const shipAim = calcShip[1];
      const lateLate = calcShip[2];
      
      const qtBready = !b.quoteTimeBudget ? false : true;
      
      const oRapid = XRapidsDB.findOne({extendBatch: b.batch, live: true}) ? true : false;
      
      if(qtBready && b.tide && !doneEntry) {
        const shipLoad = TraceDB.find({shipAim: { 
          $gte: new Date(now.clone().nextShippingTime().startOf('day').format()),
          $lte: new Date(now.clone().nextShippingTime().endOf('day').format()) 
        }},{fields:{'batchID':1}}).count();
      
        const dryCalc = dryPriorityCalc(b.quoteTimeBudget, b.tide, shipAim, now, shipLoad);

        resolve({
          batch: b.batch,
          batchID: b._id,
          salesOrder: b.salesOrder,
          quote2tide: dryCalc.quote2tide,
          estSoonest: dryCalc.estSoonest.format(),
          estLatestBegin: dryCalc.estLatestBegin.format(),
          completed: doneEntry, 
          bffrRel: dryCalc.bffrRel,
          estEnd2fillBuffer: dryCalc.estEnd2fillBuffer,
          // endEntry: endEntry,
          shipAim: shipAim.format(),
          lateLate: lateLate,
          oRapid: oRapid
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
          // endEntry: endEntry,  
          shipAim: shipAim.format(),
          lateLate: lateLate,
          oRapid: oRapid
        });
      }
    }
  });
}

function getFastPriority(privateKey, bData, now, shipAim) {
  return new Promise(resolve => {
    
    const doneEntry = bData.completed ? bData.completedAt : bData.finishedAt;
      
    const qtBready = !bData.quoteTimeBudget ? false : true;
    
    if(qtBready && bData.tide && !doneEntry) {
      const shipLoad = TraceDB.find({shipAim: { 
        $gte: new Date(now.clone().nextShippingTime().startOf('day').format()),
        $lte: new Date(now.clone().nextShippingTime().endOf('day').format()) 
      }},{fields:{'batchID':1}}).count();
        
      const dryCalc = dryPriorityCalc(bData.quoteTimeBudget, bData.tide, shipAim, now, shipLoad);
      
      resolve({
        quote2tide: dryCalc.quote2tide,
        estSoonest: dryCalc.estSoonest.format(),
        estLatestBegin: dryCalc.estLatestBegin.format(),
        bffrRel: dryCalc.bffrRel,
        estEnd2fillBuffer: dryCalc.estEnd2fillBuffer
      });
    }else{
      resolve({
        quote2tide: false,
        estSoonest: false,
        estLatestBegin: false,
        bffrRel: false,
        estEnd2fillBuffer: 0
      });
    }
  });
}


function collectNonCon(privateKey, batchID, temp) {
  return new Promise(resolve => {
    let collection = false;
    const b = BatchDB.findOne({_id: batchID});
    const bx = XBatchDB.findOne({_id: batchID});
    if(b) {
      const itemQuantity = b.items.length;
      // nonCon relevant
      const rNC = b.nonCon.filter( n => !n.trash );
      // how many nonCons
      const nonConTotal = temp === 'cool' ? 0 : 
        rNC.length;
      // how many are unresolved  
      const nonConLeft = rNC.filter( x => 
        x.inspect === false && ( x.skip === false || x.snooze === true )
      ).length;
      // nc rate
      const ncRate = ( nonConTotal / itemQuantity ).toFixed(1, 10);
      // how many items have nonCons
      const hasNonCon = temp === 'cool' ? 0 :
        [... new Set( Array.from(rNC, x => { return x.serial }) ) ].length;
      // what percent of items have nonCons
      const percentOfNCitems = temp === 'cool' ? 0 :
        ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      // how many items are scrapped
      const itemIsScrap = temp === 'cool' ? 0 :
        b.items.filter( x => x.history.find( 
                          y => y.type === 'scrap' && y.good === true ) )
                            .length;
      // how many items with RMA
      let itemHasRMA = temp === 'cool' ? 0 :
        b.items.filter( x => x.rma.length > 0).length;
 
      collection = {
        batch: b.batch,
        batchID: b._id,
        nonConTotal: nonConTotal,
        nonConRate: ncRate,
        nonConLeft: nonConLeft,
        percentOfNCitems: isNaN(percentOfNCitems) ? '0%' : percentOfNCitems + '%',
        itemIsScrap: itemIsScrap,
        itemHasRMA: itemHasRMA
      };
      
      resolve(collection);
    }else if(bx) {
      const srs = XSeriesDB.findOne({batch: bx.batch});
      
      const items = !srs ? [] : srs.items;
      const itemQuantity = items.length;
      // nonCon relevant
      const rNC = !srs ? [] : srs.nonCon.filter( n => !n.trash );
      // how many nonCons
      const nonConTotal = temp === 'cool' ? 0 : rNC.length;
      // how many are unresolved  
      const nonConLeft = rNC.filter( x => x.inspect === false ).length;
      // nc rate
      const ncRate = ( nonConTotal / itemQuantity ).toFixed(1, 10);
      // how many items have nonCons
      const hasNonCon = temp === 'cool' ? 0 :
        [... new Set( Array.from(rNC, x => { return x.serial }) ) ].length;
      // what percent of items have nonCons
      const percentOfNCitems = temp === 'cool' ? 0 :
        ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      // how many items are scrapped
      const itemIsScrap = temp === 'cool' ? 0 :
        items.filter( x => x.history.find( 
          y => y.type === 'scrap' && y.good === true ) ).length;
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