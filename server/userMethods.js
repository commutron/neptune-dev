import moment from 'moment';
import timezone from 'moment-timezone';
import { Accounts } from 'meteor/accounts-base';

Accounts.config({ 
  loginExpirationInDays: 0.54
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
            inbox: [],
            watchlist: [],
            breadcrumbs: []
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
  
  superUserEnable(userId, role) {
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
    const existOne = Meteor.users.find({orgKey: Meteor.user().orgKey, roles: role}).fetch();
    const notSelf = Meteor.userId() !== userId;
    if(admin === true && existOne.length === 0 && notSelf === true) {
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
  
  setWatchlist(type, keyword) {
    const watching = Meteor.user().watchlist;
    const double = watching.find( x => x.type === type && x.keyword === keyword);
    if(!double) {
      Meteor.users.update(Meteor.userId(), {
        $push: {
          watchlist: {
            watchKey: new Meteor.Collection.ObjectID().valueOf(),
            type: type,
            keyword: keyword,
            time: new Date(),
            mute: true
          }
        }
      });
    }else{
      Meteor.users.update(Meteor.userId(), {
        $pull : {
          watchlist: {type: type, keyword: keyword}
        }
      });
    }
  },
  
  setMuteState(wKey, mute) {
    const change = !mute ? true : false;
    Meteor.users.update({_id: Meteor.userId(), 'watchlist.watchKey': wKey}, {
      $set: {
        'watchlist.$.mute': change,
      }
    });
  },
  
  setNotifyAsRead(nKey, read) {
    const change = !read;
    Meteor.users.update({_id: Meteor.userId(), 'inbox.notifyKey': nKey}, {
      $set: {
        'inbox.$.unread': change,
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
  		
  clearBreadcrumbsRepair() {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        breadcrumbs: [],
      }
    });
    return true;
  },
  
  clearAllUserWatchlists() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      Meteor.users.update({orgKey: Meteor.user().orgKey}, {
        $set: {
          watchlist: [],
        },
      },{multi: true});
      return true;
    }
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
  
  logLogInOut(login, agent, sessionID) {
    if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
      const inout = !login ? 'logout' : 'login';
      const time = moment().format();
      const logString = `${inout}: ${time} ${agent} ${sessionID}`;
      Meteor.users.update(Meteor.userId(), {
        $push: {
          usageLog: logString,
        }
      });
    }
  },
  
  //if(valid) { Meteor.call('dropBreadcrumb', this.userId, 'batch', batch); }
  /*
  dropBreadcrumb(pingId, pingType, pingkeyword) {
    if(pingkeyword) {
      const user = Meteor.users.findOne({_id: pingId});
      const basket = user.breadcrumbs;
      if(!basket) {
        Meteor.users.update(pingId, {
          $set: {
            breadcrumbs: [],
          }
        });
      }else{
        const lately = basket.find( x => x.keyword === pingkeyword && moment().isSame(x.time, 'day') );
        if(!lately) {
          Meteor.users.update(pingId, {
            $push: { 
              breadcrumbs: {
                $each: [{
                  type: pingType,
                  keyword: pingkeyword,
                  time: new Date()
                }],
                $slice: -100
              }
            }
          });
        }
      }
    }
  },
  */
  
  fetchOrgTideActivity(dateString, clientTZ) {
    try {
      const localDate = moment.tz(dateString, clientTZ);
      
      const getYear = localDate.year();
      const getDay = localDate.dayOfYear();
      
      const allTouched = BatchDB.find({
        orgKey: Meteor.user().orgKey, 
        //'tide.startTime': { $gte: new Date(localDate.format('YYYY-MM-DD')) }
      }).fetch();
      
      let slimTideDay = [];
      for(let btch of allTouched) {
        const theDay = !btch.tide ? [] : btch.tide.filter( x => 
          moment.tz(x.startTime, clientTZ).year() === getYear && 
          moment.tz(x.startTime, clientTZ).dayOfYear() === getDay);
        for(let blck of theDay) {  
          slimTideDay.push({
            batch: btch.batch,
            tKey: blck.tKey,
            who: blck.who,
            startTime: blck.startTime,
            stopTime: blck.stopTime
          });
        }
      }
      return slimTideDay;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  fetchSelfTideActivity(yearNum, weekNum) {
    try {
      const getYear = yearNum || moment().weekYear();
      const getWeek = weekNum || moment().week();
      
      const allTouched = BatchDB.find({
        orgKey: Meteor.user().orgKey, 
        'tide.who': Meteor.userId()
      }).fetch();
      
      let slimTideWeek = [];
      for(let btch of allTouched) {
        const yourWeek = !btch.tide ? [] : btch.tide.filter( x => 
          x.who === Meteor.userId() && 
          moment(x.startTime).weekYear() === getYear && 
          moment(x.startTime).week() === getWeek);
        for(let blck of yourWeek) {  
          slimTideWeek.push({
            batch: btch.batch,
            tKey: blck.tKey,
            startTime: blck.startTime,
            stopTime: blck.stopTime
          });
        }
      }
      return slimTideWeek;
    }catch(err) {
      throw new Meteor.Error(err);
    }
  },
  
  editTideTimeBlock(batch, tideKey, newStart, newStop) {
    try {
      const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey );
      
      if(!sub || !newStart || !newStop) {
        return false;
      }else{
        const auth = sub.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
        if(!auth) {
          return false;
        }else{
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.startTime' : newStart,
              'tide.$.stopTime' : newStop
          }});
          return true;
        }
      }
      
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  splitTideTimeBlock(batch, tideKey, newSplit, stopTime) {
    try {
      const doc = BatchDB.findOne({ batch: batch, 'tide.tKey': tideKey });
      const sub = doc && doc.tide.find( x => x.tKey === tideKey );
      
      if(!sub || !newSplit || !stopTime) {
        return false;
      }else{
        const auth = sub.who === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
        if(!auth) {
          return false;
        }else{
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $set : { 
              'tide.$.stopTime' : newSplit
          }});
          const newTkey = new Meteor.Collection.ObjectID().valueOf();
          BatchDB.update({ batch: batch, orgKey: Meteor.user().orgKey, 'tide.tKey': tideKey}, {
            $push : { tide: { 
              tKey: newTkey,
              who: sub.who,
              startTime: newSplit,
              stopTime: stopTime
          }}});
          return true;
        }
      }
    }catch (err) {
       throw new Meteor.Error(err);
    }
  },
  
  forceStopUserTide(userID) {
    try {
      const user = Meteor.users.findOne({_id: userID, orgKey: Meteor.user().orgKey});
      if(user) {
        if(user.tide !== false) {
          const tKey = user.engaged.tKey;
          const doc = BatchDB.findOne({ orgKey: Meteor.user().orgKey, 'tide.tKey': tKey });
          const sub = doc && doc.tide.find( x => x.tKey === tideKey );
          if(doc && sub) {
            BatchDB.update({ orgKey: Meteor.user().orgKey, 'tide.tKey': tKey}, {
              $set : { 
                'tide.$.stopTime' : new Date()
            }});
          }else{null}
          Meteor.users.update(userID, {
            $set: {
              engaged: false
            }
          });
        }
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  logReactError(sessionID, errorType, info) {
    try {
      if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
        const time = moment().format();
        const logString = `Error, Type: ${errorType}, ${time}, username: ${Meteor.user().username} session: ${sessionID}, ${info}`;
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
    
});