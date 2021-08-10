import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { avgOfArray, percentOf } from '/server/calcOps';
import Config from '/server/hardConfig.js';
import { syncLocale, noIg } from './utility';

function toRelDiff(bSalesStart, bReleases) {
  
  const floorRelease = bReleases.find( x => x.type === 'floorRelease');
  const flrRelTime = floorRelease && floorRelease.time;
  
  const gapSale2Rel = !flrRelTime ? false :
    moment(flrRelTime).workingDiff(bSalesStart, 'days');

  return gapSale2Rel;
}

function toStrtDiff(bSalesStart, bTide) {

  const tideBegin = bTide && bTide.length > 0 ? bTide[0] : null;
  const beginTime = tideBegin ? tideBegin.startTime : null;
  
  const gapSale2Start = !beginTime ? false :
    moment(beginTime).workingDiff(bSalesStart, 'days');
  
  return gapSale2Start;
}

function toFFinDiff(bSalesStart, items) {
  const fitems = items.filter( i => i.completed );
  const itemS = fitems.sort( (i1, i2)=>
    i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0 );
  
  const firstfinish = itemS.length > 0 ? itemS[0].completedAt : false; 
    
  const gapSale2FFin = firstfinish ? moment(firstfinish).workingDiff(bSalesStart, 'days') : 0;
  return gapSale2FFin;
}

function toCompDiff(bSalesStart, bComplete) {
  const gapSale2Complete = moment(bComplete).workingDiff(bSalesStart, 'days');
  return gapSale2Complete;
}
  
function getWidgetDur(widget, accessKey) {
  
  const turnStats = widget.turnStats || null;
  const statime = turnStats ? turnStats.updatedAt : null;
  const stale = !statime ? true :
            moment.duration(moment().diff(moment(statime))).as('hours') > Config.freche;
  if(stale) {
    syncLocale(accessKey);
   
    const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
  
    let qtyAvg = [];
    let relAvg = [];
    let stAvg = [];
    let ffinAvg = [];
    let compAvg = [];
      
    const compX = XBatchDB.find({
      widgetId: widget._id, 
      completed: true,
      createdAt: { 
        $gte: new Date(cutoff)
      },
    },{fields:{
      'batch':1,'salesStart':1,'completedAt':1,
      'quantity':1,'tide':1,'releases':1}}
    ).fetch();
    
    for( let x of compX ) {
      const srs = XSeriesDB.findOne(
        {batch: x.batch},
        {fields:{'items.completed':1,'items.completedAt':1}}
      );
      const items = srs ? srs.items : [];
      qtyAvg.push( x.quantity );
      
      relAvg.push( toRelDiff(x.salesStart, x.releases) );
      stAvg.push( toStrtDiff(x.salesStart, x.tide) );
      ffinAvg.push( toFFinDiff(x.salesStart, items) );
      compAvg.push( toCompDiff(x.salesStart, x.completedAt) );
    }
  
    const avgWorkDays = {
      qtyAvg: avgOfArray( qtyAvg, true ),
      relAvg: avgOfArray( relAvg, true ),
      stAvg: avgOfArray( stAvg, true ),
      ffinAvg: avgOfArray( ffinAvg ),
      compAvg: avgOfArray( compAvg )
    };
    
    WidgetDB.update({_id: widget._id}, {
      $set : {
        turnStats: {
          stats: avgWorkDays,
          updatedAt: new Date(),
        }
      }});
      
    return avgWorkDays;
  }else{
    return turnStats.stats;
  }
}

function splitTideTime( items, tide ) {
  const etide = tide.filter( t => t.stopTime !== false);
  
  const fitems = items.filter( i => i.completed );
  const itemS = fitems.sort( (i1, i2)=>
    i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0 );
  
  const durrs = Array.from(etide, x => 
                  moment.duration(moment(x.stopTime).diff(x.startTime)).asMinutes());
  const total = durrs.length > 0 ? durrs.reduce((x,y)=> x + y) : 0;

  return {
    itemS: itemS,
    total: total,
    tide: etide
  };
}

