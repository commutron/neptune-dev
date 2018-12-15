Meteor.methods({
  
  verifyOrgJoin(orgName, pin) {
    const orgIs = AppDB.findOne({ org: orgName });
    if(orgIs) {
      if(orgIs.orgPIN === pin) {
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  joinOrgAtLogin(orgName, pin) {
    const orgIs = AppDB.findOne({ org: orgName });
    if(orgIs) {
      if(orgIs.orgPIN === pin) {
        Roles.addUsersToRoles(Meteor.userId(), 'active');
        Meteor.users.update(Meteor.userId(), {
          $set: {
            org: orgIs.org,
            orgKey: orgIs.orgKey,
            autoScan: true,
            unlockSpeed: 2000,
            watchlist: [],
            inbox: []
          }
        });
        return 'ok';
      }else{
        return 'no PIN match';
      }
    }else{
      return 'no org match';
    }
  },

  adminUpgrade(userId, pin) {
    const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
    const orgPIN = org ? org.orgPIN : false;
    const others = Meteor.users.find({orgKey: Meteor.user().orgKey, roles: 'admin'}).fetch();
    if(orgPIN && others.length < 2) {
      const auth = orgPIN === pin;
      if(auth) {
        Roles.addUsersToRoles(userId, 'admin');
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  
  adminDowngrade() {
    const others = Meteor.users.find({orgKey: Meteor.user().orgKey, roles: 'admin'}).fetch();
    if(others.length > 1) {
      Roles.removeUsersFromRoles(Meteor.userId(), 'admin');
      return true;
    }else{
      return false;
    }
  },
  
  // ability to kick a user out of an org
  removeFromOrg(badUserId, pin) {
    const adminPower = Roles.userIsInRole(Meteor.userId(), 'admin');
    const team = Meteor.users.findOne({_id: badUserId, orgKey: Meteor.user().orgKey});
    const self = Meteor.userId() === badUserId;
    const admin = Roles.userIsInRole(badUserId, 'admin');
    const auth = adminPower && team && !self && !admin ? true : false;
    if(auth) {
      const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
      const orgPIN = org ? org.orgPIN : false;
      if(orgPIN && orgPIN === pin) {
        Roles.removeUsersFromRoles(badUserId, 'active');
        Meteor.users.update(badUserId, {
          $set: {
            org: false,
            orgKey: false
          }
        });
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
 
  selfPasswordChange(newPassword) {
    const id = Meteor.userId();
    if(!id) {
      return false;
    }else{
      Accounts.setPassword(id, newPassword, {logout: false});
      return true;
    }
  },

  forcePasswordChange(userId, newPassword) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const team = Meteor.users.findOne({_id: userId, orgKey: Meteor.user().orgKey});
    const admin = Roles.userIsInRole(userId, 'admin');
    const self = Meteor.userId() === userId;
    if(auth && team && !admin && !self) {
      Accounts.setPassword(userId, newPassword, {logout: true});
      return true;
    }else{
      return false;
    }
  },
  
  deleteUserForever(userId, pin) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const user = Meteor.users.findOne({_id: userId});
    const orgless = user.orgKey === false;
    const inactive = !Roles.userIsInRole(userId, 'active');
    const admin = Roles.userIsInRole(userId, 'admin');
    const self = Meteor.userId() === userId;
    
    const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
    const orgPIN = org ? org.orgPIN : null;
    const dbblCheck = orgPIN === pin;

    if(auth && orgless && inactive && !admin && !self && dbblCheck) {
      Meteor.users.remove(userId);
      return true;
    }else{
      return false;
    }
  },
  
  // need to finish email handling \\
  
  // emailRemove(email) {
  // Accounts.removeEmail(Meteor.userId(), email)
  
  // emailSet(newEmail) {
  // Accounts.addEmail(Meteor.userId(), newEmail)
  
  permissionSet(user, role) {
    const dev = Roles.userIsInRole(Meteor.userId(), 'devMaster');
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const team = Meteor.users.findOne({_id: user, orgKey: Meteor.user().orgKey});
    if(dev || auth && team) {
      Roles.addUsersToRoles(user, role);
      return true;
    }else{
      return false;
    }
  },
  
  permissionUnset(user, role) {
    const dev = Roles.userIsInRole(Meteor.userId(), 'devMaster');
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const team = Meteor.users.findOne({_id: user, orgKey: Meteor.user().orgKey});
    
    if(role === 'active' && user === Meteor.userId()) {
      return false;
    }else if(dev || auth && team) {
      Roles.removeUsersFromRoles(user, role);
      return true;
    }else{
      return false;
    }
  },
  
  setAutoScan(value) {
    const curr = Meteor.user().autoScan;
    const change = value === undefined ? !curr ? true : false : value;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        autoScan: change,
      }
    });
  },
  
  setSpeed(time) {
    let setTime = !time ? 2000 : time;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        unlockSpeed: setTime,
      }
    });
    return true;
  },
  
  setMinAction() {
    const curr = Meteor.user().miniAction;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        miniAction: change,
      }
    });
  },
  
  
});