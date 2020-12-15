import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

// import { distTimeBudget } from './tideGlobalMethods.js';
// import { whatIsBatch, whatIsBatchX } from './searchOps.js';
// import { round1Decimal } from './calcOps';

import Config from '/server/hardConfig.js';


SyncedCron.config({
  log: false,// Log job run details to console
  
  logger: null,// Defaults to Meteor's logging package
  
  collectionName: 'cronHistory', // Default

  utc: false,
});
  
  
SyncedCron.add({
  name: 'Daily Done Items',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 8:00 am'); // for midnight tz(Regina/Central)
  },
  job: function() {
    var numbersCrunched = runLoop(countDoneItemDay);
    return numbersCrunched;
  }
});
  
SyncedCron.start();
  
  
function countDoneItemDay(accessKey, rangeStart, rangeEnd) {
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
  
  
async function runLoop(countDoneItemDay) {
  const apps = AppDB.find({},{fields:{'orgKey':1, 'createdAt':1}}).fetch();
  for(let app of apps) {
    const accessKey = app.orgKey;
    
    const nowLocal = moment().tz(Config.clientTZ);
    
    const dur = moment.duration(moment().diff(moment(app.createdAt)));
    const cycles =  parseInt( dur.asDays(), 10 );
    
    let countArray = [];
    for(let w = 0; w < cycles; w++) {
    
      const loopBack = nowLocal.clone().subtract(w, 'day'); 
     
      const rangeStart = loopBack.clone().startOf('day').toISOString();
      const rangeEnd = loopBack.clone().endOf('day').toISOString();
      
      const quantity = await countDoneItemDay(accessKey, rangeStart, rangeEnd);
      
      countArray.unshift({ x:cycles-w, y:quantity, label: rangeStart });
    }
    
    CacheDB.upsert({orgKey: accessKey, dataName: 'itemDoneDays'}, {
      $set : {
        orgKey: accessKey,
        lastUpdated: new Date(),
        dataName: 'itemDoneDays',
        dataSet: countArray
    }});
  }
}