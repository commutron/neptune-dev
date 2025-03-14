import { SyncedCron } from 'meteor/littledata:synced-cron';
import moment from 'moment';
import 'moment-timezone';

import { deliveryBinary, deliveryRatio } from '/server/reportCompleted.js';
import { checkTimeBudget } from '/server/tideGlobalMethods';
import { syncLocale, noIg } from '/server/utility';

import Config from '/server/hardConfig.js';


SyncedCron.config({
  log: false,// Log job run details to console
  
  logger: null,// Defaults to Meteor's logging package
  
  collectionName: 'cronHistory', // Default

  utc: true,
});


SyncedCron.add({
  name: 'Daily PIN Change',
  schedule: (parser)=> parser.text('at 6:00 am'),
  job: ()=> goDo('randomizePIN')
});

SyncedCron.add({
  name: 'Delete 90+ Day Old Messages',
  schedule: (parser)=> parser.text('at 6:01 am'),
  job: ()=> goDo('removeOldDMLog')
});

SyncedCron.add({
  name: 'Daily Maintain Events',
  schedule: (parser)=> parser.text('at 6:02 am'),
  job: ()=> goDo('pmRobot')
});

SyncedCron.add({
  name: 'Twice Daily Trace Priority',
  schedule: (parser)=> parser.text('at 6:05 am every weekday also at 6:00 pm every weekday'),
  job: ()=> goDo('updateLiveMovement')
});

SyncedCron.add({
  name: 'Daily Tide Overrun',
  schedule: (parser)=> parser.text('at 6:07 am every weekday'),
  job: ()=> goDo('fetchOverRun')
});

SyncedCron.add({
  name: 'Daily Trend Loops',
  schedule: (parser)=> parser.text('at 6:10 am every weekday'),
  job: ()=> runRanges()
});

SyncedCron.add({
  name: 'Weekly Lock Check',
  schedule: (parser)=> parser.text('at 6:15 am on Sat'),
  job: ()=> goDo('lockingCacheUpdate')
});

SyncedCron.add({
  name: 'Weekly Avg Day Time',
  schedule: (parser)=> parser.text('at 6:20 am on Sat'),
  job: ()=> goDo('fetchWeekAvg')
});

SyncedCron.add({
  name: 'Weekly Widget Avgs',
  schedule: (parser)=> parser.text('at 6:25 am on Sat'),
  job: ()=> goDo('updateAllWidgetAvg')
});

SyncedCron.add({
  name: 'NonCon Time Report',
  schedule: (parser)=> parser.text('on the first day of the month at 6:30 am'),
  job: ()=> goDo('generateNCTimeMonthly')
});

SyncedCron.add({
  name: 'Dev Monitor Status',
  schedule: (parser)=> parser.text('at 11:00 pm on Fri'),
  job: ()=> goDo('handleDevMonitorEmail')
});


SyncedCron.start();
  
function goDo(goFunc) {
  Meteor.defer( ()=>{
    const apps = AppDB.find({},{fields:{'orgKey':1}}).fetch();
    for(let app of apps) {
      const accessKey = app.orgKey;
      Meteor.call(goFunc, accessKey);
      console.log('cron called: ' + goFunc);
    }
  });
}

async function runRanges() {
  try {
    const apps = AppDB.find({},{fields:{'orgKey':1}}).fetch();
    for(let app of apps) {
      await countDoneBatchTarget(app.orgKey);
      await countDoneItemsTarget(app.orgKey);
    }
    return true;
  }catch (error) {
    throw new Meteor.Error(error);
  }
}

const loopBack = (nowLocal, cycles, period)=> {
  let ranges = [];
  for(let l = 0; l < cycles; l++) {
  
    const loop = nowLocal.clone().subtract(l, period).format(); 

    ranges.unshift( loop );
  }
  return ranges;
};

