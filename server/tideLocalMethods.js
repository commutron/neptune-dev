import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';


Meteor.methods({


//// For a Person \\\\\

  getEngagedBlocks(userTkeys) {
    if(Array.isArray(userTkeys) === false) {
      return false;
    }else{
      let objArr = [];
      for( let uTkey of userTkeys ) {
        const batch = BatchDB.findOne({ 'tide.tKey': uTkey });
        const sub = batch && batch.tide.find( x => x.tKey === uTkey);
        if(sub) {
          objArr.push({
            uID: sub.who,
            batch: batch.batch,
            tideBlock: sub
          });
        }else{
          const batchX = XBatchDB.findOne({ 'tide.tKey': uTkey });
          const subX = batchX && batchX.tide.find( x => x.tKey === uTkey);
          if(subX) {
            objArr.push({
              uID: subX.who,
              batch: batchX.batch,
              tideBlock: subX
            });
          }else{null}
        }
      }
      return JSON.stringify(objArr);
    }
  },

  
  // RECORD
  
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
                  tKey: newTkey,
                  tName: doc.batch,
                  tTask: newTask
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
                    tKey: newTkey,
                    tName: docX.batch,
                    tTask: newTask
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
            },
            $push: {
              tidepools: { $each: [doc.batch], $position: 0, $slice: 5 }
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
              },
              $push: {
                tidepools: { $each: [docX.batch], $position: 0, $slice: 5 }
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
  
  
  
  // CHANGE
  
  editTideTimeBlock(batch, tideKey, newStart, newStop, taskIs) {
    try {
      if(!newStart || !newStop) {
        return false;
      }else{
        
        const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
        if(doc) {
          const sub = doc.tide.find( x => x.tKey === tideKey );
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
        }else{
          const docX = XBatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
          if(docX) {
            const subX = docX.tide.find( x => x.tKey === tideKey );
            const authX = subX.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
            if(!authX) {
              return false;
            }else{
              const taskVal = !taskIs || taskIs === 'false' ? false : taskIs;
              XBatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
                $set : { 
                  'tide.$.startTime' : newStart,
                  'tide.$.stopTime' : newStop,
                  'tide.$.task' : taskVal
              }});
              return true;
            }
          }
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  stopTideTimeBlock(batch, tideKey) {
    try {
      const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
      if(doc) {
        const sub = doc.tide.find( x => x.tKey === tideKey );
        const auth = sub.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');

        if( sub.stopTime !== false || !auth ) {
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
      }else{
        const docX = XBatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
        if(docX) {
      
          const subX = docX.tide.find( x => x.tKey === tideKey );
          const authX = subX.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');

          if( subX.stopTime !== false || !authX ) {
            return false;
          }else{
            XBatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
              $set : { 
                'tide.$.stopTime' : new Date()
            }});
            Meteor.users.update(subX.who, {
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
  
  splitTideTimeBlock(batch, tideKey, newSplit, stopTime) {
    try {
      if(!newSplit || !stopTime) {
        return false;
      }else{
        const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
        
        if(doc) {
          const sub = doc.tide.find( x => x.tKey === tideKey );
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
        }else{
          const docX = XBatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
          
          if(docX) {
            const subX = docX.tide.find( x => x.tKey === tideKey );
            const authX = subX.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
            if(!authX) {
              return false;
            }else{
              XBatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
                $set : { 
                  'tide.$.stopTime' : newSplit
              }});
              const newTkeyX = new Meteor.Collection.ObjectID().valueOf();
              XBatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
                $push : { tide: { 
                  tKey: newTkeyX,
                  who: subX.who,
                  startTime: newSplit,
                  stopTime: stopTime,
                  task: subX.task
              }}});
              return true;
            }
          }
        }
      }
    }catch (err) {
       throw new Meteor.Error(err);
    }
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