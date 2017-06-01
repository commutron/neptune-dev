Meteor.methods({

//// Groups \\\\

  addGroup(groupName, alias) {
    if(Meteor.userId()) {
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
    if(Meteor.user().power) {
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
      const user = Meteor.user().power;
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