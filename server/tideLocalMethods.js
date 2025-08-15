const matchUserToTime = (uTkey)=> {
  const batchX = XBatchDB.findOne(
    { 'tide.tKey': uTkey },
    { fields: {'batch':1,'tide':1} });
  const subX = batchX?.tide.find( x => x.tKey === uTkey);
        
  if(subX) {
    return {
      uID: subX.who,
      batch: batchX.batch,
      tideBlock: subX
    };
  }else{
    const timeZ = TimeDB.findOne({ '_id': uTkey });
    if(timeZ) {
      return {
        uID: timeZ.who,
        project: timeZ.project,
        tideBlock: timeZ
      };
    }else{
      return false;
    }
  }
};

Meteor.methods({
//// For a Person \\\\\
  
  getEngagedBlocks(userTkeys) {
    if(Array.isArray(userTkeys) === false) {
      return false;
    }else{
      let objArr = [];
      for( let uTkey of userTkeys ) {
        if(Array.isArray(uTkey)) {
          for(let uT of uTkey ) {
            objArr.push( matchUserToTime(uT) );
          }
        }else{
          const match = matchUserToTime(uTkey);
          if(match) {
            objArr.push(match);
          }else{null}
        }
      }
      return JSON.stringify(objArr);
    }
  },

  // RECORD - Always call with 'apply'
  startTimeSpan(type, link, project, newTask, newSubTask) {
    
    const user = Meteor.user();
    const spinning = user && user.engaged;
    const notactive = !Roles.userIsInRole(Meteor.userId(), 'active');
      
    if(spinning || notactive) {
      return false;
    }else{
      // PROX = XBatch = batch
      // MLTI = 3x XBatch = batch
      // MAINT = Maintain ID = equip_alias maint_name
      // EQFX = "EquipRepair" = equip_alias
      // focus: 1,2,3
      
      const taskVal = !newTask || newTask === 'false' ? false : newTask;
      const subtVal = !newSubTask || newSubTask === 'false' ? false : newSubTask;
      
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

  startTideTask(batchId, newTkey, newTask, newSubTask) {
    try {
      const user = Meteor.user();
      const spinning = user && user.engaged;
      const notactive = !Roles.userIsInRole(Meteor.userId(), 'active');
      
      if(typeof newTkey !== 'string' || spinning || notactive) {
        return false;
      }else{
        
        const docX = XBatchDB.findOne(
          { _id: batchId },
          { fields: {'batch':1,'tide':1} }
        );
        
        if(docX && docX.tide) {
          const keyChecX = docX.tide.every( x => x.tKey !== newTkey );
      
          if(!keyChecX) { 
            return false;
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
        }else{
          return false;
        }
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },

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
  
  startMultiTideTask(batch1, newTkey1, newTask1, newSubTask1, batch2, newTkey2, newTask2, newSubTask2) {
    try {
      const orgKey = Meteor.user().orgKey;
      
      const user = Meteor.user();
      const spinning = user?.engaged;
      const special = Roles.userIsInRole(Meteor.userId(), 'multitask_time');
      
      if(typeof newTkey1 !== 'string' || typeof newTkey2 !== 'string' || spinning || !special) {
        return false;
      }else{
        
        const docX1 = XBatchDB.findOne({ batch: batch1, orgKey: orgKey }, { fields: {'tide':1} });
        const docX2 = XBatchDB.findOne({ batch: batch2, orgKey: orgKey }, { fields: {'tide':1} });
        
        if(docX1?.tide && docX2?.tide) {
          const keyChecX1 = docX1.tide.every( x => x.tKey !== newTkey1 );
          const keyChecX2 = docX2.tide.every( x => x.tKey !== newTkey2 );
      
          if(!keyChecX1 || !keyChecX2) { 
            return false;
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
        }else{
          return false;
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  stopMultiTideTask(tideKey1, tideKey2) {
    try {
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
        XBatchDB.update({
          _id: docX1._id,
          'tide.tKey': tideKey1
        }, {
          $set : { 
            'tide.$.stopTime' : new Date()
        }});
        
        XBatchDB.update({
          _id: docX2._id,
          'tide.tKey': tideKey2
        }, {
          $set : { 
            'tide.$.stopTime' : new Date()
        }});

        Meteor.users.update(Meteor.userId(), {
          $set: {
            engaged: false
          },
          $push: {
            tidepools: { $each: [docX1.batch, docX2.batch], $position: 0, $slice: 10 }
          }
        });    
        return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  editTideTimeBlock(dbHome, tideKey, newStart, newStop, taskIs, subtIs) {
    try {
      const pplSup = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
      if(!newStart || !newStop) {
        return false;
      }else if(dbHome) {
        
        const docX = XBatchDB.findOne(
          { batch: dbHome, 'tide.tKey': tideKey },
          { fields: {'batch':1,'tide':1} }
        );
        
        if(docX) {
          const subX = docX.tide.find( x => x.tKey === tideKey );
          const authX = subX.who === Meteor.userId() || pplSup;
          if(!authX) {
            return false;
          }else{
            const taskVal = !taskIs || taskIs === 'false' ? false : taskIs;
            XBatchDB.update({ batch: dbHome, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
              $set : { 
                'tide.$.startTime' : new Date(newStart),
                'tide.$.stopTime' : new Date(newStop),
                'tide.$.task' : taskVal,
                'tide.$.subtask' : subtIs
            }});
            return true;
          }
        }
      }else{
        const time = TimeDB.findOne({ _id: tideKey },{ fields: {'who':1} });
        
        if(time) {
          const authT = time.who === Meteor.userId() || pplSup;
          if(!authT) {
            return false;
          }else{
            // const taskVal = !taskIs || taskIs === 'false' ? false : taskIs;
            TimeDB.update({ _id: tideKey }, {
              $set : { 
                startTime : new Date(newStart),
                stopTime : new Date(newStop),
                // task : taskVal,
                // subtask : subtIs
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
  
  stopTideTimeBlock(dbHome, tideKey) {
    try {
      const pplSup = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
      if(dbHome) {
        const docX = XBatchDB.findOne(
          { batch: dbHome, 'tide.tKey': tideKey },
          { fields: {'tide':1} }
        );
        if(docX) {
      
          const subX = docX.tide.find( x => x.tKey === tideKey );
          const authX = subX.who === Meteor.userId() || pplSup;
  
          if( subX.stopTime !== false || !authX ) {
            return false;
          }else{
            XBatchDB.update({ batch: dbHome, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
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
      }else{
        const time = TimeDB.findOne({ _id: tideKey },{ fields: {'who':1} });
        
        if(time) {
          const authT = time.who === Meteor.userId() || pplSup;
          if(!authT) {
            return false;
          }else{
            TimeDB.update({ _id: tideKey }, {
              $set : { 
                stopTime : new Date()
            }});
            Meteor.users.update(time.who, {
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

  splitTideTimeBlock(dbHome, tideKey, newSplit, stopTime) {
    try {
      const pplSup = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
      if(!newSplit || !stopTime) {
        return false;
      }else if(dbHome) {
        
        const docX = XBatchDB.findOne(
          { batch: dbHome, 'tide.tKey': tideKey },
          { fields: {'tide':1} }
        );
          
        if(docX) {
          const subX = docX.tide.find( x => x.tKey === tideKey );
          const authX = subX.who === Meteor.userId() || pplSup;
          if(!authX) {
            return false;
          }else{
            XBatchDB.update({ batch: dbHome, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
              $set : { 
                'tide.$.stopTime' : new Date(newSplit)
            }});
            const newTkeyX = new Meteor.Collection.ObjectID().valueOf();
            XBatchDB.update({ batch: dbHome, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
              $push : { tide: { 
                tKey: newTkeyX,
                who: subX.who,
                startTime: new Date(newSplit),
                stopTime: new Date(stopTime),
                task: subX.task,
                subtask: subX.subtask || false,
                focus: subX.focus || null
            }}});
            return true;
          }
        }
      }else{
        const time = TimeDB.findOne({ _id: tideKey });
      
        if(time) {
          const authT = time.who === Meteor.userId() || pplSup;
          if(!authT) {
            return false;
          }else{
            TimeDB.update({ _id: tideKey }, {
              $set : { 
                stopTime : new Date(newSplit)
            }});
            TimeDB.insert({
              type: time.type,
              link: time.link,
              project: time.project,
              who: time.who,
              startTime: new Date(newSplit),
              stopTime: new Date(stopTime),
              task: time.task,
              subtask: time.subtask || false
            });
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
  
  checktaskrec() {
    let taskSet = new Set();
    let subSet = new Set();
    
    XBatchDB.find({ tide: {$exists: true} },{fields:{'tide.task':1,'tide.subtask':1}})
    .forEach( x => {
      x.tide.map( y => {
        y.task && taskSet.add(y.task);
        y.subtask && subSet.add(y.subtask);
      });
    });
    
    let opSet = new Set();
    
    AppDB.find({},{fields:{'branches':1}})
    .forEach( x => {
      x.branches.map( y => {
        if(y.subTasks) {
          y.subTasks.map( z => {
            opSet.add(z);
          });
        }
      });
    });  
    
    const tasks = [...taskSet];
    
    const subs = [...subSet];
    const ops = [...opSet];
    
    const stillOp = _.intersection(ops, subs);
    
    const neverUsedOp = _.difference(ops, subs);
    const notInOp = _.difference(subs, ops);
    
    
    return { tasks, subs, ops, stillOp, neverUsedOp, notInOp };
                
  }
  
});