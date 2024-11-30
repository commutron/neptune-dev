import { Accounts } from 'meteor/accounts-base';
import Config from '/server/hardConfig.js';
import Pref from '/public/pref.js';

Accounts.config({ 
  loginExpirationInDays: Config.loginExpire
});

Accounts.validateLoginAttempt(function(attempt) {
  if(!attempt.user) {
    attempt.allowed = false;
    return attempt.error;
  }
  if(!Roles.userIsInRole(attempt.user._id, 'active')) {
    attempt.allowed = false;
    throw new Meteor.Error(403, "User account is deactivated");
  }
  return true;
});

Accounts.validateNewUser(function(attempt) {
  if(attempt.username.length < Config.minUsernameChar) {
    throw new Meteor.Error(403, 'Username must have at least 4 characters');
  }
  return true;
});

Accounts.onCreateUser((options, user) => {
  const orgName = options.org;
  const orgIs = AppDB.findOne({ org: orgName });
  const roles = Meteor.users.find({}).count() === 0 ? ['active', 'admin'] : ['active'];
  if(orgIs) {
    const customizedUser = Object.assign({
      org: orgIs.org,
      orgKey: orgIs.orgKey,
      roles: roles,
      inbox: [],
      autoScan: true,
      unlockSpeed: 2000,
      usageLog: [],
      proTimeShare: [{
        updatedAt: new Date(),
        timeAsDecimal: Number(1)
      }],
      engaged: false,
      tidepools: []
    }, user);
  
    return customizedUser;
  }
});

Accounts.onLogin( ()=>{
	const orgKey = Meteor.user().orgKey;
	const userId = Meteor.userId();
	
	Meteor.defer( ()=>{
    CacheDB.upsert({dataName: 'userLogin_status'}, {
      $set : {
        orgKey: orgKey,
        lastUpdated: new Date(),
        dataName: 'userLogin_status'
      },
      $push : {
        dataArray: userId
    }});
  });
});

