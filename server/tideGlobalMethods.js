import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';

import { min2hr, round2Decimal } from './calcOps';

export function batchTideTime(batchTide, lockTrunc) {
    
  if(!batchTide ) {
    return undefined;
  }else if(batchTide.length === 0) {
    return 0;
  }else{
    if(typeof lockTrunc === 'object') {
      return lockTrunc.tideTotal;
    }else{
      
      const tideTime = Array.from(batchTide, bl => {
        const mStart = moment(bl.startTime);
        const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
        return moment.duration(mStop.diff(mStart)).asMinutes();
      }).reduce((x,y)=> x + y);

      if( !tideTime || typeof tideTime !== 'number' ) {
        return false;
      }else{
        const cleanTime = tideTime;
        return cleanTime;
      }
    }
  }
}

function getTvals(tide, quoteTimeBudget, lockTrunc) {
  if(quoteTimeBudget) {
    const totalTideMinutes = batchTideTime(tide, lockTrunc);
    
    const qtB = quoteTimeBudget.length > 0 ? 
                quoteTimeBudget[0].timeAsMinutes : 0;
    
    const totalQuoteMinutes = qtB || totalTideMinutes;
    
    return [ totalTideMinutes, totalQuoteMinutes ];
  }else{
    return undefined;
  }
}

export function checkTimeBudget(tide, quoteTimeBudget, lockTrunc) {
  
  const tVq = getTvals(tide, quoteTimeBudget, lockTrunc);
    
  const quote2tide = !tVq ? null : tVq[1] - tVq[0];
  
  return quote2tide;
}

export function distTimeBudget(tide, quoteTimeBudget, itemQuantity, allQuantity, lockTrunc) {
  
  const tideVquote = getTvals(tide, quoteTimeBudget, lockTrunc);
  
  if( tideVquote == undefined ) {
    return undefined;
  }else{
    const totalTide = tideVquote[0];
    const trueQuote = tideVquote[1];
    
    const tidePerItem = round2Decimal( totalTide / itemQuantity );
    
    const quotePerItem = round2Decimal( trueQuote / allQuantity );
    
    // xx quote minutes remain
    const quoteMNtide = trueQuote - totalTide;
    const qMNt = min2hr( quoteMNtide );
    
    // tide is xx% under/over quote
    const tidePCquote = ( 1 - ( tidePerItem / quotePerItem ) ) * 100;
    const tPCq = round2Decimal(tidePCquote);
    
    return [ tidePerItem, quotePerItem, qMNt, tPCq ];
  }
}

  
function collectActivtyLevel(privateKey, batchID) {
  return new Promise(resolve => {
    const batch = BatchDB.findOne({_id: batchID}) ||
                  XBatchDB.findOne({_id: batchID});
    
    const now = moment().tz(Config.clientTZ);
    
    const peopleCount = (filtered)=> new Set( 
      Array.from(filtered, y => y.who ) 
    ).size;
    
    if(!batch) {
      resolve(false);
    }else{
      const aDone = batch.completedAt || batch.finishedAt;
      const rested = !batch.live && aDone && 
                        moment.duration(now.diff(moment(aDone))).asHours() > 24;
      
      const tide = batch.tide || [];
      
      if(rested) {
        resolve({
          batch: batch.batch,
          batchID: batch._id,
          isActive: {
            isNow: 0,
            hasHour: 0,
            hasDay: 0,
            hasNone: tide.length === 0
          }
        });
      }else{
        const yNow = tide.filter( x => x.stopTime === false );
        const isNow = peopleCount(yNow);
        
        const allStopped = tide.filter( x => x.stopTime !== false );
        
        const yHour = allStopped.filter( x => moment.duration(
                                          now.diff(moment(x.stopTime).tz(Config.clientTZ)))
                                            .as('hours') < 1 );
        const hasHour = peopleCount(yHour);
        
        const yDay = allStopped.filter( x => now.isSame(
                                        moment(x.stopTime).tz(Config.clientTZ)
                                        , 'day') );
        const hasDay = peopleCount(yDay);
   
        resolve({
          batch: batch.batch,
          batchID: batch._id,
          isActive: {
            isNow: isNow,
            hasHour: hasHour,
            hasDay: hasDay,
            hasNone: tide.length === 0
          }
        });
      }
    }
  });
}

function slimBlockReturnData(batch, thePeriod, lockout) {
  let slimBlock = [];
  for(let blck of thePeriod) {
    let mStop = blck.stopTime ? moment(blck.stopTime) : moment();
    let durr = moment.duration(mStop.diff(blck.startTime)).asMinutes();
    slimBlock.push({
      batch: batch,
      tKey: blck.tKey,
      who: blck.who,
      startTime: blck.startTime,
      stopTime: blck.stopTime,
      durrAsMin: durr,
      task: blck.task || null,
      lockOut: lockout
    });
  }
  return slimBlock;     
}


