Meteor.methods({
    
  activate(pin) {
    const admins = Roles.getUsersInRole( 'admin' ).fetch();
    if(admins.length === 0) {
      Roles.addUsersToRoles(Meteor.userId(), 
        ['active', 
         'admin',
         'power',
         'inspector',
         'tester',
         'creator']
        );
      Meteor.users.update(Meteor.userId(), {
        $set: {
          pin: pin,
          watchlist: [],
          memo: []
        }
      });
      return true;
    }else{
      for(let x of admins) {
        if(x.pin === pin) {
          Roles.addUsersToRoles(Meteor.userId(), 'active');
          Meteor.users.update(Meteor.userId(), {
            $set: {
              watchlist: [],
              memo: []
            }
          });
          return true;
        }else{null}
      }
      return false;
    }
  },
      

  adminUpgrade(pin) {
    const admins = Roles.getUsersInRole( 'admin' ).fetch();
    if(admins.length < 2) {
      const auth = admins[0].pin === pin;
      if(auth) {
        Roles.addUsersToRoles(Meteor.userId(), 
          ['active', 
           'admin',
           'power',
           'inspector',
           'tester',
           'creator']
        );
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  
  
  adminDowngrade() {
    const admins = Roles.getUsersInRole( 'admin' ).fetch();
    if(admins.length > 1) {
      Roles.removeUsersFromRoles(Meteor.userId(), 'admin');
      return true;
    }else{
      return false;
    }
  },
    
  joinOrg(org, pin) {
    const members = Meteor.users.find({org: org}).fetch();
      for(let x of members) {
        const auth = Roles.userIsInRole(x._id, 'power');
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
      Roles.addUsersToRoles(Meteor.userId(), 'power');
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
    const poweruser = Roles.userIsInRole(Meteor.userId(), 'power');
    const team = Meteor.users.findOne({_id: badUserId, org: Meteor.user().org});
    const self = Meteor.userId() === badUserId;
    const admin = Roles.userIsInRole(badUserId, 'admin');
    const auth = poweruser && team && !self && !admin ? true : false;
    
    if(auth && Meteor.user().pin === pin) {
      Roles.removeUsersFromRoles(badUserId, 'power');
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
  
  permissionSet(user, role) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['admin', 'power']);
    if(auth) {
      Roles.addUsersToRoles(user, role);
      return true;
    }else{
      return false;
    }
  },
  
  permissionUnset(user, role) {
    const auth = Roles.userIsInRole(Meteor.userId(), ['admin', 'power']);
    if(auth) {
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
    if(auth) {
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