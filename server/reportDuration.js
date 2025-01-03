import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { avgOfArray, percentOf } from '/server/calcOps';
import { addTideDuration } from './tideGlobalMethods.js';
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
  },
  
  generateNCTimeMonthly(accessKey) {
    const orgKey = accessKey || Meteor.user().orgKey;
    
    const now = moment().tz(Config.clientTZ);
    
    const start = now.clone().subtract(1, 'month').startOf('month');
    const endin = start.clone().endOf('month');
    
    const reExp = RegExp(/(re-)|(Re-)|(rework)|(Rework)/);
    
    let ncTimes = [];
    let branches = new Set();
    let subtasks = new Set();
    
    XBatchDB.find({
      orgKey: orgKey,
      $or: [ { lock: { $ne: true } },
             { updatedAt: { $gte: new Date(start) } }
           ],
      tide: { $exists: true }
    },{fields:{'tide':1}
    }).forEach( bx => {
      const subset = bx.tide.filter( x =>
        x.subtask && x.subtask.match(reExp) &&
        moment(x.startTime).isBetween(start, endin)
      );
      
      for(let s of subset) {
        branches.add(s.task);
        subtasks.add(s.subtask);
        
        ncTimes.push({
          br: s.task,
          sb: s.subtask,
          dr: addTideDuration(s) 
        });
      }
    });
    
    let sbBreakdown = [];
    for(let sb of subtasks) {
      const totalS = ncTimes.filter( f => f.sb === sb )
                      .reduce( (arr, x)=> arr + x.dr, 0);
    
      if(totalS > 0) { sbBreakdown.push([ sb, totalS ]) }
    }
    
    let brBreakdown = [];
    for(let br of branches) {
      const brTimes = ncTimes.filter( f => f.br === br );
      
      let brsbBreakdown = [];
      for(let sb of subtasks) {
        const totalS = brTimes.filter( f => f.sb === sb )
                        .reduce( (arr, x)=> arr + x.dr, 0);
      
        if(totalS > 0) { brsbBreakdown.push([ sb, totalS ]) }
      }
    
      brBreakdown.push([ br, brsbBreakdown ]);
    }
    
    const newreport = {
      year: start.year(),
      month: start.month(),
      report: [ sbBreakdown, brBreakdown, [] ]
    };
    
    CacheDB.update({orgKey: orgKey, dataName: 'nctimereports'}, {
      $push : {
        dataSet: newreport,
    }});
    
    return true;
  },
  
  /*/ ON TIME FUNCTION \\\
  generateNCTimeBacklog() {
    const accessKey = Meteor.user().orgKey;
    
    const reExp = RegExp(/(re-)|(Re-)|(rework)|(Rework)/);
    
    const now = moment().tz(Config.clientTZ);
    const jantwentytwo = now.clone().startOf('year');
    
    function buildMonthlyReport(monthStart, monthEnd) {
    
      let ncTimes = [];
      let branches = new Set();
      let subtasks = new Set();
      
      let sbBreakdown = [];
      let brBreakdown = [];
      let legacyBreakdown = [];
      
      XBatchDB.find({
        orgKey: accessKey,
        tide: { $exists: true }
      },{fields:{'tide':1}
      }).forEach( bx => {
        const subset = bx.tide.filter( x =>
          x.subtask && x.subtask.match(reExp) &&
          moment(x.startTime).isBetween(monthStart, monthEnd)
        );
        
        for(let s of subset) {
          branches.add(s.task);
          subtasks.add(s.subtask);
          
          ncTimes.push({
            br: s.task,
            sb: s.subtask,
            dr: addTideDuration(s) 
          });
        }
      });
      
      if(ncTimes.length > 0) {
        
        for(let sb of subtasks) {
          const totalS = ncTimes.filter( f => f.sb === sb )
                          .reduce( (arr, x)=> arr + x.dr, 0);
        
          if(totalS > 0) { sbBreakdown.push([ sb, totalS ]) }
        }
      
        for(let br of branches) {
          const brTimes = ncTimes.filter( f => f.br === br );
          
          let brsbBreakdown = [];
          for(let sb of subtasks) {
            const totalS = brTimes.filter( f => f.sb === sb )
                            .reduce( (arr, x)=> arr + x.dr, 0);
          
            if(totalS > 0) { brsbBreakdown.push([ sb, totalS ]) }
          }
        
          brBreakdown.push([ br, brsbBreakdown ]);
        }
        
      }else{
        
        let legacywhere = new Set();
        let fixEvents = [];
        let chkEvents = [];
        
        XSeriesDB.find({
          orgKey: accessKey,
          $where: "this.nonCon.length > 0"
        },{fields:{'nonCon':1}
        }).forEach( srs => {
  
          for(let nc of srs.nonCon) {
            legacywhere.add(nc.where);
            
            if( nc.fix && moment(nc.fix.time).isBetween(monthStart, monthEnd) ) {
              fixEvents.push(nc.where);
            }else if( nc.inspect && moment(nc.inspect.time).isBetween(monthStart, monthEnd) ) {
              chkEvents.push(nc.where);
            }else if( nc.reject && moment(nc.reject.rejectTime).isBetween(monthStart, monthEnd) ) {
              chkEvents.push(nc.where);
            }else{ null }
          }
        });
        
        let fixTotal = 0;
        let chkTotal = 0;
        
        // cyle time imposible as clicks are not that tied 1-to-1 to the repair process
        // So the simplistic option is to addup based on an average time per fix
          
        for(let lgwh of legacywhere) {
          const sec = lgwh === 'surface mount' ? 240 : 120;
          
          const fix = fixEvents.filter( e => e === lgwh).reduce( (arr)=> arr + sec, 0);
          const fmn = Math.ceil( fix / 60 );
          
          const chk = chkEvents.filter( e => e === lgwh).reduce( (arr)=> arr + 180, 0);
          const cmn = Math.ceil( chk / 60 );
          
          if(fix > 0 || chk > 0) { 
            legacyBreakdown.push([ lgwh, [ ['Rework', fmn], ['Re-Inspect', cmn] ] ]);
            fixTotal += fmn;
            chkTotal += cmn;
          }
        }
        
        legacyBreakdown.unshift([ 'All', [ ['Rework', fixTotal], ['Re-Inspect', chkTotal] ] ]);
      }
      
      return [ sbBreakdown, brBreakdown, legacyBreakdown ];
    }
  
    
    let reportdataset = [];
    
    for(let i = 2020; i < 2023; i++) {
      
      for(let j = 0; j < 12; j++) {
        
        const start = jantwentytwo.clone().year(i).month(j);
        const endin = start.clone().endOf('month');
        
        if( i === 2022 && j === 11 ) {
          null;
        }else{
          reportdataset.push({
            year: i,
            month: j,
            report: buildMonthlyReport(start, endin)
          });
        }
      }
    }
    
    CacheDB.upsert({orgKey: accessKey, dataName: 'nctimereports'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'nctimereports',
        dataSet: reportdataset,
    }});
    
    return reportdataset;
  },
  *//////////////\\\\\\\\\\\\\
  
  fetchCachedNcTimeReport(month, year) {
    if( !isNaN(month) && !isNaN(year) ) {
      const cache = CacheDB.findOne({orgKey: Meteor.user().orgKey, dataName: 'nctimereports'});
      
      if( cache ) {
        const report = cache.dataSet.find( r => r.month === month && r.year === year );
        
        if( report ) {
          return report.report;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

});