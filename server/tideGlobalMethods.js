import moment from 'moment';
import 'moment-timezone';

import Config from '/server/hardConfig.js';

import { min2hr, round2Decimal, percentOverUnder, diffTrend } from './calcOps';
import { noIg } from './utility';

export function addTideDuration(td) {
  const mStart = moment(td.startTime);
  const mStop = td.stopTime ? moment(td.stopTime) : moment();
  
  return Math.round( mStop.diff(mStart, 'minutes', true) );
}

function addTideArrayDuration(tideArray) {
  let tideDurr = 0;
  for(const td of tideArray) {
    const mStart = moment(td.startTime);
    const mStop = td.stopTime ? moment(td.stopTime) : moment();
    
    tideDurr += mStop.diff(mStart, 'seconds');
  }
  return Math.round( moment.duration(tideDurr, 'seconds').asMinutes() );
}

export function batchTideTime(batchTide, lockTrunc) {
  if(!batchTide ) {
    return undefined;
  }else if(batchTide.length === 0) {
    return 0;
  }else{
    if(typeof lockTrunc === 'object') {
      return lockTrunc.tideTotal;
    }else{
      const tideTime = addTideArrayDuration(batchTide);
      
      if( typeof tideTime !== 'number' ) {
        return false;
      }else{
        return tideTime;
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

export function distTimeBudget(tide, quoteTimeBudget, allQuantity, lockTrunc) {
  
  const tideVquote = getTvals(tide, quoteTimeBudget, lockTrunc);
  
  if( tideVquote == undefined ) {
    return undefined;
  }else{
    const totalTide = tideVquote[0];
    const trueQuote = tideVquote[1];
    
    const tidePerItem = allQuantity <= 0 ? 0 : round2Decimal( totalTide / allQuantity );
    
    const quotePerItem = allQuantity <= 0 ? 0 : round2Decimal( trueQuote / allQuantity );
    
    // xx quote minutes remain
    const quoteMNtide = trueQuote - totalTide;
    const qHRt = min2hr( quoteMNtide );
    
    // tide is xx% under/over quote
    const tPCq = percentOverUnder(trueQuote, totalTide);
    
    return [ tidePerItem, quotePerItem, qHRt, tPCq ];
  }
}
  
function collectActivtyLevel(batchID) {
  return new Promise(resolve => {
    const batch = XBatchDB.findOne(
      {_id: batchID},
      {fields: {'batch':1,'live':1,'completedAt':1,'tide':1}}
    );
    
    const now = moment().tz(Config.clientTZ);
    
    const peopleCount = (filtered)=> new Set( 
      Array.from(filtered, y => y.who ) 
    ).size;
    
    if(!batch) {
      resolve(false);
    }else{
      const aDone = batch.completedAt;
      const rested = !batch.live && aDone && 
                        moment.duration(now.diff(moment(aDone))).asHours() > Config.timeAfterGrace;
      
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

function slimTideArray(batch, thePeriod, lockout) {
  let slimBlock = [];
  for(let blck of thePeriod) {
    const tideMinutes = addTideDuration(blck);
    
    slimBlock.push({
      batch: batch,
      tKey: blck.tKey,
      who: blck.who,
      startTime: blck.startTime,
      stopTime: blck.stopTime,
      durrAsMin: tideMinutes,
      focus: blck.focus,
      task: blck.task || null,
      subtask: blck.subtask || null,
      lockOut: lockout
    });
  }
  return slimBlock;     
}
function slimTimeReturn(proj, entry) {
  const timeMinutes = addTideDuration(entry);
  return {
    project: proj,
    type: entry.type,
    tKey: entry._id,
    who: entry.who,
    startTime: entry.startTime,
    stopTime: entry.stopTime,
    durrAsMin: timeMinutes,
    focus: null,
    task: entry.task || null,
    subtask: entry.subtask || null,
    lockOut: false
  };
}


Meteor.methods({

//// Tide \\\\\

  tideActivityLevel(batchID) {
    async function bundleActivity(batchID) {
      try {
        bundle = await collectActivtyLevel(batchID);
        return bundle;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    return bundleActivity(batchID);
  },
  
  ///////////////////////////////////////
  // Tide Records \\\\\\\\\\\\\\\\\\\\\\\
  ///////////////////////////////////////
  fetchOrgTideActivity(dateString) {
    try {
      const localDate = moment.tz(dateString, Config.clientTZ);
      const dayStart = new Date(localDate.startOf('day').format());
      const dayEnd = new Date(localDate.endOf('day').format());
      
      const getYear = localDate.year();
      const getDay = localDate.dayOfYear();
      
      let slimCollection = [];
      
      const touchedBX = XBatchDB.find({
        orgKey: Meteor.user().orgKey,
        tide: { $elemMatch: { startTime: {
          $gte: dayStart,
          $lte: dayEnd
      }}}
      }).fetch();
      
      for(let btch of touchedBX) {
        const bchDay = !btch.tide ? [] : btch.tide.filter( x => 
          moment.tz(x.startTime, Config.clientTZ).year() === getYear && 
          moment.tz(x.startTime, Config.clientTZ).dayOfYear() === getDay);
        
        const slimTide = slimTideArray(btch.batch, bchDay, btch.lock);
        Array.prototype.push.apply(slimCollection, slimTide);
      }
      
      const dayTimez = TimeDB.find({
        startTime: {
          $gte: dayStart,
          $lte: dayEnd
        }
      }).fetch();
      
      for(let time of dayTimez) {
        const slimTimez = slimTimeReturn(time.project, time);
        slimCollection.push(slimTimez);
      }
      
      return slimCollection;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchWeekTideActivity(yearNum, weekNum, allOrg, mockUserId, accessKey, block) {
    try {
      const orgKey = accessKey || Meteor.user().orgKey;
      const xid = block ? noIg() : 'noblock';
      
      const getYear = yearNum || moment().weekYear();
      const getWeek = weekNum || moment().week();
      const pinDate = moment.tz(Config.clientTZ).year(getYear).week(getWeek);
      const weekStart = new Date(pinDate.startOf('week').format());
      const weekEnd = new Date(pinDate.endOf('week').format());
      
      const isAuth = Meteor.userId() === mockUserId ||
              Roles.userIsInRole(Meteor.userId(), ['admin', 'peopleSuper']);

      const sendOneID = mockUserId ? isAuth ? mockUserId : null : Meteor.userId();

      let slimCollection = [];
      
      const touchedBX = !allOrg ?
        XBatchDB.find({
          orgKey: orgKey, 
          groupId: { $ne: xid },
          tide: { $elemMatch: { startTime: {
            $gte: weekStart,
            $lte: weekEnd
          }}},
          'tide.who': sendOneID
        }).fetch()
        :
        XBatchDB.find({
          orgKey: orgKey,
          groupId: { $ne: xid },
          tide: { $elemMatch: { startTime: {
            $gte: weekStart,
            $lte: weekEnd
          }}},
        }).fetch();
      
      for(let btch of touchedBX) {
        const yourWeek = !btch.tide ? [] : btch.tide.filter( x => 
          (allOrg || x.who === sendOneID ) && 
          moment(x.startTime).weekYear() === getYear && 
          moment(x.startTime).week() === getWeek);
          
        const rtnBlock = slimTideArray(btch.batch, yourWeek, btch.lock);
        Array.prototype.push.apply(slimCollection, rtnBlock);
      }
      
      const dayTimez = !allOrg ?
        TimeDB.find({
          startTime: {
            $gte: weekStart,
            $lte: weekEnd
          },
          who: sendOneID
        }).fetch()
        :
        TimeDB.find({
          startTime: {
            $gte: weekStart,
            $lte: weekEnd
          }
        }).fetch();
      
      for(let time of dayTimez) {
        const slimTimez = slimTimeReturn(time.project, time);
        slimCollection.push(slimTimez);
      }
      
      return slimCollection;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchWeekAvgTime(accessKey) {
    if(accessKey) {
      const now = moment.tz(Config.clientTZ);
      const yearNum = now.weekYear();
      const weekNum = now.week();
      const weekTimes = Meteor.call('fetchWeekTideActivity',
                          yearNum, weekNum, true, false, accessKey, true);
      
      const durrs = Array.from(weekTimes, x => x.durrAsMin);
      const total = durrs.reduce((x,y)=> x + y, 0);
      const days = [...new Set(Array.from(weekTimes, x => moment(x.startTime).day())) ].length;
      
      const avgperday = total > 0 ? total / days : 0;
  
      const lastavg = CacheDB.findOne({dataName: 'avgDayTime'});
      const runningavg = lastavg ? lastavg.dataNum : 0;
      
      const newavg = !lastavg ? avgperday :
              Math.round( ( runningavg + avgperday ) / 2 );
              
      const trend = diffTrend(newavg, runningavg);
      
      CacheDB.upsert({dataName: 'avgDayTime'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'avgDayTime',
          dataNum: Number(newavg),
          dataTrend: trend
      }});
    }
  },
  
  fetchOpenApproxTime() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;

    const apxOpenShade = CacheDB.findOne({orgKey: accessKey, dataName: 'apxOpenTime'});
    const apxtime = apxOpenShade ? apxOpenShade.lastUpdated : null;
    
    const fnc = (trArr, key)=> {
      const cln = trArr.filter( x => x[key] && !isNaN(x[key]) && x[key] > 0 );
      const rdc = cln.reduce( (arr, x)=> arr + x[key], 0 );
      const rnd = round2Decimal( moment.duration(rdc, "minutes").asHours() );
      return rnd;
    };
      
    const traces = TraceDB.find({live: true},
                     {fields:{'hold':1,'onFloor':1,'est2tide':1,'quote2tide':1}
                   }).fetch();
    
    const onFloorOpen = traces.filter( t => t.onFloor && !t.hold );
    const oFOq2t = fnc(onFloorOpen, 'quote2tide');
    const oFOe2t = fnc(onFloorOpen, 'est2tide');
    
    const onFloorHold = traces.filter( t => t.onFloor && t.hold );
    const oFHq2t = fnc(onFloorHold, 'quote2tide');
    const oFHe2t = fnc(onFloorHold, 'est2tide');
    
    const kitOpen = traces.filter( t => !t.onFloor && !t.hold );
    const kOq2t = fnc(kitOpen, 'quote2tide');
    const kOe2t = fnc(kitOpen, 'est2tide');
    
    const kitHold = traces.filter( t => !t.onFloor && t.hold );
    const kHq2t = fnc(kitHold, 'quote2tide');
    const kHe2t = fnc(kitHold, 'est2tide');

    const totalQ = round2Decimal( oFOq2t + oFHq2t + kOq2t + kHq2t );
    const totalE = round2Decimal( oFOe2t + oFHe2t + kOe2t + kHe2t );
    
    const runningQ = apxOpenShade ? apxOpenShade.dataNum : 0;
    const trendQ = diffTrend(totalQ, runningQ);
    const runningE = apxOpenShade ? apxOpenShade.dataNumEst : 0;
    const trendE = diffTrend(totalE, runningE);
    
    const report = [
      ['Trending', '', trendQ, trendE],
      ['Total', traces.length, totalQ, totalE],
      ['WIP - available', onFloorOpen.length, oFOq2t, oFOe2t],
      ['WIP - On Hold', onFloorHold.length, oFHq2t, oFHe2t],
      ['Upstream - available', kitOpen.length, kOq2t, kOe2t],
      ['Upstream - On Hold', kitHold.length, kHq2t, kHe2t],
    ];
    
    const stale = !apxtime ? true :
            moment.duration(moment().diff(moment(apxtime))).as('hours') > Config.freche * 2;
    if(stale) {
      CacheDB.upsert({dataName: 'apxOpenTime'}, {
        $set : {
          orgKey: accessKey,
          lastUpdated: new Date(),
          dataName: 'apxOpenTime',
          dataNum: Number(totalQ),
          dataTrend: trendQ,
          dataNumEst: Number(totalE),
          dataTrendEst: trendE,
          // dataSet: report
      }});
    }else{null}
      
    return report;
  },
  
  fetchOverRun() {
    try {
      const stillEng = Meteor.users.find({engaged: { $exists: true, $ne: false }},
                                         { fields:{'engaged':1} }).fetch();
      
      console.log(stillEng);
      if(stillEng.length > 0) {
        const mssg = `You did not stop your time tracker from the previous workday.\nPlease correct your Project Activity record.`;
        
        for( let u of stillEng ) {
          const ttle = `${u.engaged.tName} Project Time Overrun`;
        
          const b = XBatchDB.findOne({ 'tide.tKey': u.engaged.tKey },{fields:{'tide':1}});
          if(b) {
            const td = b.tide.find( x => x.tKey === u.engaged.tKey );
            const overDay = ( new Date() - td.startTime ) > 
                            ( (Config.maxShift / 2) * 60 * 60000 );
            if(overDay) {
              Meteor.call('sendUserDM', u._id, ttle, mssg);
            }
          }else{
            const t = TimeDB.findOne({ _id: u.engaged.tKey },{fields:{'startTime':1}});
            if(t) {
              const overDay = ( new Date() - t.startTime ) > 
                              ( (Config.maxShift / 2) * 60 * 60000 );
              if(overDay) {
                Meteor.call('sendUserDM', u._id, ttle, mssg);
              }
            }
          }
        }
      }
    }catch (error) {
      throw new Meteor.Error(error);
    }
  },
  
  fetchErrorTimes(tooVal) {
    try {
      const now = new Date();
      let badDurr = [];
      
      const tooManyMin = tooVal ? Number(tooVal) : 500;
      const tooManyMsec = tooManyMin * 60000;
      
      const screenT = (tideArr, bID)=> {
        for( let t of tideArr ) {
          if( t.stopTime === false ) {
            if( !Meteor.users.findOne({_id: t.who, 'engaged.tKey': t.tKey}) &&
                !Meteor.users.findOne({_id: t.who, 'engaged.tKey': { $in: [t.tKey] } })
            ) {
              const stopshort = moment(t.startTime).add(3, 'seconds').toISOString();
              XBatchDB.update({ _id: bID, 'tide.tKey': t.tKey }, {
                $set : { 
                  'tide.$.stopTime' : new Date(stopshort)
              }});
            }
          }
          if( ( ( t.stopTime || now ) - t.startTime ) > tooManyMsec ) {
            badDurr.push([
              t.startTime, t.who
            ]);
          }
        }
      };
      
      XBatchDB.find({
        orgKey: Meteor.user().orgKey,
        $or: [ { lock: false },
               { lock: { $exists: false } }
             ],
        'tide.stopTime': false
      },{ fields: {'tide':1} 
      }).forEach( bx => {
        if(bx.tide) { screenT(bx.tide, bx._id) }
      });
      
      TimeDB.find({ stopTime: false },{ fields: {'who':1,'startTime':1,'stopTime':1} 
      }).forEach( tm => {
        if( tm.stopTime === false ) {
          if( !Meteor.users.findOne({_id: tm.who, 'engaged.tKey': tm._id}) ) {
            const stopshort = moment(tm.startTime).add(3, 'seconds').toISOString();
            TimeDB.update({ _id: tm._id }, {
              $set : { 
                stopTime : new Date(stopshort)
            }});
          }
          if( ( ( tm.stopTime || now ) - tm.startTime ) > tooManyMsec ) {
            badDurr.push([
              tm.startTime, tm.who
            ]);
          }
        }
      });
      
      const badDurrS = badDurr.sort( (d1, d2)=> d1[1] < d2[1] ? 1 : d1[1] > d2[1] ? -1 : 0 );
      return JSON.stringify(badDurrS);
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  errorFixDeleteTideTimeBlock(batch) {
    try {
      const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
      if(!auth) {
        return false;
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
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchEqTimeReport(rangeStart, rangeEnd) {
    const rSdate = new Date(rangeStart);
    const rEdate = new Date(rangeEnd);
    let branches = new Set();
    let equips = new Set();
    
    let eqtimeArr = [];
    TimeDB.find({
      // type: 'MAINT', 'EQFX',
      startTime: {
        $gte: rSdate,
        $lte: rEdate
      }
    }).forEach( (t)=>{
      
      branches.add(t.task);
      
      let eq = t.project.split(' ~ ')[0].split("-")[1];
      equips.add(eq + '++' + t.task);
      
      eqtimeArr.push({
        startTime: t.startTime,
        stopTime: t.stopTime,
        dept: t.task,
        equip: eq,
        type: t.type
      });
    });
    
    let eqBreakdown = [];
    
    for(let eq of equips) {
      const eqX = eq.split('++');
      let pmTotal = addTideArrayDuration( eqtimeArr.filter( f => f.type === 'MAINT' && f.equip === eqX[0] ) );
      let fxTotal = addTideArrayDuration( eqtimeArr.filter( f => f.type === 'EQFX' && f.equip === eqX[0] ) );
      
      eqBreakdown.push([ eqX[0], eqX[1], pmTotal, fxTotal ]);
      
    }
    
    let brBreakdown = [];
    
    for(let br of branches) {
      const breq = eqBreakdown.filter( f => f[1] === br );
      const pmBr = breq.reduce( (arr, x)=> arr + x[2], 0);
      const fxBr = breq.reduce( (arr, x)=> arr + x[3], 0);
      
      brBreakdown.push([ br, pmBr, fxBr ]);
    }
    
    return [ eqBreakdown, brBreakdown ];
  }

});