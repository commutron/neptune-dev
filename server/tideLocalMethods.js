import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';


Meteor.methods({


//// For a Person \\\\\

  engagedState() {
    const user = Meteor.user();
    const eg = user && user.engaged;
    if(!eg || !eg.tKey || !eg.task) {
      return false;
    }else if(eg.task === 'PRO') {
      const batch = BatchDB.findOne({ 'tide.tKey': eg.tKey });
      const sub = batch && batch.tide.find( x => x.tKey === eg.tKey);
      
      const bounce = batch ? [ batch.batch, sub.task ] : false;
      return bounce;
    }else{
      const batchX = XBatchDB.findOne({ 'tide.tKey': eg.tKey });
      const subX = batchX && batchX.tide.find( x => x.tKey === eg.tKey);

      const bounceX = batchX ? [ batchX.batch, subX.task ] : false;
      return bounceX;
    }
  },
  
  
  startTideTask(batchId, newTkey, newTask) {
    try {
      const orgKey = Meteor.user().orgKey;
      
      const user = Meteor.user();
      const spinning = user && user.engaged;
      const activeBlock = !Roles.userIsInRole(Meteor.userId(), 'active');
      
      if(typeof newTkey !== 'string' || spinning || activeBlock) {
        null;
      }else{
        
        const doc = BatchDB.findOne({ _id: batchId, orgKey: orgKey });
      
        if(doc) {
          const keyCheck = !doc.tide || doc.tide.every( x => x.tKey !== newTkey );
        
          if(!keyCheck) { 
            null;
          }else{
            if(!doc.tide) {
              BatchDB.update({ _id: batchId }, {
                $set : {
                  tide: [{
                    tKey: newTkey,
                    who: Meteor.userId(),
                    startTime: new Date(),
                    stopTime: false,
                    task: newTask
                }]
              }});
            }else{
              BatchDB.update({ _id: batchId }, {
                $push : { tide: { 
                  tKey: newTkey,
                  who: Meteor.userId(),
                  startTime: new Date(),
                  stopTime: false,
                  task: newTask
              }}});
            }
            Meteor.users.update(Meteor.userId(), {
              $set: {
                engaged: {
                  task: 'PRO',
                  tKey: newTkey
                }
              }
            });
            return true;
          }
        }else{
          const docX = XBatchDB.findOne({ _id: batchId, orgKey: orgKey });
          if(docX && docX.tide) {
            const keyChecX = docX.tide.every( x => x.tKey !== newTkey );
        
            if(!keyChecX) { 
              null;
            }else{
              XBatchDB.update({ _id: batchId }, {
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
                    task: 'PROX',
                    tKey: newTkey
                  }
                }
              });
              return true;
            }
          }
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  stopTideTask(tideKey) {
    try {
      const orgKey = Meteor.user().orgKey;
      const userId = Meteor.userId(); 
      
      const doc = BatchDB.findOne({ 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey && x.who === userId );
      if(doc && sub) {
        const batchID = doc._id || false;
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
      }else{
        const docX = XBatchDB.findOne({ 'tide.tKey': tideKey });
        const subX = docX && docX.tide.find( x => x.tKey === tideKey && x.who === userId );
        if(docX && subX) {
          const batchIDx = docX._id || false;
          if(batchIDx) {
            XBatchDB.update({_id: batchIDx, orgKey: orgKey, 'tide.tKey': tideKey}, {
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
          Meteor.call('stopTideTask', tKey, (err, re)=>{
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
        .then(startSecond(newbatchID, newTkey, newTask))
        .finally(()=> { return true });

    }catch (error) {
      throw new Meteor.Error(error);
    }finally{ return true }
  },
  
  
});