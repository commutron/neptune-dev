import moment from 'moment';
import 'moment-business-time';

// import { checkTimeBudget } from './tideMethods.js';
// import { whatIsBatchX } from './searchOps.js';
import { avgOfArray } from '/server/calcOps';
import Config from '/server/hardConfig.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

function splitItmTm( items, tide ) {
  const fitems = items.filter( i => i.completed );
  const etide = tide.filter( t => t.stopTime !== false);
  if(fitems.length > 0 && tide && tide.length > 0) {
    const itemS = fitems.sort( (i1, i2)=> {
      return i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0; });
      
    const itemMidex = Math.floor( itemS.length / 2 );
    const midItem = itemS[itemMidex];
    const midMmnt = moment(midItem.completedAt);
    
    let lTide = 0;
    let rTide = 0;
    
    for( let en of etide ) {
      if( midMmnt.isBetween(en.startTime, en.stopTime ) ) {
        lTide += ( Math.abs( moment.duration(midMmnt.diff(en.startTime)).asMinutes() ) );  
        rTide += ( Math.abs( moment.duration(midMmnt.diff(en.stopTime)).asMinutes() ) );  
        
      }else if( midMmnt.isBefore(en.startTime) ) {
        lTide += ( Math.abs( moment.duration(moment(en.stopTime).diff(en.startTime)).asMinutes() ) );
      }else{
        rTide += ( Math.abs( moment.duration(moment(en.stopTime).diff(en.startTime)).asMinutes() ) );
      }
    }
    return [ lTide, rTide ];
  }else{
    return [ 0, 0 ];
  }
}
  
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
  
function getWidgetDur(accessKey, widget) {
  
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

  const testTheTime = [
    widget.widget,
    avgOfArray( relAvg ),
    avgOfArray( stAvg ),
    avgOfArray( endAvg ),
    avgOfArray( compAvg )
  ];
  return testTheTime;
}

function getWidgetPace(accessKey, widget) {
  
  let btchs = [];
  
  const compB = XBatchDB.find({widgetId: widget._id, live: false});
  for( let b of compB ) {
    const srs = XSeriesDB.findOne({batch: b.batch});
    const items = srs ? srs.items : [];
    const tide = b.tide ? b.tide : [];
    
    const spliTime = splitItmTm(items, tide);
    btchs.push( [ b.batch, spliTime[0], spliTime[1] ] );
  }

  const testTheTime = [
    widget.widget, btchs
  ];
  return testTheTime;
}


function collectAllGroupDur(accessKey, wFuncLoop) {
  return new Promise(function(resolve) {
  
    const groups = GroupDB.find({ orgKey: accessKey }).fetch();
    
    let gdur = [];
    for( let group of groups ) {
      const widgets = WidgetDB.find({
        orgKey: accessKey,
        groupId: group._id
      }).fetch();
    
      let wSets = [];
      for( let widget of widgets ) {
        const timeArr = wFuncLoop(accessKey, widget);
        wSets.push(timeArr);
      }
      gdur.push({
        group: group.alias,
        durrArray: wSets
      });
    }
    resolve(gdur);
  });
}


Meteor.methods({
  
  reportOnTurnAround() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    
    async function collect() {
      try {
        result = await collectAllGroupDur(accessKey, getWidgetDur);
        const resultString = JSON.stringify(result);
        return resultString;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return collect();
  },
  
  oneWidgetTurnAround(wID) {
    const accessKey = Meteor.user().orgKey;
    
    const widget = WidgetDB.find({ orgKey: accessKey, widgetId: wID }).fetch();
    
    const timeArr = getWidgetDur(accessKey, widget);
    
    return timeArr;
  },
  
  reportOnCyclePace() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    
    async function collect() {
      try {
        result = await collectAllGroupDur(accessKey, getWidgetPace);
        const resultString = JSON.stringify(result);
        return resultString;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return collect();
  },


});