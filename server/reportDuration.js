import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { avgOfArray, percentOf } from '/server/calcOps';
import Config from '/server/hardConfig.js';
import { noIg } from './utility';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});


function toRelDiff(bSalesStart, bReleases) {
  
  const floorRelease = bReleases.find( x => x.type === 'floorRelease');
  const flrRelTime = floorRelease && floorRelease.time;
  
  const gapSale2Rel = !flrRelTime ? null :
    moment(flrRelTime).workingDiff(bSalesStart, 'days');

  return gapSale2Rel;
}

function toStrtDiff(bSalesStart, bTide) {

  const tideBegin = bTide && bTide.length > 0 ? bTide[0] : null;
  const beginTime = tideBegin ? tideBegin.startTime : null;
  
  const gapSale2Start = !beginTime ? null :
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
  
function getWidgetDur(widget) {
  
  const turnStats = widget.turnStats || null;
  const statime = turnStats ? turnStats.updatedAt : null;
  const stale = !statime ? true :
            moment.duration(moment().diff(moment(statime))).as('hours') > 12;
  if(stale) {
      
    let relAvg = [];
    let stAvg = [];
    let ffinAvg = [];
    let compAvg = [];
      
    const compX = XBatchDB.find({widgetId: widget._id, completed: true}).fetch();
    for( let x of compX ) {
      const srs = XSeriesDB.findOne({_id: x._id});
      const items = srs ? srs.items : [];
      
      relAvg.push( toRelDiff(x.salesStart, x.releases) );
      stAvg.push( toStrtDiff(x.salesStart, x.tide) );
      ffinAvg.push( toFFinDiff(x.salesStart, items) );
      compAvg.push( toCompDiff(x.salesStart, x.completedAt) );
    }
  
    const avgWorkDays = {
      relAvg: avgOfArray( relAvg ),
      stAvg: avgOfArray( stAvg ),
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
  
  const firstComplete = itemS.length > 0 ? itemS[0] : false;
  
  if(firstComplete && tide && tide.length > 0) {
    const ftime = moment(firstComplete.completedAt);
    
    let leadTime = 0;
    let tailTime = 0;
    let tailTide = [];
    
    for( let en of etide ) {
      if( ftime.isBetween(en.startTime, en.stopTime ) ) {
        leadTime += ( Math.abs( moment.duration(ftime.diff(en.startTime)).asMinutes() ) ); 
        tailTime += ( Math.abs( moment.duration(ftime.diff(en.stopTime)).asMinutes() ) );
        tailTide.push( en ); 
      }else if( ftime.isAfter(en.stopTime) ) {
        leadTime += ( Math.abs( moment.duration(moment(en.stopTime).diff(en.startTime)).asMinutes() ) );
      }else{
        tailTime += ( Math.abs( moment.duration(moment(en.stopTime).diff(en.startTime)).asMinutes() ) );
        tailTide.push( en ); 
      }
    }
    
    return {
      itemS: itemS,
      leadTime: leadTime,
      tailTime: tailTime,
      tailTide: tailTide
    };
  }else{
    return false;
  }
}

function splitItemTime(itemS, tailTime, tailTide, perBaseTen ) {
  
  const itemCut = Math.floor( ( itemS.length / 100 ) * perBaseTen );
  const cutItem = itemS[itemCut];
  const cutMmnt = moment(cutItem.completedAt);
  
  let iTime = 0;

  for( let tt of tailTide ) {
    if( cutMmnt.isBetween(tt.startTime, tt.stopTime ) ) {
      iTime += ( Math.abs( moment.duration(cutMmnt.diff(tt.startTime)).asMinutes() ) );  
    }else if( cutMmnt.isAfter(tt.stopTime) ) {
      iTime += ( Math.abs( moment.duration(moment(tt.stopTime).diff(tt.startTime)).asMinutes() ) );
    }
  }
  
  const ipercent = percentOf(tailTime, iTime);
  
  return ipercent;
}

Meteor.methods({
  
  oneWidgetTurnAround(wID) {
    
    const widget = WidgetDB.findOne({ _id: wID });
    
    const timeArr = getWidgetDur(widget);
    
    return timeArr;
  },
  
  estBatchTurnAround(bID, wID) {
    this.unblock();
    
    const now = moment().tz(Config.clientTZ);
    
    const batch = XBatchDB.findOne({ _id: bID },{fields:{'salesStart':1}});
    const salesMnt = moment(batch.salesStart).tz(Config.clientTZ);
    
    const widget = WidgetDB.findOne({ _id: wID },{fields:{'turnStats':1}});
    const turnStats = widget.turnStats || null;
    
    if(turnStats) {
      const trn = turnStats.stats;
      
      const rel = Math.round( trn.relAvg );
      const relEst = salesMnt.clone().addWorkingTime(rel, 'days');
      const relDif = relEst.workingDiff(now, 'days');
      
      const wrk = Math.round( trn.stAvg );
      const wrkEst = salesMnt.clone().addWorkingTime(wrk, 'days');
      const wrkDif = wrkEst.workingDiff(now, 'days');
      
      const ffinAvg = trn.ffinAvg;
      const fin = ffinAvg ? Math.round( ffinAvg ) : 0;
      const finEst = salesMnt.clone().addWorkingTime(fin, 'days');
      const finDif = finEst.workingDiff(now, 'days');
      
      const cmp = Math.round( trn.compAvg );
      const cmpEst = salesMnt.clone().addWorkingTime(cmp, 'days');
      const cmpDif = cmpEst.workingDiff(now, 'days');
      
      return [ 
        relEst.format(), relDif,
        wrkEst.format(), wrkDif,
        finEst.format(), finDif,
        cmpEst.format(), cmpDif
      ];
    }else{
      return 'na';
    }
    
  },
  
  updateAvgTimeShare(accessKey) {
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
        onePerArr.push( splitItemTime(tSplit.itemS, tSplit.tailTime, tSplit.tailTide, 1) );
        tenPerArr.push( splitItemTime(tSplit.itemS, tSplit.tailTime, tSplit.tailTide, 10) );
        twtyfvPerArr.push( splitItemTime(tSplit.itemS, tSplit.tailTime, tSplit.tailTide, 25) );
        fftyPerArr.push( splitItemTime(tSplit.itemS, tSplit.tailTime, tSplit.tailTide, 50) );
        svtyfvPerArr.push( splitItemTime(tSplit.itemS, tSplit.tailTime, tSplit.tailTide, 75) );
        ntyPerArr.push( splitItemTime(tSplit.itemS, tSplit.tailTime, tSplit.tailTide, 90) );
      }
    }
    
    /*
      Number( Math.log(Number(0.95)) / Math.log(Number(0.75)) ).toFixed(2)
      "0.18"
      Number( Math.pow(0.75, 0.18) ).toFixed(2)
      "0.95"
      
      ///////////////////
      
      Number( Math.log(Number(0.80)) / Math.log(Number(0.01)) ).toFixed(2)
      "0.05"
      Number( Math.log(Number(0.84)) / Math.log(Number(0.10)) ).toFixed(2)
      "0.08"
      Number( Math.log(Number(0.92)) / Math.log(Number(0.50)) ).toFixed(2)
      "0.12"
      Number( Math.log(Number(0.95)) / Math.log(Number(0.75)) ).toFixed(2)
      "0.18"
      Number( Math.log(Number(0.97)) / Math.log(Number(0.90)) ).toFixed(2)
      "0.29"
    */
    
    const dataAvgs = [
      avgOfArray( onePerArr ),
      avgOfArray( tenPerArr ),
      avgOfArray( twtyfvPerArr ),
      avgOfArray( fftyPerArr ),
      avgOfArray( svtyfvPerArr ),
      avgOfArray( ntyPerArr )
    ];
    
    CacheDB.upsert({dataName: 'avgTimeShare'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'avgTimeShare',
        dataNum: dataAvgs,
        dataTrend: 'flat'
    }});
  },

});