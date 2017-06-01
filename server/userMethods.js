Meteor.methods({
    
  activate(pin) {
    const admin = Meteor.users.find({admin: true}).fetch();
    if(admin.length === 0) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          active: true,
          admin: true,
          power: true,
          inspector: true,
          tester: true,
          creator: true,
          pin: pin,
          watchlist: [],
          memo: []
        }
      });
      return true;
    }else{
      for(let x of admin) {
        if(x.pin === pin) {
          Meteor.users.update(Meteor.userId(), {
            $set: {
              active: true,
              power: false,
              inspector: false,
              tester: false,
              creator: false,
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
    const admin = Meteor.users.find({admin: true}).fetch();
    if(admin.length < 2) {
      const auth = admin[0].pin === pin;
      if(auth) {
        Meteor.users.update(Meteor.userId(), {
          $set: {
            active: true,
            admin: true,
            power: true,
            inspector: true,
            tester: true,
            creator: true,
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
  
  adminDowngrade() {
    const admin = Meteor.users.find({admin: true}).fetch();
    if(Meteor.user().admin && admin.length > 1) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          admin: false
          }
        });
      return true;
    }else{
      return false;
    }
  },
    
  joinOrg(pin) {
    const power = Meteor.users.find({power: true, pin: pin}).fetch();
    
      for(let x of power) {
        if(x.orgKey) {
          Meteor.users.update(Meteor.userId(), {
            $set: {
              org: x.org,
              orgKey: x.orgKey
            }
          });
          return true;
        }else{
          return false;
        }
      }
  },
  
  createOrg(orgName) {
    if(!Meteor.user().orgKey) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          power: true,
          org: orgName,
          orgKey: new Meteor.Collection.ObjectID().valueOf(),
        }
      });
      return true;
    }else{
      return false;
    }
  },
  
  leaveOrg(pin) {
    const king = Meteor.user().power;
    const powers = Meteor.users.find({power: true, orgKey: Meteor.user().orgKey}).fetch();
    const backup = powers.length > 1;
    const block = king && !backup;
    if(powers.length === 0) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          active: true,
          power: false,
          org: false,
          orgKey: false,
          inspector: false,
          tester: false,
          creator: false
        }
      });
      return true;
    }else{null}
    if(!block) {
      for(let x of powers) {
        if(x.pin === pin) {
          Meteor.users.update(Meteor.userId(), {
            $set: {
              active: true,
              power: false,
              org: false,
              orgKey: false,
              inspector: false,
              tester: false,
              creator: false
            }
          });
        return true;
        }else{null}
      }
      return false;
    }else{
      return false;
    }
  },
  
    // may need abiity to kick user out of an org
  
  /*
  removeUser() {
    Meteor.users.remove(Meteor.userId());
  },
  */
  
  // will be replaceing with user roles package
  
  permissionSet(id, user) {
    var doc = Meteor.users.findOne({_id: user});
    if(Meteor.user().admin || Meteor.user().power) {
      if(id === 'active') {
        Meteor.users.update(user, {
          $set: {
            active: !doc.active,
          }
        });
        return true;
      }else if(id === 'power') {
        Meteor.users.update(user, {
          $set: {
            power: !doc.power,
          }
        });
        return true;
      }else if(id === 'inspect') {
        Meteor.users.update(user, {
          $set: {
            inspector: !doc.inspector,
          }
        });
        return true;
      }else if(id === 'test') {
        Meteor.users.update(user, {
          $set: {
            tester: !doc.tester,
          }
        });
        return true;
      }else if(id === 'create') {
        Meteor.users.update(user, {
          $set: {
            creator: !doc.creator,
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
    if(Meteor.user().admin) {
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