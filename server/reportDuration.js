import moment from 'moment';
import 'moment-business-time';

import { avgOfArray, percentOf, diffTrend } from '/server/calcOps';
import Config from '/server/hardConfig.js';

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

function toEndDiff(bSalesStart, bSalesEnd) {
  const gapSale2End = moment(bSalesEnd).workingDiff(bSalesStart, 'days');
  return gapSale2End;
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
    let endAvg = [];
    let compAvg = [];
      
    const compX = XBatchDB.find({widgetId: widget._id, completed: true}).fetch();
    for( let x of compX ) {
      relAvg.push( toRelDiff(x.salesStart, x.releases) );
      stAvg.push( toStrtDiff(x.salesStart, x.tide) );
      endAvg.push( toEndDiff(x.salesStart, x.salesEnd) );
      compAvg.push( toCompDiff(x.salesStart, x.completedAt) );
    }
  
    const avgWorkDays = {
      relAvg: avgOfArray( relAvg ),
      stAvg: avgOfArray( stAvg ),
      endAvg: avgOfArray( endAvg ),
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


function splitItmTm( items, tide ) {
  const fitems = items.filter( i => i.completed );
  const etide = tide.filter( t => t.stopTime !== false);
  
  const durrs = Array.from(etide, x => 
                  moment.duration(moment(x.stopTime).diff(x.startTime)).asMinutes());
  const total = durrs.length > 0 ? durrs.reduce((x,y)=> x + y) : 0;
    
  if(fitems.length > 0 && tide && tide.length > 0) {
    const itemS = fitems.sort( (i1, i2)=>
      i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0 );
    
    const itemMidex = Math.floor( itemS.length / 2 );
    const midItem = itemS[itemMidex];
    const midMmnt = moment(midItem.completedAt);
    
    let lTide = 0;

    for( let en of etide ) {
      if( midMmnt.isBetween(en.startTime, en.stopTime ) ) {
        lTide += ( Math.abs( moment.duration(midMmnt.diff(en.startTime)).asMinutes() ) );  
      }else if( midMmnt.isAfter(en.stopTime) ) {
        lTide += ( Math.abs( moment.duration(moment(en.stopTime).diff(en.startTime)).asMinutes() ) );
      }
    }
    
    const lpercent = percentOf(total, lTide);
    
    return lpercent;
  }else{
    return 0;
  }
}


Meteor.methods({
  
  oneWidgetTurnAround(wID) {
    const accessKey = Meteor.user().orgKey;
    
    const widget = WidgetDB.findOne({ _id: wID, orgKey: accessKey });
    
    const timeArr = getWidgetDur(widget);
    
    return timeArr;
  },
  
  updateAvgTimeShare(accessKey) {
    this.unblock();
  
    let percentsArr = [];
    
    const compB = XBatchDB.find({live: false});
    for( let b of compB ) {
      const srs = XSeriesDB.findOne({batch: b.batch});
      const items = srs ? srs.items : [];
      const tide = b.tide ? b.tide : [];
      
      const firstfiftyTime = splitItmTm(items, tide);
      percentsArr.push( firstfiftyTime );
    }
    
    const firstfiftyAvg = avgOfArray( percentsArr );
    
    const lastavg = CacheDB.findOne({dataName: 'avgTimeShare'});
    const runningavg = lastavg ? lastavg.dataNum : 0;
      
    const trend = diffTrend(firstfiftyAvg, runningavg);
      
    CacheDB.upsert({dataName: 'avgTimeShare'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'avgTimeShare',
        dataNum: Number(firstfiftyAvg),
        dataTrend: trend
    }});
  },


});