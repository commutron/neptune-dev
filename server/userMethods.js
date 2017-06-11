Meteor.methods({
    
  activate(pin) {
    const start = Meteor.users.find().fetch().length === 1 ? true : false;
    if(start) {
      Roles.addUsersToRoles(Meteor.userId(), ['devMaster', 'active', 'admin']);
      Meteor.users.update(Meteor.userId(), {
          $set: {
            pin: pin,
            watchlist: [],
            memo: []
          }
        });
      return true;
    }else{
      const dev = Meteor.settings ? 
                  Meteor.settings.twoFactor : 
                  Roles.getUsersInRole('devMaster').fetch()[0].pin;
        if(dev === pin) {
          Roles.addUsersToRoles(Meteor.userId(), 'active');
          Meteor.users.update(Meteor.userId(), {
            $set: {
              pin: false,
              watchlist: [],
              memo: []
            }
          });
          return true;
        }else{
          return false;
        }
    }
  },
      

  adminUpgrade(userId, pin) {
    const adminPin = Meteor.user().pin;
    const others = Meteor.users.find({orgKey: Meteor.user().orgKey, roles: 'admin'}).fetch();
    if(adminPin && others.length < 2) {
      const auth = adminPin === pin;
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
    
  joinOrg(org, pin) {
    const members = Meteor.users.find({org: org}).fetch();
      for(let x of members) {
        const auth = Roles.userIsInRole(x._id, 'admin');
        if(auth && x.pin === pin) {
          Meteor.users.update(Meteor.userId(), {
            $set: {
              org: x.org,
              orgKey: x.orgKey
            }
          });
          return true;
        }else{
          null;
        }
      }
      return false;
  },
  
  createOrg(orgName) {
    if(!Meteor.user().orgKey) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          org: orgName,
          orgKey: new Meteor.Collection.ObjectID().valueOf(),
        }
      });
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
    
    if(auth && Meteor.user().pin === pin) {
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
    if(dev || auth && team) {
      Roles.removeUsersFromRoles(user, role);
      return true;
    }else{
      return false;
    }
  },
  
  setPin(old, pin) {
    if(old === Meteor.user().pin || !Meteor.user().pin) {
      Meteor.users.update(Meteor.userId(), {
          $set: {
            pin: pin,
          }
        });
      return true;
    }else{
      return false;
    }
  },
  
  noPin(user) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const team = Meteor.users.findOne({_id: user, orgKey: Meteor.user().orgKey});
    if(auth && team) {
      Meteor.users.update(user, {
        $set: {
          pin: false
        }
      });
    }else{null}
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