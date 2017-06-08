Meteor.methods({

//// Groups \\\\

  addGroup(groupName, alias) {
    const duplicate = GroupDB.findOne({group: groupName});
    const dupe = GroupDB.findOne({alias: alias});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    if(!duplicate && !dupe && auth) {
      GroupDB.insert({
        group: groupName,
        alias: alias,
        orgKey: Meteor.user().orgKey,
        createdAt: new Date(),
  			createdWho: Meteor.userId(),
  			share: false
        });
      return true;
    }else{
      return false;
    }
  },

  editGroup(groupId, newGroupName, newAlias) {
    const doc = GroupDB.findOne({_id: groupId});
    let duplicate = GroupDB.findOne({group: newGroupName});
    let dupe = GroupDB.findOne({alias: newAlias});
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    doc.group === newGroupName ? duplicate = false : null;
    doc.alias === newAlias ? dupe = false : null;
    if(!duplicate && !dupe && auth) {
      GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
        $set : {
          group: newGroupName,
          alias: newAlias
        }});
      return true;
    }else{
      return false;
    }
  },


  deleteGroup(groupId, pass) {
    const inUse = WidgetDB.findOne({groupId: groupId});
    if(!inUse) {
      const doc = GroupDB.findOne({_id: groupId});
      const lock = doc.createdAt.toISOString();
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

});