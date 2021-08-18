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

const getRanges = (period)=> {
  const nowLocal = moment().tz(Config.clientTZ).startOf(period);
  
  const cutoff = ( d => new Date(d.setDate(d.getDate()-Config.avgSpan)) )(new Date);
      
  const dur = moment.duration(nowLocal.diff(moment(cutoff)));
  const cycles = period == 'week' ?
                  parseInt( dur.asWeeks(), 10 ) :
                 period == 'month' ?
                  parseInt( dur.asMonths(), 10 ) :
                  parseInt( dur.asYears(), 10 );
    
  let ranges = [];
  for(let w = 0; w < cycles; w++) {
  
    const loopBack = nowLocal.clone().subtract(w, period).format(); 

    ranges.unshift( loopBack );
  }
  return ranges;
};

async function countDoneBatchTarget(accessKey, dataName, period) {
  return new Promise(function(resolve) {
    syncLocale(accessKey);
    const xid = noIg();
    const ranges = getRanges(period);
    
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
    
    let xy = [];
    
    for(let r of ranges) {
      let doneOnTime = 0;
      let doneLate = 0;
      let shipOnTime = 0;
      let shipLate = 0;
      let doneUnderQ = 0;
      let doneOverQ = 0;
  
      const raches = batches.filter( b => moment(b.completedAt).isSame(r, period) );
      
      raches.map( (gfx, inx)=> {
          const dst = deliveryBinary(gfx._id, gfx.salesEnd, gfx.completedAt);
          dst[0] === 'late' ? doneLate++ : doneOnTime++;
          dst[1] === 'late' ? shipLate++ : shipOnTime++;
          
          const q = checkTimeBudget(gfx.tide, gfx.quoteTimeBudget, gfx.lockTrunc);
          !q ? null : q < 0 ? doneOverQ++ : doneUnderQ++;
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
  
    CacheDB.upsert({orgKey: accessKey, dataName: dataName}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: dataName,
        dataSet: xy
    }});
    
    resolve(true);
  });
}

async function runRanges() {
  try {
    const apps = AppDB.find({},{fields:{'orgKey':1, 'createdAt':1}}).fetch();
    for(let app of apps) {
      await countDoneBatchTarget(app.orgKey, 'doneBatchLiteMonths', 'month');
      await countDoneBatchTarget(app.orgKey, 'doneBatchLiteWeeks', 'week');
    }
    return true;
  }catch (error) {
    throw new Meteor.Error(error);
  }
}