const getRanges = ()=> {
  const nowLocal = moment().tz(Config.clientTZ);
  const weklocal = nowLocal.clone().startOf('week');
  const mthlocal = nowLocal.clone().startOf('month');
  
  const cutoff = nowLocal.clone().startOf('year').subtract(Config.yrsSpan-1, 'years');
      
  const dur = moment.duration(nowLocal.diff(moment(cutoff)));
  const weekcycles = Math.ceil(dur.asWeeks());
  const monthcycles = Math.ceil(dur.asMonths());
    
  const weekranges = loopBack(weklocal, weekcycles, 'week');
  const monthranges = loopBack(mthlocal, monthcycles, 'month');
  
  return [ weekranges, monthranges ];
};

const addRanges = (bStats, ranges, period)=> {
  let xy = [];
    
  for(let r of ranges) {
    let doneOnTime = 0;
    let doneLate = 0;
    let shipOnTime = 0;
    let shipLate = 0;
    let doneUnderQ = 0;
    let doneOverQ = 0;

    const rset = bStats.filter( b => moment(b.finish).isSame(r, period) );
    
    rset.map( (b)=> {
      b.fillOn ? doneOnTime++ : doneLate++;
      b.shipOn ? shipOnTime++ : shipLate++;
      b.qbgtOn ? doneUnderQ++ : doneOverQ++;
    });
  
    xy.push({ 
      x: r,
      y: [ 
        doneOnTime,
        doneLate,
        shipOnTime,
        shipLate,
        doneUnderQ,
        doneOverQ
      ]
    });
  }  
  
  return xy;
};

const monthFilter = (bchs, month, due)=> bchs.filter( b => moment(b[due]).isSame(month, 'month') );
const weekFilter = (month, week, due)=> month.filter( b => moment(b[due]).week() === week );

const weeksGenerator = (range, nowYear, nowWeek)=> {
  const thisYr = moment(range).year() === nowYear;
  const rend = moment(range).endOf('month');

  let weekdays = new Set();
  for(let d = new Date(range); d <= new Date(rend.format()); d.setDate(d.getDate() + 1)) {
    weekdays.add( moment(d).week() );
  }
  return !thisYr ? [...weekdays] : [...weekdays].filter( f => f <= nowWeek );
};

const runMonthWeeks = (bStats, ranges)=> {
  let mXY = [];
  
  const now = moment();
  const nYr = now.year();
  const nWk = now.week();
  
  for(let r of ranges) {
    const month = monthFilter(bStats, r, 'finish');
    const weeks = weeksGenerator(r, nYr, nWk);
    
    let wXY = [];
    
    for(let w of weeks) {
      let doneOnTime = 0;
      let doneLate = 0;
      let shipOnTime = 0;
      let shipLate = 0;
      let doneUnderQ = 0;
      let doneOverQ = 0;
      
      const weekset = weekFilter(month, w, 'finish');
    
      weekset.map( (w)=> {
        w.fillOn ? doneOnTime++ : doneLate++;
        w.shipOn ? shipOnTime++ : shipLate++;
        w.qbgtOn ? doneUnderQ++ : doneOverQ++;
      });
  
      wXY.push({
        x: w,
        y: [ 
          doneOnTime,
          doneLate,
          shipOnTime,
          shipLate,
          doneUnderQ,
          doneOverQ
        ]
      });
    }
    
    mXY.push({
      month: r,
      weeks: wXY
    });
  }
    
  return mXY;
};