Meteor.methods({


//// Tide \\\\\

  tideActivityLevel(batchID, serverAccessKey) {
    async function bundleActivity(batchID) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectActivtyLevel(accessKey, batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleActivity(batchID);
  },
  
  ////////////////////////////////////////////////////
  // Tide Records \\
  ////////////////////////////////////////////////////

  fetchOrgTideActivity(dateString) {
    try {
      const localDate = moment.tz(dateString, Config.clientTZ);
      
      const getYear = localDate.year();
      const getDay = localDate.dayOfYear();
      
      const touchedB = BatchDB.find({
        orgKey: Meteor.user().orgKey,
        tide: { $elemMatch: { startTime: {
        $gte: new Date(localDate.startOf('day').format()),
        $lte: new Date(localDate.endOf('day').format())
      }}}
      }).fetch();
      const touchedBX = XBatchDB.find({
        orgKey: Meteor.user().orgKey,
        tide: { $elemMatch: { startTime: {
        $gte: new Date(localDate.startOf('day').format()),
        $lte: new Date(localDate.endOf('day').format())
      }}}
      }).fetch();
      
      const allTouched = [...touchedB,...touchedBX];
      
      let slimTideCollection = [];
      for(let btch of allTouched) {
        const theDay = !btch.tide ? [] : btch.tide.filter( x => 
          moment.tz(x.startTime, Config.clientTZ).year() === getYear && 
          moment.tz(x.startTime, Config.clientTZ).dayOfYear() === getDay);
        
        const slimData = slimBlockReturnData(btch.batch, theDay, btch.lock);
        Array.prototype.push.apply(slimTideCollection, slimData);
      }
      return slimTideCollection;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchWeekTideActivity(yearNum, weekNum, allOrg, mockUserId) {
    try {
      const getYear = yearNum || moment().weekYear();
      const getWeek = weekNum || moment().week();
      const pinDate = moment.tz(Config.clientTZ).year(getYear).week(getWeek);
      
      const isAuth = Meteor.userId() === mockUserId ||
              Roles.userIsInRole(Meteor.userId(), ['admin', 'peopleSuper']);
                      
      const sendAll = allOrg;
      const sendOneID = !mockUserId ? Meteor.userId() :
                        isAuth ? mockUserId : null;
      
      const touchedB = !sendAll ?
        BatchDB.find({
          orgKey: Meteor.user().orgKey, 
          tide: { $elemMatch: { startTime: {
            $gte: new Date(pinDate.startOf('week').format()),
            $lte: new Date(pinDate.endOf('week').format())
          }}},
          'tide.who': sendOneID
        }).fetch()
        :
        BatchDB.find({
          orgKey: Meteor.user().orgKey,
          tide: { $elemMatch: { startTime: {
            $gte: new Date(pinDate.startOf('week').format()),
            $lte: new Date(pinDate.endOf('week').format())
          }}},
        }).fetch();

      const touchedBX = !sendAll ?
        XBatchDB.find({
          orgKey: Meteor.user().orgKey, 
          tide: { $elemMatch: { startTime: {
            $gte: new Date(pinDate.startOf('week').format()),
            $lte: new Date(pinDate.endOf('week').format())
          }}},
          'tide.who': sendOneID
        }).fetch()
        :
        XBatchDB.find({
          orgKey: Meteor.user().orgKey,
          tide: { $elemMatch: { startTime: {
            $gte: new Date(pinDate.startOf('week').format()),
            $lte: new Date(pinDate.endOf('week').format())
          }}},
        }).fetch();
        
      const allTouched = [...touchedB,...touchedBX];
      
      let slimTideCollection = [];
      for(let btch of allTouched) {
        const yourWeek = !btch.tide ? [] : btch.tide.filter( x => 
          (sendAll || x.who === sendOneID ) && 
          moment(x.startTime).weekYear() === getYear && 
          moment(x.startTime).week() === getWeek);
          
        const rtnBlock = slimBlockReturnData(btch.batch, yourWeek, btch.lock);
        Array.prototype.push.apply(slimTideCollection, rtnBlock);
      }
      return slimTideCollection;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchErrorTimes() {
    try {
      
      let badDurr = [];
      
      const screenT = (tideArr)=> {
        for( let t of tideArr ) {
          if( ( ( t.stopTime || new Date() ) - t.startTime ) 
              > ( 600 * 60000 )
          ) {
            badDurr.push([
              t.startTime, t.who
            ]);
          }
        }
      };
      
      BatchDB.find({
        orgKey: Meteor.user().orgKey,
        $or: [ { lock: false },
               { lock: { $exists: false } }
             ]
      }).forEach( b => {
        if(b.tide) { screenT(b.tide) }
      });
      
      XBatchDB.find({
        orgKey: Meteor.user().orgKey,
        $or: [ { lock: false },
               { lock: { $exists: false } }
             ]
      }).forEach( bx => {
        if(bx.tide) { screenT(bx.tide) }
      });
      
      const badDurrS = badDurr.sort( (d1, d2)=> 
                          d1[1] < d2[1] ? 1 : d1[1] > d2[1] ? -1 : 0 );
      return JSON.stringify(badDurrS);
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  // FIX
  
  errorFixDeleteTideTimeBlock(batch) {
    try {
      const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
      if(!auth) {
        return false;
      }else{
        const doc = BatchDB.findOne({ batch: batch });
      
        if( doc ) {
          BatchDB.update({
            batch: batch,
            orgKey: Meteor.user().orgKey
          }, {
            $pop: { tide : 1
          }});
        }else{
          const docx = XBatchDB.findOne({ batch: batch });
          
          if( docx ) {
            XBatchDB.update({
              batch: batch,
              orgKey: Meteor.user().orgKey
            }, {
              $pop: { tide : 1
            }});
          }else{
            return false;
          }
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  

});