function splitItemTime(itemS, total, tide, perBaseTen ) {
  
  if(itemS.length > 0) {
    const itemCut = Math.floor( ( itemS.length / 100 ) * perBaseTen );
    const cutItem = itemS[itemCut];
    const cutMmnt = moment(cutItem.completedAt);
    
    let iTime = 0;
  
    for( let tt of tide ) {
      if( cutMmnt.isBetween(tt.startTime, tt.stopTime ) ) {
        iTime += ( Math.abs( moment.duration(cutMmnt.diff(tt.startTime)).asMinutes() ) );  
      }else if( cutMmnt.isAfter(tt.stopTime) ) {
        iTime += ( Math.abs( moment.duration(moment(tt.stopTime).diff(tt.startTime)).asMinutes() ) );
      }
    }
    
    const ipercent = percentOf(total, iTime);
    
    return ipercent;
  }else{
    return 0;
  }
}



Meteor.methods({
  
  oneWidgetTurnAround(wID, privateKey) {
    const accessKey = privateKey || Meteor.user().orgKey;
    
    const widget = WidgetDB.findOne({ _id: wID },{fields:{'turnStats':1}});
    
    const timeArr = getWidgetDur(widget, accessKey);
    
    return timeArr;
  },
  
  estBatchTurnAround(bID, wID) {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    syncLocale(accessKey);
    
    const now = moment().tz(Config.clientTZ);
    
    const batch = XBatchDB.findOne({ _id: bID },{fields:{'salesStart':1}});
    const salesMnt = moment(batch.salesStart).tz(Config.clientTZ);
    
    const widget = WidgetDB.findOne({ _id: wID },{fields:{'turnStats':1}});
    const turnStats = widget.turnStats || null;
    
    if(turnStats) {
      const trn = turnStats.stats;
      
      const rel = Math.round( trn.relAvg );
      const relEst = salesMnt.clone().addWorkingTime(rel, 'days');
      const relDif = relEst.workingDiff(now, 'days', true);
      
      const wrk = Math.round( trn.stAvg );
      const wrkEst = salesMnt.clone().addWorkingTime(wrk, 'days');
      const wrkDif = wrkEst.workingDiff(now, 'days', true);
      
      const ffinAvg = trn.ffinAvg;
      const fin = ffinAvg ? Math.round( ffinAvg ) : 0;
      const finEst = salesMnt.clone().addWorkingTime(fin, 'days');
      const finDif = finEst.workingDiff(now, 'days', true);
      
      const cmp = Math.round( trn.compAvg );
      const cmpEst = salesMnt.clone().addWorkingTime(cmp, 'days');
      const cmpDif = cmpEst.workingDiff(now, 'days', true);
      
      return [ 
        relEst.format(), relDif,
        wrkEst.format(), wrkDif,
        finEst.format(), finDif,
        cmpEst.format(), cmpDif,
        trn.qtyAvg
      ];
    }else{
      return 'na';
    }
    
  },
  
  getAvgTimeShare() {
    this.unblock();
    
    let onePerArr = [];
    let tenPerArr = [];
    let twtyfvPerArr = [];
    let fftyPerArr = [];
    let svtyfvPerArr = [];
    let ntyPerArr = [];
    
    const xid = noIg();
    const compB = XBatchDB.find({live: false, groupId: { $ne: xid }});
    
    for( let b of compB ) {
      const srs = XSeriesDB.findOne({batch: b.batch});
      const items = srs ? srs.items : [];
      const tide = b.tide ? b.tide : [];
      
      const tSplit = splitTideTime( items, tide );
      
      if(tSplit) {
        onePerArr.push( splitItemTime(tSplit.itemS, tSplit.total, tSplit.tide, 1) );
        tenPerArr.push( splitItemTime(tSplit.itemS, tSplit.total, tSplit.tide, 10) );
        twtyfvPerArr.push( splitItemTime(tSplit.itemS, tSplit.total, tSplit.tide, 25) );
        fftyPerArr.push( splitItemTime(tSplit.itemS, tSplit.total, tSplit.tide, 50) );
        svtyfvPerArr.push( splitItemTime(tSplit.itemS, tSplit.total, tSplit.tide, 75) );
        ntyPerArr.push( splitItemTime(tSplit.itemS, tSplit.total, tSplit.tide, 90) );
      }
    }
  
    return [
      avgOfArray( onePerArr ),
      avgOfArray( tenPerArr ),
      avgOfArray( twtyfvPerArr ),
      avgOfArray( fftyPerArr ),
      avgOfArray( svtyfvPerArr ),
      avgOfArray( ntyPerArr )
    ];
  }

});