async function countDoneBatchTarget(accessKey) {
  return new Promise(function(resolve) {
    syncLocale(accessKey);
    const xid = noIg();
    
    const batches = XBatchDB.find({
      orgKey: accessKey, 
      groupId: { $ne: xid },
      completed: true
    },{fields:{
      'batch': 1,
      'salesEnd': 1,
      'completedAt': 1,
      'tide': 1,
      'quoteTimeBudget': 1,
      'lockTrunc': 1
    }}).fetch();
    
    let bStats = [];
    
    for(let gfx of batches) {
      const dst = deliveryBinary(gfx._id, gfx.salesEnd, gfx.completedAt);
      const fillOn = dst[0] === 'late' ? false : true;
      const shipOn = dst[1] === 'late' ? false : true;
      
      const q = checkTimeBudget(gfx.tide, gfx.quoteTimeBudget, gfx.lockTrunc);
      const qbgtOn = !q ? null : q < 0 ? false : true;
      
      bStats.push({
        fillOn: fillOn,
        shipOn: shipOn,
        qbgtOn: qbgtOn,
        finish: gfx.completedAt
      });
    }

    const stdRanges = getRanges();
    
    let weekXY = addRanges(bStats, stdRanges[0], 'week');
    let monthXY = addRanges(bStats, stdRanges[1], 'month');
    
    let monthweekXY = runMonthWeeks(bStats, stdRanges[1]);
    
    CacheDB.upsert({orgKey: accessKey, dataName: 'doneBatchLiteWeeks'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'doneBatchLiteWeeks',
        dataSet: weekXY
    }});
    
    CacheDB.upsert({orgKey: accessKey, dataName: 'doneBatchLiteMonths'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'doneBatchLiteMonths',
        dataSet: monthXY
    }});
    
    CacheDB.upsert({orgKey: accessKey, dataName: 'doneBatchLiteMonthsWeeks'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'doneBatchLiteMonthsWeeks',
        dataSet: monthweekXY
    }});
  
    resolve(true);
  });
}

const runMonthWeeksItems = (bStats, ranges)=> {
  let mXY = [];
  
  const now = moment();
  const nYr = now.year();
  const nWk = now.week();
  
  for(let r of ranges) {
    const month = monthFilter(bStats, r, 'shipDue');
    const weeks = weeksGenerator(r, nYr, nWk);
    
    let wXY = [];
    
    for(let w of weeks) {
      let totalItems = 0;
      let onTimeItems = 0;
      
      const weekset = weekFilter(month, w, 'shipDue');
    
      weekset.map( (w)=> {
        totalItems += w.totalItm;
        onTimeItems += w.ontimeItm;
      });
  
      wXY.push({
        x: w,
        y: [
          totalItems,
          onTimeItems
        ]
      });
    }
    
    mXY.push({
      month: r,
      weeks: wXY
    });
  }
    
  return mXY;
};

async function countDoneItemsTarget(accessKey) {
  return new Promise(function(resolve) {
    syncLocale(accessKey);
    const xid = noIg();
    
    const batches = XBatchDB.find({
      orgKey: accessKey, 
      groupId: { $ne: xid }
    },{fields:{
      'batch': 1,
      'salesEnd': 1,
      'completedAt': 1,
      'finShipDue': 1
    }}).fetch();
    
    let bStats = [];
    
    for(let gfx of batches) {
      const calcDue = (sEnd)=> {
        const endDay = moment.tz(sEnd, Config.clientTZ);
        return endDay.isShipDay() ?
                endDay.clone().endOf('day').lastShippingTime().format() :
                endDay.clone().lastShippingTime().format();
      };
      const shipDue = gfx.finShipDue || calcDue(gfx.salesEnd);
      
      const dst = deliveryRatio(gfx.batch, shipDue, gfx.completedAt);
      
      bStats.push({
        shipDue: shipDue,
        totalItm: dst[0],
        ontimeItm: dst[1]
      });
    }
    // console.log(bStats.length);
    const stdRanges = getRanges();
    let monthweekXY = runMonthWeeksItems(bStats, stdRanges[1]);
    
    CacheDB.upsert({orgKey: accessKey, dataName: 'doneItemsLiteMonthsWeeks'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'doneItemsLiteMonthsWeeks',
        dataSet: monthweekXY
    }});
  
    resolve(true);
  });
}

Meteor.methods({
  
  forceRunTrendLoops() {
    this.unblock();
    runRanges();
    return true;
  }
  
})