Accounts.onLogout( ()=>{
  const userId = Meteor.userId();
  
  Meteor.defer( ()=>{
    CacheDB.update({dataName: 'userLogin_status'}, {
      $pull : { 
        dataArray: userId
      }
    });
  });
});

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
  
  dbblCheckPassword(passVal) {
    const user = Meteor.user();
    
    const result = Accounts._checkPassword(user, passVal);
    
    if(result.error === undefined) {
      return true;
    }else{
      return false;
    }
  },

  adminUpgrade(userId, pin) {
    const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
    const orgPIN = org ? org.orgPIN : false;
    const others = Meteor.users.find({orgKey: Meteor.user().orgKey, roles: 'admin'}).fetch();
    if(orgPIN && others.length < 3) {
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
  
  superUserEnable(userId, role) {
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
    const exist = Meteor.users.find({orgKey: Meteor.user().orgKey, roles: role}).fetch();
    const allow = Config.allowedSupers || 1;
    if(admin === true && exist.length < allow ) {
      Roles.addUsersToRoles(userId, role);
      return true;
    }else{
      return false;
    }
  },
  superUserDisable(userId, role) {
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
    const isSelf = Meteor.userId() === userId;
    if(admin || isSelf) {
      Roles.removeUsersFromRoles(userId, role);
      return true;
    }else{
      return false;
    }
  },
  
  selfUsernameChange(pass, newUsername) {
    const userId = Meteor.userId();
    const user = Meteor.user();
    const oldusername = user.username;
    
    if(typeof pass === 'string' && typeof newUsername === 'string') {
      const result = Accounts._checkPassword(user, pass);
      if(result.error === undefined) {
        Accounts.setUsername(userId, newUsername);
        
        Meteor.defer( ()=>{
          const deadname = XBatchDB.find({
            $or: [ 
              { "events.detail": { $regex: new RegExp( oldusername ) } },
              { "events.sub": { $regex: new RegExp( oldusername ) } },
            ]
          },{fields:{'events':1}}).fetch();
          for(let b of deadname) {
            for(let e of b.events) {
              if(e.detail.includes(oldusername)) {
                const re = e.detail.replace(oldusername, newUsername);
                XBatchDB.update({_id: b._id, 'events.time': e.time}, {
                  $set : { 'events.$.detail': re  }
                });
              }
              if(e.sub && e.sub.includes(oldusername)) {
                const re = e.sub.replace(oldusername, newUsername);
                XBatchDB.update({_id: b._id, 'events.time': e.time}, {
                  $set : { 'events.$.sub': re  }
                });
              }
            }
          }
        });
    
        return true;
      }else{
        return result.error;
      }
    }else{
      throw new Meteor.Error(403, 'Input is not strings');
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
      throw new Meteor.Error();
    }
  },
  
  userEmailSet(pass, newEmail) {
    if(typeof pass === 'string' && typeof newEmail === 'string') {
      
      const password = Meteor.call('dbblCheckPassword', pass);
      if(password) {
      
        const check = Config.regexEmail.test(newEmail);
        if(check) {
          Accounts.addEmail(Meteor.userId(), newEmail, true);
          return true;
        }else{
          throw new Meteor.Error(403, 'Invalid email format');
        }
      }else{
        throw new Meteor.Error(403, 'Incorrect Password');
      }
    }else{
      throw new Meteor.Error(403, 'Input is not strings');
    }
  },
  
  userEmailRemove(pass, email) {
    if(typeof pass === 'string' && typeof email === 'string') {
      
      const password = Meteor.call('dbblCheckPassword', pass);
      if(password) {
        
        if(Roles.userIsInRole(Meteor.userId(), 'active')) {
          Accounts.removeEmail(Meteor.userId(), email);
          return true;
        }else{
          throw new Meteor.Error(403, 'Invalid email');
        }
      }else{
        throw new Meteor.Error(403, 'Incorrect Password');
      } 
    }else{
      throw new Meteor.Error(403, 'Input is not strings');
    }
  },
  
  deleteUserForever(userId, pin) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
    const orgPIN = org ? org.orgPIN : null;
    const pinMatch = orgPIN === pin;
    
    const user = Meteor.users.findOne({_id: userId});
    
    if(auth && pinMatch && user) {
      const notActive = !Roles.userIsInRole(userId, 'active');
      const notAdmin = !Roles.userIsInRole(userId, 'admin');
      const notSelf = Meteor.userId() !== userId;
      const notInOrg = !user.org;
      
      if(notActive && notAdmin && notSelf && notInOrg) {
        Meteor.users.remove(userId);
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  
  permissionSet(user, role) {
    const dev = Roles.userIsInRole(Meteor.userId(), 'devMaster');
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const open = role !== 'peopleSuper';
    const team = Meteor.users.findOne({_id: user, orgKey: Meteor.user().orgKey});
    if(open && ( dev || auth && team )) {
      Roles.addUsersToRoles(user, role);
      return true;
    }else{
      return false;
    }
  },
  
  permissionUnset(user, role) {
    const dev = Roles.userIsInRole(Meteor.userId(), 'devMaster');
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const open = role !== 'peopleSuper';
    const team = Meteor.users.findOne({_id: user, orgKey: Meteor.user().orgKey});
    if(role === 'active' && user === Meteor.userId()) {
      return false;
    }else if(open && ( dev || auth && team )) {
      Roles.removeUsersFromRoles(user, role);
      return true;
    }else{
      return false;
    }
  },
  
  setColor(cVal) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        customColor: cVal,
      }
    });
    return true;
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
        unlockSpeed: Number(setTime),
      }
    });
    return true;
  },
  
  setUserNCcodes() {
    const curr = Meteor.user().showNCcodes;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        showNCcodes: change,
      }
    });
  },
  
  setUserNCselection() {
    const curr = Meteor.user().typeNCselection;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        typeNCselection: change,
      }
    });
  },
  
  setUserNCFocus() {
    const curr = Meteor.user().ncFocusReset;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        ncFocusReset: change,
      }
    });
  },
  
  setUserSHFocus() {
    const curr = Meteor.user().shFocusReset;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        shFocusReset: change,
      }
    });
  },
  
  setUserAutoscrollI() {
    const curr = Meteor.user().scrollInstruct;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        scrollInstruct: change,
      }
    });
  },
  
  setUserProgPrefer() {
    const curr = Meteor.user().progType;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        progType: change,
      }
    });
  },
  
  setUserMiniPrefer() {
    const curr = Meteor.user().miniAction;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        miniAction: change,
      }
    });
  },
  
  setUserLightPrefer() {
    const curr = Meteor.user().preferLight;
    const change = !curr ? true : false;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        preferLight: change,
      }
    });
  },
  
  setDefaultOverview(option) {
    let setOp = !option || option === 'false' ? false : option;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        defaultOverview: setOp,
      }
    });
    return true;
  },
  
  updateProductionPercent(option, userID) {
    
    Meteor.users.update(userID, {
      $push : { 
        'proTimeShare': {
          $each: [ {
            updatedAt: new Date(),
            timeAsDecimal: Number(option)
          } ],
          $position: 0
        }
      }
    });
    return true;
  },
  
  setNotifyAsRead(nKey, read) {
    const uID = Meteor.userId();
    const change = !read;
    Meteor.users.update({_id: uID, 'inbox.notifyKey': nKey}, {
      $set: {
        'inbox.$.unread': change,
      }
    });
  },
  setReadToast(uID, nKey) {
    Meteor.users.update({_id: uID, 'inbox.notifyKey': nKey}, {
      $set: {
        'inbox.$.unread': false,
      }
    });
  },
  removeNotify(nKey) {
    Meteor.users.update(Meteor.userId(), {
      $pull : {
        inbox: {notifyKey: nKey}
      }
    });
  },
  
  setReadAllInbox() {
    const user = Meteor.users.findOne({_id: Meteor.userId()});
    const inbox = (user?.inbox || []).filter( x => x.unread === true );
    for(let ix of inbox) {
      Meteor.users.update({_id: Meteor.userId(), 'inbox.notifyKey': ix.notifyKey}, {
        $set: {
          'inbox.$.unread': false,
        },
      });
    }
  },
  removeAllInbox() {
    Meteor.users.update(Meteor.userId(), {
      $set : {
        inbox: []
      }
    });
  },
  
  // readFeedback(uID, nKey) {
  //   const user = Meteor.users.findOne({_id: uID});
  //   const notify = (user?.inbox || []).find( x => x.notifyKey === nKey );
  //   if(notify && notify.type === 'direct' && notify.replyId) {
  //     Meteor.users.update(uID, {
  //       $push : { inbox : {
  //         notifyKey: new Meteor.Collection.ObjectID().valueOf(),
  //         keyword: 'replyread',
  //         type: 'replyread',
  //         title: notify.title,
  //         detail: `${notify.title} has read "${notify.detail.slice(0, 25)}"...`,
  //         time: new Date(),
  //         unread: true,
  //       }
  //     }});
  //   }
  // },
  		
  clearBreadcrumbsRepair() {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        breadcrumbs: [],
      }
    });
    return true;
  },
  
  clearNonDebugUserUsageLogs() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      Meteor.users.update({ roles: { $not: { $in: ["debug"] } } }, {
        $set: {
          usageLog: [],
          breadcrumbs: []
        },
      },{multi: true});
      return true;
    }
  },
  
  logReactError(sessionID, agent, errorType, info) {
    try {
      if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
        const time = (new Date()).toISOString();
        const logString = `Error, Type: ${errorType}, ${time}, 
                            username: ${Meteor.user().username}, 
                              session: ${sessionID}, 
                                agent: ${agent}, ${info}`;
        Meteor.users.update(Meteor.userId(), {
          $push: {
            usageLog: logString,
          }
        });
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  getUsername(id) {
    const user = Meteor.users.findOne({_id : id},{'username':1});
    return user ? user.username : 'unknown';
  },
  
  sendUserDM(userID, title, message, rere) {
    const orgKey = Meteor.user().orgKey;
    const thisID = Meteor.userId();
    const sentTime = new Date();
    const mssgTitle = title || '';
    const mssgDetail = message || '';
    try {
      Meteor.users.update(userID, {
        $push : { inbox : {
          notifyKey: new Meteor.Collection.ObjectID().valueOf(),
          keyword: 'direct',
          type: 'direct',
          title: mssgTitle,
          detail: mssgDetail,
          time: sentTime,
          unread: true,
          replyId: thisID,
          reply: rere
        }
      }});
      
      Meteor.defer( ()=>{
        CacheDB.upsert({dataName: 'internalDM_log'}, {
          $set : {
            orgKey: orgKey,
            lastUpdated: new Date(),
            dataName: 'internalDM_log'
          },
          $push : {
            dataArray: {
              time: sentTime,
              fromId: thisID,
              fromName: mssgTitle,
              toId: userID,
              content: mssgDetail
            }
        }});
      });
      
      if(!CacheDB.findOne({dataName: 'userLogin_status', dataArray: { $in: [userID]}})) {
        return 'ether';
      }else{
        return true;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  sendAllUserDM(message) {
    if(Roles.userIsInRole(Meteor.userId(), ['admin','peopleSuper'])) {
      const orgKey = Meteor.user().orgKey;
      const user = Meteor.user();
      const username = user ? user.username : 'Neptune';
      const unice = username.replace(Pref.usrCut, " ").replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

      const activeusers = Meteor.users.find({_id: { $ne: Meteor.userId() }, orgKey: orgKey, roles: { $in: ["active"] }});
      for(let au of activeusers) {
        Meteor.call('sendUserDM', au._id, unice, message, false);
      }
      return true;
    }else{
      return false;
    }
  },
  
  fetchDMLog() {
    if(Roles.userIsInRole(Meteor.userId(), ['admin','peopleSuper'])) {
      const cache = CacheDB.findOne({dataName: 'internalDM_log'});
      const logs = !cache ? [] : cache.dataArray;
      
      return JSON.stringify(logs);
    }else{ 
      return JSON.stringify([]);
    }
  },
  
  removeOldDMLog(accessKey) {
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
    const isSelf = AppDB.find({orgKey: accessKey},{fields:{'_id':1}}).count();
    if(isAdmin || isSelf) {
      const cutoff = ( d => new Date(d.setDate(d.getDate()-90)) )(new Date);

      CacheDB.update({dataName: 'internalDM_log'}, {
        $pull : { 
          dataArray: { 
            time: { 
              $lt: cutoff
            }
          }
        }
      });
      return true;
    }
  }
  
});