Meteor.methods({
//// For a Person \\\\\

  getEngagedBlocks(userTkeys) {
    if(Array.isArray(userTkeys) === false) {
      return false;
    }else{
      let objArr = [];
      for( let uTkey of userTkeys ) {
        const batchX = XBatchDB.findOne(
          { 'tide.tKey': uTkey },
          { fields: {'batch':1,'tide':1} });
        const subX = batchX && batchX.tide.find( x => x.tKey === uTkey);
       
        if(subX) {
          objArr.push({
            uID: subX.who,
            batch: batchX.batch,
            tideBlock: subX
          });
        }else{
          const timeZ = timeDB.findOne({ '_id': uTkey });
          if(timeZ) {
            objArr.push({
              uID: timeZ.who,
              batch: timeZ.project,
              tideBlock: timeZ
            });
          }else{null}
        }
      }
      return JSON.stringify(objArr);
    }
  },

  // RECORD
  // Always call with 'apply' noretry wait
  startTimeSpan(type, link, project, newTask, newSubTask) {
    
    const user = Meteor.user();
    const spinning = user && user.engaged;
    const notactive = !Roles.userIsInRole(Meteor.userId(), 'active');
      
    if(!Meteor.user()?.orgKey || spinning || notactive) {
      return false;
    }else{
      // PROX = XBatch = batch
      // MLTI = 3x XBatch = batch
      // MAINT = Maintain ID = equip_alias maint_name
      // EQFX = "EquipRepair" = equip_alias
      // // focus: 1,2,3
      
      const taskVal = !newTask || newTask === 'false' ? false : newTask;
      const subtVal = !newSubTask || newSubTask === 'false' ? false : newSubTask;
      
      // TimeDB.remove({});

      const newDocId = TimeDB.insert({
        type: type,
        link: link,
        project: project,
        who: Meteor.userId(),
        startTime: new Date(),
        stopTime: false,
        task: taskVal,
        subtask: subtVal
      });
      
      Meteor.users.update(Meteor.userId(), {
        $set: {
          engaged: {
            task: type,
            tKey: newDocId,
            tName: project,
            tTask: taskVal,
            tSubt: subtVal
          }
        }
      });
      return true;
    }
  },
  
  // Always call with 'apply' noretry wait
  stopTimeSpan(tId) {
    const user = Meteor.user();
    if(tId && user) {
      TimeDB.update(tId, {
        $set: {
          stopTime: new Date(),
        }
      });
      
      const proj = user.engaged?.tName;
      
      Meteor.users.update(Meteor.userId(), {
        $set: {
          engaged: false
        },
        $push: {
          tidepools: { $each: [ proj ], $position: 0, $slice: 5 }
        }
      });    
      return true;
    }else{
      return false;
    }
  },
  
  // Always call with 'apply' noretry wait
  switchTimeSpan(nowId, type, link, project, newTask, newSubTask) {
    try {
      
      const stopFirst = (id)=> {
        return new Promise(function(resolve, reject) {
          Meteor.call('stopTimeSpan', id, (err, re)=>{
            err && reject(err);
            re && resolve('Success');
          });
        });
      };
      
      const startSecond = (typ, lnk, proj, nTsk, nSbTsk)=> {
        Meteor.call('startTimeSpan', typ, lnk, proj, nTsk, nSbTsk, (err, re)=>{
          err && new Meteor.Error(err);
          if(re) { return true }
        });
      };
      
      stopFirst(nowId)
        .then(startSecond(type, link, project, newTask, newSubTask))
        .finally(()=> { return true });

    }catch (error) {
      throw new Meteor.Error(error);
    }finally{ return true }
  },
  
  // Always call with 'apply' noretry wait
  startTideTask(batchId, newTkey, newTask, newSubTask) {
    try {
      const orgKey = Meteor.user().orgKey;
      
      const user = Meteor.user();
      const spinning = user && user.engaged;
      const notactive = !Roles.userIsInRole(Meteor.userId(), 'active');
      
      if(typeof newTkey !== 'string' || spinning || notactive) {
        null;
      }else{
        
        const docX = XBatchDB.findOne(
          { _id: batchId, orgKey: orgKey },
          { fields: {'batch':1,'tide':1} }
        );
        
        if(docX && docX.tide) {
          const keyChecX = docX.tide.every( x => x.tKey !== newTkey );
      
          if(!keyChecX) { 
            null;
          }else{
            const taskVal = !newTask || newTask === 'false' ? false : newTask;
            const subtVal = !newSubTask || newSubTask === 'false' ? false : newSubTask;
            
            XBatchDB.update({ _id: batchId }, {
              $push : { tide: { 
                tKey: newTkey,
                who: Meteor.userId(),
                startTime: new Date(),
                stopTime: false,
                task: taskVal,
                subtask: subtVal
            }}});
            Meteor.users.update(Meteor.userId(), {
              $set: {
                engaged: {
                  task: 'PROX',
                  tKey: newTkey,
                  tName: docX.batch,
                  tTask: taskVal,
                  tSubt: subtVal
                }
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
  // Always call with 'apply' noretry wait
  stopTideTask(tideKey) {
    try {
      const docX = XBatchDB.findOne({ 
        'tide.tKey': tideKey, 
        'tide.who': Meteor.userId() 
      },{
        fields: { 'batch': 1 }
      });
      
      if(docX) {
        const batchIDx = docX._id || false;
        if(batchIDx) {
          XBatchDB.update({
            _id: batchIDx,
            'tide.tKey': tideKey
          }, {
            $set : { 
              'tide.$.stopTime' : new Date()
          }});
          Meteor.users.update(Meteor.userId(), {
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
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  // Always call with 'apply' noretry wait
  switchTideTask(tideKey, newbatchID, newTkey, newTask, newSubTask) {
    try {

      const stopFirst = (tKey)=> {
        return new Promise(function(resolve, reject) {
          Meteor.call('stopTideTask', tKey, (err, re)=>{
            err && reject(err);
            re && resolve('Success');
          });
        });
      };
      
      const startSecond = (nbID, nTky, nTsk, nSbTsk)=> {
        Meteor.call('startTideTask', nbID, nTky, nTsk, nSbTsk, (err, re)=>{
          err && new Meteor.Error(err);
          if(re) { return true }
        });
      };
      
      stopFirst(tideKey)
        .then(startSecond(newbatchID, newTkey, newTask, newSubTask))
        .finally(()=> { return true });

    }catch (error) {
      throw new Meteor.Error(error);
    }finally{ return true }
  },
  
  // CHANGE
  
  editTideTimeBlock(batch, tideKey, newStart, newStop, taskIs, subtIs) {
    try {
      if(!newStart || !newStop) {
        return false;
      }else{
        
        const docX = XBatchDB.findOne(
          { batch: batch, 'tide.tKey': tideKey },
          { fields: {'batch':1,'tide':1} }
        );
        
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
                'tide.$.task' : taskVal,
                'tide.$.subtask' : subtIs
            }});
            return true;
          }
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  setTideTimeTask(batch, tideKey, taskIs) {
    try {
      const accessKey = Meteor.user().orgKey;
      const userId = Meteor.userId();
      const isSuper = Roles.userIsInRole(userId, 'peopleSuper');
      
      const docX = XBatchDB.findOne(
        { batch: batch, 'tide.tKey': tideKey },
        { fields: {'tide':1} }
      );
      
      if(docX) {
        const subX = docX.tide.find( x => x.tKey === tideKey );
        const authX = subX.who === userId || isSuper;
        if(!authX) {
          return false;
        }else{
          const taskVal = !taskIs || taskIs === 'false' ? false : taskIs;
          XBatchDB.update({ batch: batch, orgKey: accessKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.task' : taskVal,
              'tide.$.subtask' : false
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
      const docX = XBatchDB.findOne(
        { batch: batch, 'tide.tKey': tideKey },
        { fields: {'tide':1} }
      );
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
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  // Always call with 'apply' noretry wait
  splitTideTimeBlock(batch, tideKey, newSplit, stopTime) {
    try {
      if(!newSplit || !stopTime) {
        return false;
      }else{
        
        const docX = XBatchDB.findOne(
          { batch: batch, 'tide.tKey': tideKey },
          { fields: {'tide':1} }
        );
        
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
                task: subX.task,
                subtask: subX.subtask || false
            }}});
            return true;
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