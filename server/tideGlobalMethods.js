import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { sc2mn, sc2hr, round2Decimal } from './calcOps';

export function batchTideTime(batchTide) {
    
  if(!batchTide) {
    return undefined;
  }else{
    let tideTime = 0;
    for(let bl of batchTide) {
      const mStart = moment(bl.startTime);
      const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
      const block = moment.duration(mStop.diff(mStart)).asSeconds();
      tideTime = tideTime + block;
    }
    if( !tideTime || typeof tideTime !== 'number' ) {
      return false;
    }else{
      const cleanTime = sc2mn(tideTime);
      return cleanTime;
    }
  }
}

function getTvals(tide, quoteTimeBudget) {
  if(quoteTimeBudget) {
    const totalTideMinutes = batchTideTime(tide);
    
    const qtB = quoteTimeBudget.length > 0 ? 
                quoteTimeBudget[0].timeAsMinutes : 0;
    
    const totalQuoteMinutes = qtB || totalTideMinutes;
    
    return [ totalTideMinutes, totalQuoteMinutes ];
  }else{
    return undefined;
  }
}

export function checkTimeBudget(tide, quoteTimeBudget) {
  
  const tVq = getTvals(tide, quoteTimeBudget);
    
  const quote2tide = tVq[1] - tVq[0];
  
  return quote2tide;
}

export function distTimeBudget(tide, quoteTimeBudget, progQuantity, allQuantity) {
  
  const tideVquote = getTvals(tide, quoteTimeBudget);
  
  if( tideVquote == undefined ) {
    return undefined;
  }else{
    const totalTide = moment.duration( tideVquote[0], 'minutes' ).asSeconds();
    const trueQuote = moment.duration( tideVquote[1], 'minutes' ).asSeconds();
    
    const tidePerItem = round2Decimal( totalTide / progQuantity );
    const tPi = sc2mn( tidePerItem );
    
    const quotePerItem = round2Decimal( trueQuote / allQuantity );
    const qPi = sc2mn( quotePerItem );
    
    // xx quote minutes remain
    const quoteMNtide = trueQuote - totalTide;
    const qMNt = sc2hr( quoteMNtide );
    
    // tide is xx% under/over quote
    const tidePCquote = ( 1 - ( tidePerItem / quotePerItem ) ) * 100;
    const tPCq = round2Decimal(tidePCquote);
    
    return [ tPi, qPi, qMNt, tPCq ];
  }
}

  
function collectActivtyLevel(privateKey, batchID, clientTZ) {
  return new Promise(resolve => {
    const batch = BatchDB.findOne({_id: batchID}) ||
                  XBatchDB.findOne({_id: batchID});
    
    const now = moment().tz(clientTZ);
    
    const peopleCount = (filtered)=> new Set( 
      Array.from(filtered, y => y.who ) 
    ).size;
      
    let collection = false;
    
    if(!batch) {
      resolve(collection);
    }else{

      const tide = batch.tide || [];
      
      const yNow = tide.filter( x => x.stopTime === false );
      const isNow = peopleCount(yNow);
      
      const allStopped = tide.filter( x => x.stopTime !== false );
      
      const yHour = allStopped.filter( x => moment.duration(
                                        now.diff(moment(x.stopTime).tz(clientTZ)))
                                          .as('hours') < 1 );
      const hasHour = peopleCount(yHour);
      
      const yDay = allStopped.filter( x => now.isSame(
                                      moment(x.stopTime).tz(clientTZ)
                                      , 'day') );
      const hasDay = peopleCount(yDay);
 
      collection = {
        batch: batch.batch,
        batchID: batch._id,
        isActive: {
          isNow: isNow,
          hasHour: hasHour,
          hasDay: hasDay,
          hasNone: tide.length === 0
        }
      };
      resolve(collection);
    }
  });
}

function slimBlockReturnData(batch, thePeriod) {
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
      task: blck.task || null
    });
  }
  return slimBlock;     
}


Meteor.methods({


//// Tide \\\\\

  tideActivityLevel(batchID, clientTZ, serverAccessKey) {
    async function bundleActivity(batchID) {
      const accessKey = serverAccessKey || Meteor.user().orgKey;
      try {
        bundle = await collectActivtyLevel(accessKey, batchID, clientTZ);
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

  fetchOrgTideActivity(dateString, clientTZ) {
    try {
      const localDate = moment.tz(dateString, clientTZ);
      
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
          moment.tz(x.startTime, clientTZ).year() === getYear && 
          moment.tz(x.startTime, clientTZ).dayOfYear() === getDay);
        
        slimTideCollection.push(
          slimBlockReturnData(btch.batch, theDay)
        );
      }
      return [].concat(...slimTideCollection);
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchWeekTideActivity(yearNum, weekNum, clientTZ, allOrg, mockUserId) {
    try {
      const getYear = yearNum || moment().weekYear();
      const getWeek = weekNum || moment().week();
      const pinDate = moment.tz(clientTZ).year(getYear).week(getWeek);
      
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
          
        const rtnBlock = slimBlockReturnData(btch.batch, yourWeek);
        //sendAll ? durrBlockReturnData(btch.batch, yourWeek, clientTZ);
        slimTideCollection.push( rtnBlock );
      }
      return [].concat(...slimTideCollection);
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetch24TideActivity() {
    this.unblock();
    try {
      if(!Meteor.userId()) {
        return undefined;
      }else{
        const serverTime = moment();
        const timeAgo = serverTime.clone().subtract(24, 'hours');
  
        const touchedB =
          BatchDB.find({
            orgKey: Meteor.user().orgKey, 
            tide: { $elemMatch: { startTime: {
              $gte: new Date(timeAgo.format()),
              $lte: new Date(serverTime.format())
            }}},
            'tide.who': Meteor.userId()
          }).fetch();
        const touchedBX =
          XBatchDB.find({
            orgKey: Meteor.user().orgKey, 
            tide: { $elemMatch: { startTime: {
              $gte: new Date(timeAgo.format()),
              $lte: new Date(serverTime.format())
            }}},
            'tide.who': Meteor.userId()
          }).fetch();
        
        const allTouched = [...touchedB,...touchedBX];
        
        let slimTideCollection = [];
        for(let btch of allTouched) {
          const yourDay = !btch.tide ? [] : btch.tide.filter( x => 
            x.who === Meteor.userId() &&  
            moment(x.startTime).isSameOrAfter(timeAgo) );
          for(let blck of yourDay) {
            slimTideCollection.push({
              batch: btch.batch,
              startTime: blck.startTime
            });
          }
        }
        const cronoTimes = slimTideCollection.sort((x1, x2)=> {
                            if (x1.startTime < x2.startTime) { return 1 }
                            if (x1.startTime > x2.startTime) { return -1 }
                            return 0;
                          });
        const uniqTimes = [...new Set( Array.from(cronoTimes, x => x.batch ) ) ];
        return uniqTimes;
      }
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