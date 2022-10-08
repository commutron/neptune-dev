Meteor.methods({

  createEquipment(eqname, alias, brKey, instruct, library) {
    
    let duplicate = EquipDB.findOne({equip: eqname},{fields:{'_id':1}});
    const dupe = EquipDB.findOne({alias: alias},{fields:{'_id':1}});
    
    const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','create']);
    
    if(!duplicate && !dupe && auth) {
      EquipDB.insert({
        equip: eqname,
        alias: alias,
        branchKey: brKey,
        orgKey: Meteor.user().orgKey,
        createdAt: new Date(),
        createdWho: Meteor.userId(),
  			updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
  			online: true,
        instruct: instruct,
        library: library,
        stewards: [],
        service: [],
        issues: []
      });
      return true;
    }else{
      return false;
    }
  },

  editEquipment(eqId, newEqname, newAlias, brKey, instruct, library) {
    const doc = EquipDB.findOne({_id: eqId},{fields:{'equip':1,'alias':1}});
    
    let duplicate = EquipDB.findOne({equip: newEqname},{fields:{'_id':1}});
    let dupe = EquipDB.findOne({alias: newAlias});
    
    doc.equip === newEqname ? duplicate = false : null;
    doc.alias === newAlias ? dupe = false : null;
    
    const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
    
    if(!duplicate && !dupe && auth) {
      let setBr = !brKey || brKey === 'false' ? false : brKey;
      
      EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey}, {
        $set : {
          equip: newEqname,
          alias: newAlias,
          branchKey: setBr,
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  instruct: instruct,
  			  library: library
        }});
      return true;
    }else{
      return false;
    }
  },
  
  onofflineEquipment(eqId, line) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
    const accessKey = Meteor.user().orgKey;
    
    if(auth) {
      EquipDB.update({_id: eqId, orgKey: accessKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  online: line
        }});
      const eq = EquipDB.findOne({_id: eqId, orgKey: accessKey});
      for(let sv of eq.service) {
        Meteor.defer( ()=>{
          Meteor.call('pmUpdate', eqId, sv.serveKey, accessKey);
        });
      }
      return true;
    }else{
      return false;
    }
  },
  
  hibernateEquipment(eqId, hibernate) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
    const accessKey = Meteor.user().orgKey;
    
    if(auth) {
      EquipDB.update({_id: eqId, orgKey: accessKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  hibernate: hibernate
        }});
      if(hibernate === true) {
        MaintainDB.remove({equipId: eqId, status: false});
      }else{
        const eq = EquipDB.findOne({_id: eqId, orgKey: accessKey});
        for(let sv of eq.service) {
          Meteor.defer( ()=>{
            Meteor.call('pmUpdate', eqId, sv.serveKey, accessKey);
          });
        }
      }
      return true;
    }else{
      return false;
    }
  },
  
  stewardEquipment(eqId, stewArr) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','peopleSuper','edit']);
    const arry = Array.isArray(stewArr); // user IDs
    
    if(auth && arry) {
      EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  stewards: stewArr
  			}});
      return true;
    }else{
      return false;
    }
  },
  
  addServicePattern(eqId, name, timeSpan, pivot, next, recur, period, grace) {
    if( Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']) ) {
      const accessKey = Meteor.user().orgKey;
      const serveKey = new Meteor.Collection.ObjectID().valueOf();
      
      const whenOf = typeof pivot === 'string' ? pivot : Number(pivot);
      
      EquipDB.update({_id: eqId, orgKey: accessKey}, {
        $push : {
          service: { 
            serveKey: serveKey,
            updatedAt: new Date(),
            name: name,
            timeSpan: timeSpan, // 'day', 'week', month, 'year'
            whenOf: whenOf, // 'endOf', // 1, 2, 3, ..., 'startOf'
            nextAt: next,
            recur: Number(recur),
            period: Number(period), // 1, 6, 30 // in days
            grace: Number(grace), // in days
            tasks: []
          }
        }});
      Meteor.defer( ()=>{
        Meteor.call('pmUpdate', eqId, serveKey, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },

  editServicePattern(eqId, serveKey, name, timeSpan, pivot, next, recur, period, grace) {
    if(Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit'])) {
      const accessKey = Meteor.user().orgKey;
      
      const whenOf = typeof pivot === 'string' ? pivot : Number(pivot);
      
      EquipDB.update({_id: eqId, orgKey: accessKey, 'service.serveKey': serveKey}, {
        $set : {
          'service.$.updatedAt': new Date(),
          'service.$.name': name,
          'service.$.timeSpan': timeSpan,
          'service.$.whenOf': whenOf,
          'service.$.nextAt': next,
          'service.$.recur': Number(recur),
          'service.$.period': Number(period),
          'service.$.grace': Number(grace)
        }});
      Meteor.defer( ()=>{
        Meteor.call('pmUpdate', eqId, serveKey, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  
  removeServicePattern(eqId, serveKey) {
    if(Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit'])) {
      EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey, 'service.serveKey': serveKey}, {
        $pull : { service: { serveKey: serveKey }
      }});
      MaintainDB.remove({equipId: eqId, serveKey: serveKey, status: false});
      return true;
    }else{
      return false;
    }
  },
  
  setServiceTasks(eqId, serveKey, tasksArr) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
    
    if(auth && Array.isArray(tasksArr)) {
      EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey, 'service.serveKey': serveKey}, {
        $set : {
          'service.$.updatedAt': new Date(),
          'service.$.tasks': tasksArr
        }});
      return true;
    }else{
      return false;
    }
  },
  
  addEqIssue(eqId, title, logtext) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      const accessKey = Meteor.user().orgKey;
      const newKey = new Meteor.Collection.ObjectID().valueOf();
      
      EquipDB.update({_id: eqId, orgKey: accessKey}, {
        $push : {
          issues: { 
            issueKey: newKey,
            createdAt: new Date(),
            createdWho: Meteor.userId(),
            updatedAt: new Date(),
            title: title,
            open: true, // true-wip / false-resolved
            problog: [{
              time: new Date(),
              who: Meteor.userId(),
              text: logtext,
            }]
          }
        }});
      
      return true;
    }else{
      return false;
    }
  },
  
  editEqIssueTitle(eqId, iKey, title) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      
      EquipDB.update({_id: eqId, 'issues.issueKey': iKey, 'issues.createdWho': Meteor.userId()}, {
        $set : {
          'issues.$.updatedAt': new Date(),
          'issues.$.title': title
        }});
      
      return true;
    }else{
      return false;
    }
  },
  editEqIssueState(eqId, iKey, open) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {

      EquipDB.update({_id: eqId, 'issues.issueKey': iKey}, {
        $set : {
          'issues.$.updatedAt': new Date(),
          'issues.$.open': open, // true-wip / false-resolved 
      }});
      
      return true;
    }else{
      return false;
    }
  },
  
  logEqIssue(eqId, iKey, text) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      const accessKey = Meteor.user().orgKey;
    
      EquipDB.update({_id: eqId, orgKey: accessKey, 'issues.issueKey': iKey}, {
          $set : {
            'issues.$.updatedAt': new Date(),
          },
          $push : { 'issues.$.problog': {
            time: new Date(),
            who: Meteor.userId(),
            text: text,
        }}});
      return true;
    }else{
      return false;
    }
  },
  
  assignTimeToIssue(tideKey, issueKey) {
    const time = TimeDB.findOne({ _id: tideKey },{ fields: {'who':1, 'project':1} });
      
    if(time) {
      const authT = time.who === Meteor.userId();
      if(!authT) {
        return false;
      }else{
        const append = !issueKey ? time.project.split("[+]")[0] : time.project + "[+]" + issueKey;
        
        TimeDB.update({ _id: tideKey }, {
          $set : { 
            project : append
        }});
        return true;
      }
    }
  },
  
  backdateEqIssue(eqId, title, logtext, date, userID, wip) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      const accessKey = Meteor.user().orgKey;
      const newKey = new Meteor.Collection.ObjectID().valueOf();
      
      EquipDB.update({_id: eqId, orgKey: accessKey}, {
        $push : {
          issues: { 
            issueKey: newKey,
            createdAt: new Date(date),
            createdWho: userID,
            updatedAt: new Date(date),
            title: title,
            open: wip,
            problog: [{
              time: new Date(date),
              who: userID,
              text: logtext,
            }]
          }
        }});
      return true;
    }else{
      return false;
    }
  },
  
  countOpenEqIssue() {
    let open = 0;
    EquipDB.find({},{ fields: {'issues.open':1} })
      .forEach( eq => {
        open += (eq.issues || []).filter( i => i.open).length;
      });
    return open;
  },
  
  getEqIssueTime(eqID, issKey) {
    const assignedKey = "\\[\\+\\]" + issKey;

    return TimeDB.find(
                    { 
                      link: eqID, 
                      project: { $regex: new RegExp( assignedKey ) }
                    }, 
                    { fields: {
                      'who':1,
                      'startTime':1, 
                      'stopTime':1
                    }
                  }).fetch();
  },
  
  /*
   modEqlog(eqId, iKey, logtime, logObj) {
    try {
      const accessKey = Meteor.user().orgKey;
      if(typeof logObj === 'object' && Roles.userIsInRole(Meteor.userId(), 'admin')) {
        
        const pulllog = ()=> {
          return new Promise(function(resolve) {
            EquipDB.update({_id: eqId, orgKey: accessKey, 'issues.issueKey': iKey}, {
              $pull : {
                'issues.$.problog': { time: logtime }
            }});
            resolve(true);
          });
        };
        
        const pushlog = ()=> {
          EquipDB.update({_id: eqId, orgKey: accessKey, 'issues.issueKey': iKey}, {
            $push : {
              'issues.$.problog': logObj
          }});
        };
            
        pulllog()
          .then(pushlog())
            .finally(()=> { return true });
      }else{
        return false;
      }
    }catch (error) {
      throw new Meteor.Error(error);
    }
  },
  */
  deleteEquipment(eqId) {
    const equip = EquipDB.findOne({_id: eqId},{fields:{'issues':1}});
    const usedIS = equip.issues && equip.issues.length > 0;
    
    const usedPM = MaintainDB.findOne({equipId: eqId},{fields:{'_id':1}});
    
    if(!usedIS && !usedPM) {
      const access = Roles.userIsInRole(Meteor.userId(), 'remove');
      
      if(access) {
        EquipDB.remove(eqId);
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  }
  
});