import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

export function batchTideTime(batchTide) {
    
  if(!batchTide) {
    return undefined;
  }else{
    let tideTime = 0;
    for(let bl of batchTide) {
      const mStart = moment(bl.startTime);
      const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
      const block = moment.duration(mStop.diff(mStart)).asMinutes();
      tideTime = tideTime + block;
    }
    if( !tideTime || typeof tideTime !== 'number' ) {
      return false;
    }else{
      return tideTime.toFixed(2, 10);
    }
  }
}

export function checkTimeBudget(tide, quoteTimeBudget) {
    
  const qtBready = !quoteTimeBudget ? false : true;
  
  let quote2tide = null;
  
  if(qtBready) {
    const qtB = qtBready && quoteTimeBudget.length > 0 ? 
                quoteTimeBudget[0].timeAsMinutes : 0;
    
    const totalQuoteMinutes = qtB || 0;
    
    const totalTideMinutes = batchTideTime(tide);
    
    quote2tide = totalQuoteMinutes - totalTideMinutes;
  }
  
  return quote2tide;
}
  
function collectActivtyLevel(privateKey, batchID, clientTZ) {
  return new Promise(resolve => {
    const bx = XBatchDB.findOne({_id: batchID});
    const batch = BatchDB.findOne({_id: batchID});
    
    const now = moment().tz(clientTZ);
    
    const peopleCount = (filtered)=> new Set( 
      Array.from(filtered, y => y.who ) 
    ).size;
      
    let collection = false;
    
    if(bx) {
      collection = {
        batch: bx.batch,
        batchID: bx._id,
        isActive: {
          isNow: 0,
          hasHour: 0,
          hasDay: 0,
          hasNone: true
        }
      };
      resolve(collection);
    
    }else if(batch) {

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
      
    }else{
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

  engagedState() {
    const user = Meteor.user();
    const eg = user && user.engaged;
    if(!eg || !eg.tKey) {
      return false;
    }else{
      const batch = BatchDB.findOne({ 'tide.tKey': eg.tKey });
      const sub = batch && batch.tide.find( x => x.tKey === eg.tKey);

      const bounce = batch ? [ batch.batch, sub.task ] : false;
      return bounce;
    }
  },
  
  startTideTask(batchId, accessKey, newTkey, newTask) {
    try {
      const orgKey = accessKey || Meteor.user().orgKey;
      const doc = BatchDB.findOne({ _id: batchId, orgKey: orgKey });
      if(typeof newTkey !== 'string') {
        null;
      }else{
        const keyCheck = doc && doc.tide.every( x => x.tKey !== newTkey );
        const user = Meteor.user();
        const spinning = user && user.engaged;
        if(!doc || !keyCheck || spinning || !Roles.userIsInRole(Meteor.userId(), 'active')) { 
          null;
        }else{
          // const newTkey = new Meteor.Collection.ObjectID().valueOf();
          BatchDB.update({ _id: batchId }, {
            $push : { tide: { 
              tKey: newTkey,
              who: Meteor.userId(),
              startTime: new Date(),
              stopTime: false,
              task: newTask
          }}});
          Meteor.users.update(Meteor.userId(), {
            $set: {
              engaged: {
                task: 'PRO',
                tKey: newTkey
              }
            }
          });

          Meteor.defer( ()=>{
            const sameDay = doc.tide.find( x => moment(x.startTime).isSame(moment(), 'day') );
            if(!sameDay) {
              Meteor.call(
                'sendNotifyForBatch',
                orgKey, 
                doc.batch,
                `${doc.batch} Start`,
                `First activity of the day`
              );
            }
          });
          return true;
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  stopTideTask(tideKey, accessKey) {
    try {
      const orgKey = accessKey || Meteor.user().orgKey;
      const userId = Meteor.userId(); 
      
      const doc = BatchDB.findOne({ 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey && x.who === userId );
      if(!sub) { null }else{
        const batch = BatchDB.findOne({ 'tide.tKey': tideKey });
        const batchID = batch._id || false;
        if(batchID) {
          BatchDB.update({_id: batchID, orgKey: orgKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.stopTime' : new Date()
          }});
          Meteor.users.update(userId, {
            $set: {
              engaged: false
            }
          });    
         return true;
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  switchTideTask(tideKey, newbatchID, newTkey, newTask) {
    try {
      const accessKey = Meteor.user().orgKey;
      
      const stopFirst = (tKey, aKey)=> {
        return new Promise(function(resolve, reject) {
          Meteor.call('stopTideTask', tKey, aKey, (err, re)=>{
            err && reject(err);
            re && resolve('Success');
          });
        });
      };
      
      const startSecond = (nbID, aKey, nTky, nTsk)=> {
        Meteor.call('startTideTask', nbID, aKey, nTky, nTsk, (err, re)=>{
          err && new Meteor.Error(err);
          if(re) { return true }
        });
      };
      
      stopFirst(tideKey, accessKey)
        .then(startSecond(newbatchID, accessKey, newTkey, newTask))
        .finally(()=> { return true });

    }catch (error) {
      throw new Meteor.Error(error);
    }finally{ return true }
  },
  
  
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
      
      const allTouched = BatchDB.find({
        orgKey: Meteor.user().orgKey,
        tide: { $elemMatch: { startTime: {
        $gte: new Date(localDate.startOf('day').format()),
        $lte: new Date(localDate.endOf('day').format())
      }}}
      }).fetch();
      
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
      
      const allTouched = !sendAll ?
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
  
        const allTouched =
          BatchDB.find({
            orgKey: Meteor.user().orgKey, 
            tide: { $elemMatch: { startTime: {
              $gte: new Date(timeAgo.format()),
              $lte: new Date(serverTime.format())
            }}},
            'tide.who': Meteor.userId()
          }).fetch();
      
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
  
  editTideTimeBlock(batch, tideKey, newStart, newStop, taskIs) {
    try {
      const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey );
      
      if(!sub || !newStart || !newStop) {
        return false;
      }else{
        const auth = sub.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
        if(!auth) {
          return false;
        }else{
          const taskVal = !taskIs || taskIs === 'false' ? false : taskIs;
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.startTime' : newStart,
              'tide.$.stopTime' : newStop,
              'tide.$.task' : taskVal
          }});
          return true;
        }
      }
      
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  stopTideTimeBlock(batch, tideKey) {
    try {
      const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey );
      
      if( !sub || sub.stopTime !== false ) {
        return false;
      }else{
        const auth = sub.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
        if(!auth) {
          return false;
        }else{
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.stopTime' : new Date()
          }});
          Meteor.users.update(sub.who, {
            $set: {
              engaged: false
            }
          });
          return true;
        }
      }
      
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  splitTideTimeBlock(batch, tideKey, newSplit, stopTime) {
    try {
      const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey );
      
      if(!sub || !newSplit || !stopTime) {
        return false;
      }else{
        const auth = sub.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
        if(!auth) {
          return false;
        }else{
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.stopTime' : newSplit
          }});
          const newTkey = new Meteor.Collection.ObjectID().valueOf();
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $push : { tide: { 
              tKey: newTkey,
              who: sub.who,
              startTime: newSplit,
              stopTime: stopTime,
              task: sub.task
          }}});
          return true;
        }
      }
    }catch (err) {
       throw new Meteor.Error(err);
    }
  },
  
  errorFixDeleteTideTimeBlock(batch) {
    // try {
      const doc = BatchDB.findOne({ batch: batch });
      
      if( !doc ) {
        return false;
      }else{
        const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
        if(!auth) {
          return false;
        }else{
          BatchDB.update({
            batch: batch,
            orgKey: Meteor.user().orgKey
          }, {
            $pop: { tide : 1
          }});
        }
      }
    // }catch (err) {
    //   throw new Meteor.Error(err);
    // }
  },
  
  errorFixForceClearEngage(userID) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      Meteor.users.update(userID, {
        $set: {
          engaged: false
        }
      });
    }
  },

});