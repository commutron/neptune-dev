import moment from 'moment';


function collectActivtyLevel(privateKey, batchID, clientTZ) {
  return new Promise(resolve => {
    const bx = XBatchDB.findOne({_id: batchID});
    const batch = BatchDB.findOne({_id: batchID});
    
    const now = moment().tz(clientTZ);
    
    const durrCheck = (time, unit, bar)=> {
      if(!time) { return false }else{
        return moment.duration(
                now.diff(moment(time).tz(clientTZ)))
                  .as(unit) < bar;
      }
    };
    
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
          hasRecent: 0,
          hasShift: 0,
          hasDay: 0,
          hasNone: true
        }
      };
      resolve(collection);
    
    }else if(batch) {

      const tide = batch.tide || [];
      
      const yNow = tide.filter( x => x.stopTime === false );
      const isNow = peopleCount(yNow);
      
      const yHour = tide.filter( x => durrCheck(x.stopTime, 'hours', 1) );
      const hasHour = peopleCount(yHour);
      
      const yRecent = tide.filter( x => durrCheck(x.stopTime, 'hours', 4) );
      const hasRecent = peopleCount(yRecent);
      
      const yShift = tide.filter( x => durrCheck(x.stopTime, 'hours', 12) );
      const hasShift = peopleCount(yShift);
      
      const yDay = tide.filter( x => durrCheck(x.stopTime, 'hours', 24) );
      const hasDay = peopleCount(yDay);
      
 
      collection = {
        batch: batch.batch,
        batchID: batch._id,
        isActive: {
          isNow: isNow,
          hasHour: hasHour,
          hasRecent: hasRecent,
          hasShift: hasShift,
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


Meteor.methods({


//// Tide \\\\\

  engagedState() {
    const user = Meteor.user();
    const eg = user && user.engaged;
    if(!eg) {
      return false;
    }else{
      const batch = BatchDB.findOne({ 'tide.tKey': eg.tKey });
      return batch.batch || false;
    }
  },
  
  startTideTask(batchId, accessKey) {
    try {
      const orgKey = accessKey || Meteor.user().orgKey;
      const doc = BatchDB.findOne({ _id: batchId, orgKey: orgKey });
      const user = Meteor.user();
      const spinning = user && user.engaged;
      if(!doc || spinning || !Roles.userIsInRole(Meteor.userId(), 'active')) { 
        null;
      }else{
        const newTkey = new Meteor.Collection.ObjectID().valueOf();
        BatchDB.update({ _id: batchId }, {
          $push : { tide: { 
            tKey: newTkey,
            who: Meteor.userId(),
            startTime: new Date(),
            stopTime: false
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
        
        const stopBatchFirst = (tideKey, orgKey)=> {
          return new Promise(function(resolve, reject) {
            const batch = BatchDB.findOne({ 'tide.tKey': tideKey });
            const batchID = batch._id || false;
            if(batchID) {
              BatchDB.update({_id: batchID, orgKey: orgKey, 'tide.tKey': tideKey}, {
                $set : { 
                  'tide.$.stopTime' : new Date()
              }});
              resolve('Success');
            }else{
              reject('fail');
            }
          });
        };
        
        const stopUserSecond = ()=> {
          Meteor.users.update(userId, {
            $set: {
              engaged: false
            }
          });
        };
      
        stopBatchFirst(tideKey, orgKey).then(stopUserSecond());
        return true;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  switchTideTask(tideKey, newbatchID) {
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
      
      const startSecond = (nbID, aKey)=> {
        Meteor.call('startTideTask', nbID, aKey);
      };
      
      stopFirst(tideKey, accessKey).then(startSecond(newbatchID, accessKey));
      return true;
    }catch (err) {
      throw new Meteor.Error(err);
    }
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
      
      let slimTideDay = [];
      for(let btch of allTouched) {
        const theDay = !btch.tide ? [] : btch.tide.filter( x => 
          moment.tz(x.startTime, clientTZ).year() === getYear && 
          moment.tz(x.startTime, clientTZ).dayOfYear() === getDay);
        for(let blck of theDay) {  
          slimTideDay.push({
            batch: btch.batch,
            tKey: blck.tKey,
            who: blck.who,
            startTime: blck.startTime,
            stopTime: blck.stopTime
          });
        }
      }
      return slimTideDay;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchSelfTideActivity(yearNum, weekNum) {
    try {
      const getYear = yearNum || moment().weekYear();
      const getWeek = weekNum || moment().week();
      
      const allTouched = BatchDB.find({
        orgKey: Meteor.user().orgKey, 
        'tide.who': Meteor.userId()
      }).fetch();
      
      let slimTideWeek = [];
      for(let btch of allTouched) {
        const yourWeek = !btch.tide ? [] : btch.tide.filter( x => 
          x.who === Meteor.userId() && 
          moment(x.startTime).weekYear() === getYear && 
          moment(x.startTime).week() === getWeek);
        for(let blck of yourWeek) {  
          slimTideWeek.push({
            batch: btch.batch,
            tKey: blck.tKey,
            who: blck.who,
            startTime: blck.startTime,
            stopTime: blck.stopTime
          });
        }
      }
      return slimTideWeek;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  editTideTimeBlock(batch, tideKey, newStart, newStop) {
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
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.startTime' : newStart,
              'tide.$.stopTime' : newStop
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
              stopTime: stopTime
          }}});
          return true;
        }
      }
    }catch (err) {
       throw new Meteor.Error(err);
    }
  }

});