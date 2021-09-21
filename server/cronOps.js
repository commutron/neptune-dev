// import { SyncedCron } from 'meteor/littledata:synced-cron';
import moment from 'moment';
import 'moment-timezone';

import { deliveryBinary } from '/server/reportCompleted.js';
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
  name: 'Weekly Lock Check',
  schedule: (parser)=> parser.text('at 6:01 am on Sat'),
  job: ()=> goDo('lockingCacheUpdate')
});

SyncedCron.add({
  name: 'Twice Daily Trace Priority',
  schedule: (parser)=> parser.text('at 6:02 am every weekday also at 6:02 pm every weekday'),
  job: ()=> goDo('updateLiveMovement')
});

SyncedCron.add({
  name: 'Weekly Avg Day Time',
  schedule: (parser)=> parser.text('at 6:03 am on Sat'),
  job: ()=> goDo('fetchWeekAvg')
});

SyncedCron.add({
  name: 'Weekly Widget Avgs',
  schedule: (parser)=> parser.text('at 6:04 am on Sat'),
  job: ()=> goDo('updateAllWidgetAvg')
});

SyncedCron.add({
  name: 'Daily Tide Overrun',
  schedule: (parser)=> parser.text('at 6:05 am every weekday'),
  job: ()=> goDo('fetchOverRun')
});

SyncedCron.add({
  name: 'Daily Trend Loops',
  schedule: (parser)=> parser.text('at 6:06 am every weekday'),
  job: ()=> runRanges()
});


SyncedCron.start();
  
function goDo(goFunc) {
  const apps = AppDB.find({},{fields:{'orgKey':1}}).fetch();
  for(let app of apps) {
    const accessKey = app.orgKey;
    Meteor.call(goFunc, accessKey);
  }
}

async function runRanges() {
  try {
    const apps = AppDB.find({},{fields:{'orgKey':1}}).fetch();
    for(let app of apps) {
      await countDoneBatchTarget(app.orgKey);
    }
    return true;
  }catch (error) {
    throw new Meteor.Error(error);
  }
}

const loopBack = (nowLocal, cycles, period)=> {
  let ranges = [];
  for(let l = 0; l < cycles + 1; l++) {
  
    const loop = nowLocal.clone().subtract(l, period).format(); 

    ranges.unshift( loop );
  }
  return ranges;
};

const getRanges = ()=> {
  const nowLocal = moment().tz(Config.clientTZ).startOf('month');
  
  const cutoff = nowLocal.clone().startOf('year').subtract(Config.yrsSpan-1, 'years');
      
  const dur = moment.duration(nowLocal.diff(moment(cutoff)));
  const weekcycles = parseInt( dur.asWeeks(), 10 );
  const monthcycles = parseInt( dur.asMonths(), 10 );
    
  let weekranges = loopBack(nowLocal, weekcycles, 'week');
  const monthranges = loopBack(nowLocal, monthcycles, 'month');
  
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

const runMonthWeeks = (bStats, ranges)=> {
  let mXY = [];
    
  for(let r of ranges) {
    
    const month = bStats.filter( b => moment(b.finish).isSame(r, 'month') );
    
    const weeks = [...new Set( Array.from(month, x => moment(x.finish).week() ) )];
    
    let wXY = [];
    
    for(let w of weeks) {
      let doneOnTime = 0;
      let doneLate = 0;
      let shipOnTime = 0;
      let shipLate = 0;
      let doneUnderQ = 0;
      let doneOverQ = 0;

      const wset = month.filter( b => moment(b.finish).week() === w );
    
      wset.map( (w)=> {
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