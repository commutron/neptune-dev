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
        tasks: [],
        pattern: []
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
  }
  
  
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