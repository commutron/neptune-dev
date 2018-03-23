Meteor.methods({
  
// Clearly this is not secure.
// The use case of this software is to be used by a single organization,
// hosted and made available internaly.
// In this context, the intention of a PIN is to promt behavior.
// To encourage an interaction between the new user and the org's admin
  activate(pin, orgName) {
    const start = Meteor.users.find().fetch().length === 1 ? true : false;
    if(start && pin === '0000') {
      Roles.addUsersToRoles(Meteor.userId(), ['active', 'admin']);
      Meteor.users.update(Meteor.userId(), {
        $set: {
          org: orgName,
          orgKey: new Meteor.Collection.ObjectID().valueOf(),
          unlockSpeed: 2000,
          watchlist: [],
          inbox: []
        }
      });
      return true;
    }else{
      const orgIs = AppDB.findOne({ org: orgName });
      if(orgIs) {
        if(orgIs.orgPIN === pin) {
          Roles.addUsersToRoles(Meteor.userId(), 'active');
          Meteor.users.update(Meteor.userId(), {
            $set: {
              org: orgIs.org,
              orgKey: orgIs.orgKey,
              unlockSpeed: 2000,
              watchlist: [],
              inbox: []
            }
          });
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
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
  
  deleteUserForever(userId) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const team = Meteor.users.findOne({_id: userId, orgKey: false});
    const inactive = !Roles.userIsInRole(userId, 'active');
    const admin = Roles.userIsInRole(userId, 'admin');
    const self = Meteor.userId() === userId;
    if(auth && !team && inactive && !admin && !self) {
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
  
  setSpeed(time) {
    let setTime = !time ? 2000 : time;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        unlockSpeed: setTime,
      }
    });
    return true;
  },
  
  
});

  /*
  // test/example code
  // private operations on private server data
  userOps() {
    var start = Meteor.users.find().fetch();
    let next = new Set();
    for(var x of start) {
      next.add(x.username);
    }
    let send = [...next];
    return send;
  },
// on client
    Meteor.call('userOps', (err, data)=>{
      if (err)
        console.log(err);
    this.setState({data: data});
    });
    */
    
/* this could be used in the future with PINs
  powerCheck() {
    var go = Meteor.user().power;
    return go;
  },
  ///////////// CLIENT ///////////
    constructor() {
    super();
    this.state = {
      lock: true
   };
  }
  
  key() {
    Meteor.call('powerCheck', (err, reply)=>{
      if (err)
        console.log(err);
      reply ? this.setState({lock: false}) : null;
    });
  }
  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  */