import moment from 'moment';

Meteor.methods({


//// Tide \\\\\
  
  startTideTask(batchId, accessKey) {
    try {
      const orgKey = accessKey || Meteor.user().orgKey;
      const doc = BatchDB.findOne({ _id: batchId, orgKey: orgKey });
      if(!doc || !Roles.userIsInRole(Meteor.userId(), 'active')) { null }else{
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
  
  stopTideTask(batchId, tideKey) {
    try {
      const accessKey = Meteor.user().orgKey;
      const doc = BatchDB.findOne({_id: batchId, 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey && x.who === Meteor.userId() );
      if(!sub) { null }else{
        
        const stopBatchFirst = (tideKey, accessKey)=> {
          return new Promise(function(resolve, reject) {
            const batch = BatchDB.findOne({ 'tide.tKey': tideKey });
            const batchID = batch._id || false;
            if(batchID) {
              BatchDB.update({_id: batchId, orgKey: accessKey, 'tide.tKey': tideKey}, {
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
          Meteor.users.update(Meteor.userId(), {
            $set: {
              engaged: false
            }
          });
        };
      
        stopBatchFirst(tideKey, accessKey).then(stopUserSecond());
        return true;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  switchTideTask(tideKey, newbatchID) {
    try {
      const accessKey = Meteor.user().orgKey;
      
      const stopFirst = (tideKey, accessKey)=> {
        return new Promise(function(resolve, reject) {
          const batch = BatchDB.findOne({ 'tide.tKey': tideKey });
          const batchID = batch._id || false;
          if(batchID) {
            BatchDB.update({_id: batchID, orgKey: accessKey, 'tide.tKey': tideKey}, {
              $set : { 
                'tide.$.stopTime' : new Date()
            }});
            resolve('Success');
          }else{
            reject('fail');
          }
        });
      };
      
      const startSecond = (newbatchID, accessKey)=> {
        Meteor.call('startTideTask', newbatchID, accessKey);
      };
      
      stopFirst(tideKey, accessKey).then(startSecond(newbatchID, accessKey));
      return true;
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  

});