// import { Random } from 'meteor/random';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { syncLocale } from '/server/utility.js';
import Config from '/server/hardConfig.js';

const nextService = (sv)=> {
  const st = moment(sv.nextAt).tz(Config.clientTZ);
  
  let next = sv.whenOf === 'endOf' ? st.endOf(sv.timeSpan) :
              sv.whenOf === 'startOf' ? st.startOf(sv.timeSpan) :
              sv.timeSpan === 'week' ? st.day(sv.whenOf).endOf('day') :
              sv.timeSpan === 'month' ? st.date(sv.whenOf).endOf('day') :
                                        st.month(sv.whenOf).endOf('month');
  
  while(true) {
    if(next.isSameOrAfter(new Date())) {
      return new Date(next.format());
    }else{
      next.add(sv.recur, sv.timeSpan);
    }
  }
};

  
Meteor.methods({


// EquipDB = new Mongo.Collection('equipdb');
// MaintainDB = new Mongo.Collection('maintaindb');
  
  createEquipment(eqname, alias, brKey, instruct) {
    
    let duplicate = EquipDB.findOne({equip: eqname},{fields:{'_id':1}});
    const dupe = EquipDB.findOne({alias: alias},{fields:{'_id':1}});
    
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    
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
        stewards: [],
        service: []
      });
      return true;
    }else{
      return false;
    }
  },

  editEquipment(eqId, newEqname, newAlias, brKey, instruct) {
    const doc = EquipDB.findOne({_id: eqId},{fields:{'equip':1,'alias':1}});
    
    let duplicate = EquipDB.findOne({equip: newEqname},{fields:{'_id':1}});
    let dupe = EquipDB.findOne({alias: newAlias});
    
    doc.equip === newEqname ? duplicate = false : null;
    doc.alias === newAlias ? dupe = false : null;
    
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    
    if(!duplicate && !dupe && auth) {
      let setBr = !brKey || brKey === 'false' ? false : brKey;
      
      EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey}, {
        $set : {
          equip: newEqname,
          alias: newAlias,
          branchKey: setBr,
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  instruct: instruct
        }});
      return true;
    }else{
      return false;
    }
  },
  
  onofflineEquipment(eqId, line) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    
    if(auth) {
      EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  online: line
        }});
      return true;
    }else{
      return false;
    }
  },
  
  stewardEquipment(eqId, stewArr) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['peopleSuper','edit']);
    const arry = Array.isArray(stewArr);
    
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
    if( Roles.userIsInRole(Meteor.userId(), 'edit') ) {
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
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
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
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
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
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    
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
  
  
  deleteEquipment(eqId) {
    const inUse = MaintainDB.findOne({equipId: eqId},{fields:{'_id':1}});
    if(!inUse) {
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
  },
  
  serveNoReqSet(eqId, serveKey, NoReq) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      const stat = NoReq ? false : 'notrequired';
      MaintainDB.update({equipId: eqId, serveKey: serveKey}, {
        $set : {
          status: stat,
          doneAt: false,
      }});
      return true;
    }
  },
  
  serveCheck(eqId, serveKey, task, isDone) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      MaintainDB.update({equipId: eqId, serveKey: serveKey},{
        $push: {
          checklist: {
            task: task,
            time: new Date(),
            who: Meteor.userId()
        }
      }});
      if(isDone) {
        MaintainDB.update({equipId: eqId, serveKey: serveKey}, {
          $set : {
            status: 'complete',
            doneAt: new Date()
          }
        });
      }
      return true;
    }
  },
  
  serveNotCheck(eqId, serveKey, task) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      MaintainDB.update({equipId: eqId, serveKey: serveKey}, {
        $pull : {
          checklist: { task: task }
        },
        $set : {
          status: false,
          doneAt: false
        }
      });
      return true;
    }
  },
  
  serveNotesSet(eqId, serveKey, notes) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      MaintainDB.update({equipId: eqId, serveKey: serveKey}, {
        $set : {
          notes: notes
      }});
      return true;
    }
  },
  
  pmUpdate(eqId, serveKey, accessKey) {
    syncLocale(accessKey);
    
    const eq = EquipDB.findOne({_id: eqId},{fields:{'_id':1, 'service':1}});
    const sv = eq.service.find( s => s.serveKey === serveKey );
    
    if(sv) {
      const next = nextService(sv);
      const nextMmnt = moment(next).tz(Config.clientTZ);
      const close = sv.whenOf === 'startOf' || ( sv.timeSpan === 'day' && !nextMmnt.isWorkingDay() ) ?
                      nextMmnt.nextWorkingTime().endOf('day') :
                      nextMmnt.lastWorkingTime().endOf('day');
                    
      const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
      const expire = close.clone().addWorkingTime(sv.grace, 'days').format();
      
      const match = MaintainDB.findOne({equipId: eq._id, serveKey: sv.serveKey, expire: { $gte: new Date() }},
                          {fields:{'_id':1, 'checklist':1, 'notes':1}});
          
      if(!match) {
        MaintainDB.insert({
          equipId: eq._id,
          serveKey: sv.serveKey,
          orgKey: accessKey,
          name: sv.name,
          open: new Date( open ),
          close: new Date( close.format() ),
          expire: new Date( expire ),
          status: false, // complete, notrequired, incomplete, missed
          doneAt: false,
          checklist: [],
          notes: ''
        });
      }else{
        MaintainDB.update({equipId: eq._id, serveKey: sv.serveKey, status: false},{
          $set: {
            equipId: eq._id,
            serveKey: sv.serveKey,
            orgKey: accessKey,
            name: sv.name,
            open: new Date( open ),
            close: new Date( close.format() ),
            expire: new Date( expire ),
            status: false, // complete, notrequired, incomplete, missed
            doneAt: false,
            checklist: match?.checklist || [],
            notes: match?.notes || ''
          }
        });
      }
    }
  },
  
  pmRobot() {
    try {
      syncLocale(Meteor.user().orgKey);
      
      // MaintainDB.remove({status: false, checklist: { $size: 0 }});
      
      const updateStatus = ()=> {
        // return new Promise(function(resolve) {
          const now = moment().tz(Config.clientTZ);
          
          const maint = MaintainDB.find({status: false},{fields:{'_id':1, 'expire':1, 'checklist':1}}).fetch();
          
          for(const mn of maint) {
            if( now.isAfter(mn.expire) ) {
              const ng = mn.checklist.length > 0 ? 'incomplete' : 'missed';
              
              MaintainDB.update({_id: mn._id},{
                $set: {
                  status: ng
                }
              });
              
              // and defer email
            }
          }
        //   resolve('updated');
        // });
      };
      
      const updateDates = ()=> {
        return new Promise(function(resolve) {
          
        EquipDB.find({online: true},{fields:{'_id':1, 'service':1}})
        .forEach( (eq)=> {
          const maintEq = MaintainDB.find({equipId: eq._id, expire: { $gte: new Date() }},
                          {fields:{'_id':1, 'serveKey':1, 'checklist':1, 'notes':1}}).fetch();
          
          for(const sv of eq.service) {
            
            const next = nextService(sv);
            
            const nextMmnt = moment(next).tz(Config.clientTZ);
            const close = sv.whenOf === 'startOf' || ( sv.timeSpan === 'day' && !nextMmnt.isWorkingDay() ) ?
                      nextMmnt.nextWorkingTime().endOf('day') :
                      nextMmnt.lastWorkingTime().endOf('day');
                      
            const match = maintEq.find( m => m.serveKey === sv.serveKey );
            
            const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
            const expire = close.clone().addWorkingTime(sv.grace, 'days').format();
            
            if(!match) {
              MaintainDB.insert({
                equipId: eq._id,
                serveKey: sv.serveKey,
                orgKey: Meteor.user().orgKey,
                name: sv.name,
                open: new Date( open ),
                close: new Date( close.format() ),
                expire: new Date( expire ),
                status: false, // complete, notrequired, incomplete, missed
                doneAt: false,
                checklist: [],
                notes: ''
              });
            }else{
              MaintainDB.update({equipId: eq._id, serveKey: sv.serveKey, status: false},{
                $set: {
                  equipId: eq._id,
                  serveKey: sv.serveKey,
                  orgKey: Meteor.user().orgKey,
                  name: sv.name,
                  open: new Date( open ),
                  close: new Date( close.format() ),
                  expire: new Date( expire ),
                  status: false, // complete, notrequired, incomplete, missed
                  doneAt: false,
                  checklist: match?.checklist || [],
                  notes: match?.notes || ''
                }
              });
            }
          }
        });
        resolve('updated');
        });
      };
      
      updateDates()
        .then(updateStatus())
          .finally(()=> { return true });

    }catch (error) {
      throw new Meteor.Error(error);
    }finally{ return true }
  }
  
});