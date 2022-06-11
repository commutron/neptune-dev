// import { Random } from 'meteor/random';
// import Config from '/server/hardConfig.js';

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
  
  addServicePattern(eqId, timeSpan, pivot, recur, period) {
    if( Roles.userIsInRole(Meteor.userId(), 'edit') ) {
      
      const whenOf = typeof pivot === 'string' ? pivot : Number(pivot);
      
      EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey}, {
        $push : {
          service: { 
            serveKey: new Meteor.Collection.ObjectID().valueOf(),
            updatedAt: new Date(),
            timeSpan: timeSpan, // 'day', 'week', month, 'year'
            whenOf: whenOf, // 'endOf', // 1, 2, 3, ..., 'startOf'
            recur: Number(recur),
            period: Number(period), // 1, 6, 30 // in days
            grace: Number(1), // in days
            tasks: []
          }
        }});
      return true;
    }else{
      return false;
    }
  },

  // editService(eqId, serveKey ) {
  //   // const doc = EquipDB.findOne({_id: eqId},{fields:{'equip':1,'alias':1}});
    
  //   const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    
  //   if(auth) {
     
  //     EquipDB.update({_id: eqId, orgKey: Meteor.user().orgKey, 'service.serveKey': serveKey}, {
  //       $set : {
  //         'service.$.updatedAt': new Date(),
  //         'service.$.pattern': {
  //           recur: Number(1),
  //           cycle: 'month', // 'day', 'quarter', 'year'
  //           range: Number(6), // 1, 6, 30
  //           deadline: 'endOf' // startOf'
  //         }
  //       }});
  //     return true;
  //   }else{
  //     return false;
  //   }
  // },
  
  setServiceTasks(eqId, serveKey, tasksArr) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    
    if(auth) {
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
  
  
  /*
  service: [{
    serveKey: new Meteor.Collection.ObjectID().valueOf(),
    pattern: {
      recur: 1,
      cycle: 'month', // 'day', 'quarter', 'year'
      range: 6, // 1, 6, 30
      deadline: 'endOf' // startOf'
    }
    tasks: []
    
  }]
  */
  
  /*
  deleteGroup(groupId, pass) {
    const inUse = WidgetDB.findOne({groupId: groupId},{fields:{'_id':1}});
    if(!inUse) {
      const doc = GroupDB.findOne({_id: groupId});
      const lock = doc.createdAt.toISOString().split("T")[0];
      const user = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(user && access && unlock) {
        GroupDB.remove(groupId);
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  */
});