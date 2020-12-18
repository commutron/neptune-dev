// import { SyncedCron } from 'meteor/littledata:synced-cron';

import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { deliveryBinary } from '/server/reportCompleted.js';
import { checkTimeBudget } from '/server/tideGlobalMethods';
// import { distTimeBudget } from './tideGlobalMethods.js';
// import { whatIsBatch, whatIsBatchX } from './searchOps.js';
// import { round1Decimal } from './calcOps';

import Config from '/server/hardConfig.js';


SyncedCron.config({
  log: false,// Log job run details to console
  
  logger: null,// Defaults to Meteor's logging package
  
  collectionName: 'cronHistory', // Default

  utc: true,
});



SyncedCron.add({
  name: 'Weekly Lock Check',
  schedule: (parser)=> parser.text('at 6:00 am on Sat'),
  job: ()=> goDo('lockingCacheUpdate')
});

SyncedCron.add({
  name: 'Twice Daily Trace Priority',
  schedule: (parser)=> parser.text('at 6:00 am every weekday also at 6:00 pm every weekday'),
  job: ()=> goDo('updateLiveMovement')
});
  
SyncedCron.add({
  name: 'Daily Done Target By Month',
  schedule: (parser)=> parser.text('at 6:01 am every weekday'),
  job: ()=> runLoop(countDoneBatchTarget, 'doneBatchLiteMonths', 'month')
});
SyncedCron.add({
  name: 'Daily Done Target By Week',
  schedule: (parser)=> parser.text('at 6:02 am every weekday'),
  job: ()=> runLoop(countDoneBatchTarget, 'doneBatchLiteWeeks', 'week')
});

SyncedCron.add({
  name: 'Daily Done Units By Month',
  schedule: (parser)=> parser.text('at 6:03 am every weekday'),
  job: ()=> runLoop(countDoneUnits, 'doneUnitLiteMonths', 'month')
});
SyncedCron.add({
  name: 'Daily Done Units By Week',
  schedule: (parser)=> parser.text('at 6:04 am every weekday'),
  job: ()=> runLoop(countDoneUnits, 'doneUnitLiteWeeks', 'week')
});
  
SyncedCron.start();
  
  
function countDoneUnits(accessKey, rangeStart, rangeEnd) {
  return new Promise(function(resolve) {
    let diCount = 0;
  
    BatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: new Date(rangeEnd)
      },
      items: { $elemMatch: { finishedAt: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).forEach( (gf)=> {
      const thisDI = gf.items.filter( x =>
        x.finishedAt !== false &&
        moment(x.finishedAt).isBetween(rangeStart, rangeEnd)
      );
      let doneUnits = 0;
      for(let i of thisDI) {
        doneUnits += i.units;
      }
      diCount = diCount + doneUnits;   
    });
    resolve(diCount);
  });
}

async function countDoneBatchTarget(accessKey, rangeStart, rangeEnd) {
    
  let doneOnTime = 0;
  let doneLate = 0;
  let shipOnTime = 0;
  let shipLate = 0;
  let doneUnderQ = 0;
  let doneOverQ = 0;
  
  const doneCalc = (endAt, doneAt, tide, quoteTimeBudget, lockTrunc)=> {
    const dst = deliveryBinary(endAt, doneAt);
    dst[0] === 'late' ? doneLate++ : doneOnTime++;
    dst[1] === 'late' ? shipLate++ : shipOnTime++;
    
    const q = checkTimeBudget(tide, quoteTimeBudget, lockTrunc);
    !q ? null : q < 0 ? doneOverQ++ : doneUnderQ++;
  };
    
  const b = BatchDB.find({
    orgKey: accessKey, 
    finishedAt: { 
      $gte: new Date(rangeStart),
      $lte: new Date(rangeEnd) 
    }
  },{fields:{
    'end': 1,
    'finishedAt': 1,
    'tide': 1,
    'quoteTimeBudget': 1,
    'lockTrunc': 1
  }}).fetch();
  await Promise.all(b.map( async (gf, inx)=> {
    await new Promise( (resolve)=> {
      doneCalc(gf.end, gf.finishedAt, gf.tide, gf.quoteTimeBudget, gf.lockTrunc);
      resolve(true);
    });
  }));
    
  const bx = XBatchDB.find({
    orgKey: accessKey, 
    completedAt: { 
      $gte: new Date(rangeStart),
      $lte: new Date(rangeEnd) 
    }
  },{fields:{
    'salesEnd': 1,
    'completedAt': 1,
    'tide': 1,
    'quoteTimeBudget': 1,
    'lockTrunc': 1
  }}).fetch();
  await Promise.all(bx.map( async (gfx, inx)=> {
    await new Promise( (resolve)=> {
      doneCalc(gfx.salesEnd, gfx.completedAt, gfx.tide, gfx.quoteTimeBudget, gfx.lockTrunc);
      resolve(true);
    });
  }));
    
  return [ 
    doneOnTime,
    doneLate,
    shipOnTime,
    shipLate,
    doneUnderQ,
    doneOverQ
  ];
}
  
  
async function runLoop(countFunc, dataName, tSpan) {
  const apps = AppDB.find({},{fields:{'orgKey':1, 'createdAt':1}}).fetch();
  for(let app of apps) {
    const accessKey = app.orgKey;
    
    const nowLocal = moment().tz(Config.clientTZ);
    
    const dur = moment.duration(nowLocal.diff(moment(app.createdAt)));
    const cycles = tSpan == 'week' ?
                    parseInt( dur.asWeeks(), 10 ) :
                   tSpan == 'month' ?
                    parseInt( dur.asMonths(), 10 ) :
                    parseInt( dur.asYears(), 10 );
    const cySpan = tSpan || 'year';
    
    let countArray = [];
    for(let w = 0; w < cycles; w++) {
    
      const loopBack = nowLocal.clone().subtract(w, cySpan); 
     
      const rangeStart = loopBack.clone().startOf(cySpan).toISOString();
      const rangeEnd = loopBack.clone().endOf(cySpan).toISOString();
      
      const quantity = await countFunc(accessKey, rangeStart, rangeEnd);
      
      countArray.unshift({ 
        x: moment(rangeStart).tz(Config.clientTZ).format(),
        y:quantity
      });
    }
    
    CacheDB.upsert({orgKey: accessKey, dataName: dataName}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: dataName,
        dataSet: countArray
    }});
  }
}

function goDo(goFunc) {
  const apps = AppDB.find({},{fields:{'orgKey':1}}).fetch();
  for(let app of apps) {
    const accessKey = app.orgKey;
    Meteor.call(goFunc, accessKey);
  }
}