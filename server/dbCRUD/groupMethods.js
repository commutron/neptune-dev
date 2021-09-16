Meteor.methods({

//// Groups \\\\
  addGroup(groupName, alias, wiki) {
    const duplicate = GroupDB.findOne({group: groupName},{fields:{'_id':1}});
    const dupe = GroupDB.findOne({alias: alias},{fields:{'_id':1}});
    const auth = Roles.userIsInRole(Meteor.userId(), 'create');
    if(!duplicate && !dupe && auth) {
      GroupDB.insert({
        group: groupName,
        alias: alias,
        orgKey: Meteor.user().orgKey,
        shareKey: false,
        createdAt: new Date(),
  			createdWho: Meteor.userId(),
  			updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
  			tags: [],
  			wiki: wiki
      });
      return true;
    }else{
      return false;
    }
  },

  editGroup(groupId, newGroupName, newAlias, newWiki) {
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
  
  hibernateGroup(groupId) {
    const doc = GroupDB.findOne({_id: groupId},{fields:{'hibernate':1}});
    const inUse = VariantDB.find({groupId: groupId, live: true},{fields:{'_id':1}}).count();
    const auth = Roles.userIsInRole(Meteor.userId(), 'edit');
    const switchTo = !doc.hibernate;
    if(inUse === 0 && auth) {
      GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
        $set : {
          hibernate: switchTo,
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
        }});
      return true;
    }else{
      return false;
    }
  },

  internalizeGroup(groupId) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['edit','run']);
    
    if(auth) {
      const inter = GroupDB.find({ internal: true }).count();
      
      if(inter === 0) {
        GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
          $set : {
            internal: true,
            updatedAt: new Date(),
    			  updatedWho: Meteor.userId(),
        }});
        return true;
      }else{
        GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
          $set : {
            internal: false,
            updatedAt: new Date(),
    			  updatedWho: Meteor.userId(),
        }});
        return true;
      }
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
  
  // push a tag
  pushGTag(groupId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), ['edit','run'])) {
      GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
        $push : { 
          tags: tag
        }});
    }else{
      null;
    }
  },
  // pull a tag
  pullGTag(groupId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), ['edit','run'])) {
      GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
        $pull : {
          tags: tag
        }});
    }else{
      null;
    }
  },
  
  groupEmailOptIn(groupId, option) {
    let setOp = !option || option === 'false' ? false : true;
    
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
        $set : { 
          emailOptIn: setOp
        }});
        return true;
    }else{
      return false;
    }
  },
  
  groupPrimeEmailSet(groupId, address) {
    if(typeof address === 'string') {
      if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
        GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
          $set : { 
            emailPrime: address
          }});
          return true;
      }else{
        return false;
      }
    }else{
      throw new Meteor.Error(403, 'Input is not a string');
    }
  },
  groupPrimeEmailRemove(groupId) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
        $set : { 
          emailPrime: false
        }});
        return true;
    }else{
      return false;
    }
  },
  
  groupSecondEmailSet(groupId, address) {
    if(typeof address === 'string') {
      if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
        GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
          $push : { 
            emailSecond: address
          }});
          return true;
      }else{
        return false;
      }
    }else{
      throw new Meteor.Error(403, 'Input is not a string');
    }
  },
  groupSecondEmailCut(groupId, address) {
    if(typeof address === 'string') {
      if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
        GroupDB.update({_id: groupId, orgKey: Meteor.user().orgKey}, {
          $pull : {
            emailSecond: address
          }});
          return true;
      }else{
        return false;
      }
    }else{
      throw new Meteor.Error(403, 'Input is not a string');
    }
  },
  
  

});