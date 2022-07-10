// import { Random } from 'meteor/random';
// let hamsters = require("hamsters.js");

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
  
  
  pmUpdate(eqId, serveKey, accessKey) {
    syncLocale(accessKey);
    
    const eq = EquipDB.findOne({_id: eqId},{fields:{'_id':1, 'service':1}});
    const sv = eq.service.find( s => s.serveKey === serveKey );
    
    if(sv) {
      const next = /*Meteor.call('nextWork', sv); */ nextService(sv);
      const nextMmnt = moment(next).tz(Config.clientTZ);
      const close = sv.whenOf === 'startOf' ?
                      nextMmnt.nextWorkingTime().endOf('day') :
                      nextMmnt.lastWorkingTime().endOf('day');
                    
      const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
      const expire = close.clone().addWorkingTime(sv.grace, 'days').format();
            
      MaintainDB.update({equipId: eqId, serveKey: sv.serveKey, status: false},{
        $set: {
          equipId: eqId,
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
        }
      }, { upsert: true });
    }
  },
  
  /*
  nextWork(sv) {
    async function runThing(sv, st) {
      try{
        var params = {
          array: [sv, st],
        };
        
        var method = function() {
          if( params.array.length > 0 ) {
            const sv = params.array[0];
            const st = params.array[1];
           
            let next = sv.whenOf === 'endOf' ? st.endOf(sv.timeSpan) :
                       sv.whenOf === 'startOf' ? st.startOf(sv.timeSpan) :
                       sv.timeSpan === 'week' ? st.day(sv.whenOf).endOf('day') :
                       sv.timeSpan === 'month' ? st.date(sv.whenOf).endOf('day') :
                                                  st.month(sv.whenOf).endOf('month');
            
            let run = true;
            while(run) {
              if(next.isSameOrAfter(new Date())) {
                rtn.data.push( new Date(next.format()) );
                run = false;
              }else{
                next.add(sv.recur, sv.timeSpan);
              }
            }
          }
        };

        var results = await hamsters.promise(params, method);
        return results[0];
          
      }catch (err) {
        console.error(err);
      }
    }
    
    const st = moment(sv.nextAt).tz(Config.clientTZ);
    
    return runThing(sv, st);
  },
  */
  
  pmRobot() {
    syncLocale(Meteor.user().orgKey);
    
    // MaintainDB.remove({status: false, checklist: { $size: 0 }});
    
    EquipDB.find({online: true},{fields:{'_id':1, 'service':1}})
    .forEach( (eq)=> {
      const maint = MaintainDB.find({equipId: eq._id},{fields:{'_id':1, 'serveKey':1, 'close':1}}).fetch();
      
      for(const sv of eq.service) {
        
        const next = /*Meteor.call('nextWork', sv); */ nextService(sv);
        
        const nextMmnt = moment(next).tz(Config.clientTZ);
        const close = sv.whenOf === 'startOf' ?
                  nextMmnt.nextWorkingTime().endOf('day') :
                  nextMmnt.lastWorkingTime().endOf('day');
                  
        // const match = maint.find( m => m.serveKey === sv.serveKey && close.isSame(m.close, 'day') );
        const match = maint.find( m => m.serveKey === sv.serveKey && sv.status === false );
        
        // if(!match) {
        const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
        const expire = close.clone().addWorkingTime(sv.grace, 'days').format();
        
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
        }, { upsert: true });
      // }
      }
    });
  }
  
});