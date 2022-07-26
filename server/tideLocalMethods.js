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
          const timeZ = TimeDB.findOne({ '_id': uTkey });
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
          tidepools: { $each: [ proj ], $position: 0, $slice: 10 }
        }
      });    
      return true;
    }else{
      return false;
    }
  },
  
  // Always call with 'apply' noretry wait
  switchTimeSpan(nowId, isPROX, type, link, project, newTask, newSubTask) {
    try {
      
      const stopTime = (id)=> {
        return new Promise(function(resolve, reject) {
          Meteor.call('stopTimeSpan', id, (err, re)=>{
            err && reject(err);
            re && resolve('Success');
          });
        });
      };
      const stopTide = (tKey)=> {
        return new Promise(function(resolve, reject) {
          Meteor.call('stopTideTask', tKey, (err, re)=>{
            err && reject(err);
            re && resolve('Success');
          });
        });
      };
      
      const startTime = (typ, lnk, proj, nTsk, nSbTsk)=> {
        Meteor.call('startTimeSpan', typ, lnk, proj, nTsk, nSbTsk, (err, re)=>{
          err && new Meteor.Error(err);
          if(re) { return true }
        });
      };
      
      if(isPROX) {
        stopTide(nowId)
          .then(startTime(type, link, project, newTask, newSubTask))
          .finally(()=> { return true });
      }else{
        stopTime(nowId)
          .then(startTime(type, link, project, newTask, newSubTask))
          .finally(()=> { return true });
      }

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
              tidepools: { $each: [docX.batch], $position: 0, $slice: 10 }
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
  switchTideTask(tideKey, isPROX, newbatchID, newTkey, newTask, newSubTask) {
    try {

      const stopTide = (tKey)=> {
        return new Promise(function(resolve, reject) {
          Meteor.call('stopTideTask', tKey, (err, re)=>{
            err && reject(err);
            re && resolve('Success');
          });
        });
      };
      const stopTime = (id)=> {
        return new Promise(function(resolve, reject) {
          Meteor.call('stopTimeSpan', id, (err, re)=>{
            err && reject(err);
            re && resolve('Success');
          });
        });
      };
      
      const startTide = (nbID, nTky, nTsk, nSbTsk)=> {
        Meteor.call('startTideTask', nbID, nTky, nTsk, nSbTsk, (err, re)=>{
          err && new Meteor.Error(err);
          if(re) { return true }
        });
      };
      
      if(isPROX) {
        stopTide(tideKey)
          .then(startTide(newbatchID, newTkey, newTask, newSubTask))
          .finally(()=> { return true });
      }else{
        stopTime(tideKey)
          .then(startTide(newbatchID, newTkey, newTask, newSubTask))
          .finally(()=> { return true });
      }

    }catch (error) {
      throw new Meteor.Error(error);
    }finally{ return true }
  },
  
  // MULTI
  
  startMultiTideTask(batch1, newTkey1, newTask1, newSubTask1, batch2, newTkey2, newTask2, newSubTask2) {
    // try {
      const orgKey = Meteor.user().orgKey;
      
      const user = Meteor.user();
      const spinning = user?.engaged;
      const special = Roles.userIsInRole(Meteor.userId(), 'multitask_time');
      
      if(typeof newTkey1 !== 'string' || typeof newTkey2 !== 'string' || spinning || !special) {
        return true;
      }else{
        
        const docX1 = XBatchDB.findOne({ batch: batch1, orgKey: orgKey }, { fields: {'tide':1} });
        const docX2 = XBatchDB.findOne({ batch: batch2, orgKey: orgKey }, { fields: {'tide':1} });
        
        if(docX1?.tide && docX2?.tide) {
          const keyChecX1 = docX1.tide.every( x => x.tKey !== newTkey1 );
          const keyChecX2 = docX2.tide.every( x => x.tKey !== newTkey2 );
      
          if(!keyChecX1 || !keyChecX2) { 
            null;
          }else{
            const taskVal1 = !newTask1 || newTask1 === 'false' ? false : newTask1;
            const subtVal1 = !newSubTask1 || newSubTask1 === 'false' ? false : newSubTask1;
            
            XBatchDB.update({ _id: docX1._id }, {
              $push : { tide: { 
                tKey: newTkey1,
                who: Meteor.userId(),
                startTime: new Date(),
                stopTime: false,
                task: taskVal1,
                subtask: subtVal1,
                focus: 2
            }}});
            
            const taskVal2 = !newTask2 || newTask2 === 'false' ? false : newTask2;
            const subtVal2 = !newSubTask2 || newSubTask2 === 'false' ? false : newSubTask2;
            
            XBatchDB.update({ _id: docX2._id }, {
              $push : { tide: { 
                tKey: newTkey2,
                who: Meteor.userId(),
                startTime: new Date(),
                stopTime: false,
                task: taskVal2,
                subtask: subtVal2,
                focus: 2
            }}});
            
            Meteor.users.update(Meteor.userId(), {
              $set: {
                engaged: {
                  task: 'MLTI',
                  tKey: [ newTkey1, newTkey2 ],
                  tName: [ batch1, batch2 ],
                  tTask: [ taskVal1, taskVal2 ],
                  tSubt: [ subtVal1, subtVal2 ]
                }
              }
            });
            return true;
          }
        }
      }
    // }catch (err) {
    //   throw new Meteor.Error(err);
    // }
  },
  
  stopMultiTideTask(tideKey1, tideKey2) {
    // try {
      const docX1 = XBatchDB.findOne({ 
        'tide.tKey': tideKey1, 'tide.who': Meteor.userId() 
      },{
        fields: { 'batch': 1 }
      });
      const docX2 = XBatchDB.findOne({ 
        'tide.tKey': tideKey2, 'tide.who': Meteor.userId() 
      },{
        fields: { 'batch': 1 }
      });
      
      if(docX1 && docX2) {
        const batchIDx1 = docX1._id;
        if(batchIDx1) {
          XBatchDB.update({
            _id: batchIDx1,
            'tide.tKey': tideKey1
          }, {
            $set : { 
              'tide.$.stopTime' : new Date()
          }});
        }
        
        const batchIDx2 = docX2._id;
        if(batchIDx2) {
          XBatchDB.update({
            _id: batchIDx2,
            'tide.tKey': tideKey2
          }, {
            $set : { 
              'tide.$.stopTime' : new Date()
          }});
        }
        Meteor.users.update(Meteor.userId(), {
          $set: {
            engaged: false
          },
          $push: {
            tidepools: { $each: [docX1.batch, docX2.batch], $position: 0, $slice: 10 }
          }
        });    
        return true;
      }
    // }catch (err) {
    //   throw new Meteor.Error(err);
    // }
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