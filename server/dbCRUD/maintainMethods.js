// import { Random } from 'meteor/random';
// import Config from '/server/hardConfig.js';

Meteor.methods({


// EquipDB = new Mongo.Collection('equipdb');
// MaintainDB = new Mongo.Collection('maintaindb');
  
  createEquipment(eqname, alias, brKey, instruct) {
    
    const dupe = EquipDB.findOne({alias: alias},{fields:{'_id':1}});
    
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    
    if(!dupe && auth) {
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
  }

/*

  editGroup(eqId, eqname, alias, brKey, instruct) {
    const doc = GroupDB.findOne({_id: groupId},{fields:{'group':1,'alias':1}});
    let duplicate = GroupDB.findOne({group: newGroupName},{fields:{'_id':1}});
    let dupe = GroupDB.findOne({alias: newAlias});
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    doc.group === newGroupName ? duplicate = false : null;
    doc.alias === newAlias ? dupe = false : null;
    if(!duplicate && !dupe && auth) {
      GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
        $set : {
          group: newGroupName,
          alias: newAlias,
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
  			  wiki: newWiki
        }});
      return true;
    }else{
      return false;
    }
  },
  
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