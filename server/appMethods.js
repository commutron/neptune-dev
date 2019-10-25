import { Random } from 'meteor/random'
import moment from 'moment';

Meteor.startup(function () {  
  // ensureIndex is depreciated 
  // but the new createIndex errors as "not a function"
  AppDB._ensureIndex({ org : 1 }, { unique: true });
  Meteor.users._ensureIndex({ username : 1 }, { unique: true });
  XBatchDB._ensureIndex({ batch : 1 }, { unique: true });
  BatchDB._ensureIndex({ batch : 1, 'items.serial' : 'text' }, { unique: true });
  GroupDB._ensureIndex({ group : 1 }, { unique: true });
  WidgetDB._ensureIndex({ widget : 1, 'versions.version' : 1 }, { unique: true });
  CacheDB._ensureIndex({ dataName : 1 }, { unique: true });
});

Meteor.methods({
  /*
  addFirstSetting() {
    const orgKey = new Meteor.Collection.ObjectID().valueOf();
    AppDB.insert({
      org: 'crew',
      orgKey: orgKey,
      orgPIN: '0000',
      minorPIN: '000',
      createdAt: new Date(),
      phases: ['finish'],
      toolOption: [],
      trackOption: [],
      lastTrack: {
        key: 'f1n15h1t3m5t3p',
        step: 'finish',
        type: 'finish',
        phase: 'finish',
        how: 'finish'
      },
      countOption: [],
      nonConOption: [],
      nonConTypeLists: [],
      ncScale: {
        low: Number(5),
        high: Number(10),
        max: Number(25)
      },
      missingType: 'missing',
      ancillaryOption: [],
      tagOption: [],
      instruct: '',
      helpDocs: '',
      timeClock: '',
      latestSerial: {
        eightDigit: Number(12345678),
        nineDigit: Number(123456789),
        tenDigit: Number(1234567890)
      },
      ndaMode: false
    });
    Meteor.users.update(Meteor.userId(), {
      $set: {
        org: 'crew',
        orgKey: orgKey
      }
    });
    Roles.addUsersToRoles(Meteor.userId(), ['active', 'admin']);
    return true;
  },
  */
// Clearly this is not secure.
// The use case of this software is to be used by a single organization,
// hosted and made available internaly.
// In this context, the intention of a PIN is to promt behavior.
// To encourage an interaction between the new user and the org's admin
  setPin(oldPIN, newPIN) {
    const adminPower = Roles.userIsInRole(Meteor.userId(), 'admin');
    const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
    const orgPIN = org ? org.orgPIN : false;
    if(adminPower) {
      if(!orgPIN || orgPIN === false || orgPIN === oldPIN) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $set : { 
            orgPIN : newPIN
        }});
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  revealPIN(passCode) {
    const adminPower = Roles.userIsInRole(Meteor.userId(), 'admin');
    const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
    const orgPIN = org ? org.orgPIN : false;
    if(adminPower) {
      const backdoor = "People don't appreciate the substance of things. Objects in space.";
      if(passCode === backdoor) {
        return [true, orgPIN];
      }else{
        return [false, 'no'];
      }
    }else{
      return [false, 'no'];
    }
  },
  // // // // // // // // //
  setMinorPin(newPIN) {
    const adminPower = Roles.userIsInRole(Meteor.userId(), 'admin');
    if(adminPower) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          minorPIN : newPIN
      }});
      return true;
    }else{
      return false;
    }
  },
  
  
  // / / / / / / / / / / / / / / / 
  
  // Phases
  addPhaseOption(value) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      try{
        const cleanValue = value.toLowerCase().trim();
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $push : { 
            phases : {
              $each: [ cleanValue ],
              $position: -1
           }
        }});
        return true;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }else{
      return false;
    }
  },
  
  reorderPhaseOptions(newOrder) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      try{
        const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
        const currentList = appDoc.phases;
        let allExist = true;
        for(let op of newOrder) {
          let exist = currentList.find( x => x.toLowerCase() === op ) ? true : false;
          !exist ? allExist = false : null;
        }
        newOrder[newOrder.length - 1] === 'finish' ? null : allExist = false;
        
        if(allExist === true) {
          AppDB.update({orgKey: Meteor.user().orgKey}, {
            $set : { 
              phases : newOrder
          }});
          return true;
        }else{
          return false;
        }
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }else{
      return false;
    }
  },
  
  removePhaseOption(value) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      try{
        const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
        const used = appDoc.trackOption.find( x => x.phase === value );
        if(!used && value !== 'finish') {
          AppDB.update({orgKey: Meteor.user().orgKey}, {
            $pull : { 
              phases : value
          }});
          return true;
        }else{
          return false;
        }
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }else{
      return false;
    }
  },
  
  addTrackStepOption(step, type, phase) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          trackOption : { 
            'key' : new Meteor.Collection.ObjectID().valueOf(),
            'step' : step,
            'type' : type,
            'phase' : phase,
            'how' : false
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  editTrackStepOption(opKey, step, type, phase) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey, 'trackOption.key' : opKey}, {
        $set : { 
          'trackOption.$.step' : step,
          'trackOption.$.type' : type,
          'trackOption.$.phase' : phase,
          }
      });
      return true;
    }else{
      return false;
    }
  },
  
  endTrack(flatLast) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      
      const split = flatLast.split('|');
      const step = split[0];
      const type = split[1];
      const how = split[2];
      const trackObj = 
      { 
        'key' : 'f1n15h1t3m5t3p',
        'step' : step,
        'type' : type,
        'phase' : 'finish',
        'how' : how
      };
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          lastTrack : trackObj
      }});
      return true;
    }else{
      return false;
    }
  },
  
  addCountOption(flatOp) {
    const split = flatOp.split('|');
    const gate = split[0];
    const type = split[1];
    const phase = split[2];
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          countOption : { 
            key : new Meteor.Collection.ObjectID().valueOf(),
            gate : gate,
            type : type,
            phase : phase
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
// set last serial
  setlastestSerial(serialNine, serialTen) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const validNums = !isNaN(serialNine) && !isNaN(serialTen) ? true : false;
    const validN = serialNine.length === 9;
    const validT = serialTen.length === 10;
    if(auth && validNums && validN && validT) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          'latestSerial.nineDigit': Number(serialNine),
          'latestSerial.tenDigit': Number(serialTen)
      }});
      return true;
    }else{
      return false;
    }
  },
  
  setPriorityScale(chill, warm, hot) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          priorityScale : {
            low: Number(chill),
            high: Number(warm),
            max: Number(hot),
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  // new tool option
  addToolOp(title, forStep) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {

      const doc = AppDB.findOne({orgKey: Meteor.user().orgKey});
      if(doc.toolOption.find( x => x.title === title )) {
        AppDB.update({orgKey: Meteor.user().orgKey, 'toolOption.title': title}, {
          $pull : {
            toolOption: { title: title }
        }});
      }else{null}

      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          toolOption : {
            title: title,
            forSteps: forStep
          }
      }});
      return true;
    }else{
      return false;
    }
  },

////// Repeat First / Verify Reason
  addRepeatOption(reason) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          repeatOption : { 
            key : new Meteor.Collection.ObjectID().valueOf(),
            reason : reason,
            live : true
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  dormantRepeatOption(key, make) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey, 'repeatOption.key': key}, {
        $set : { 
          'repeatOption.$.live' : make
      }});
      return true;
    }else{
      return false;
    }
  },
  removeRepeatOption(badKey, reason) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      //const usedLegacy = BatchDB.findOne({orgKey: Meteor.user().orgKey, 'nonCon.type': reason});
      const usedX = XBatchDB.findOne({orgKey: Meteor.user().orgKey, 'verifications.change': reason});
      if(!usedX) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $pull : { 
            repeatOption : { key : badKey }
        }});
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  ////////////
  
////// Alter Fulfill Reason
  addAlterFulfillOption(reason) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          alterFulfillReasons : reason
      }});
      return true;
    }else{
      return false;
    }
  },
  removeAlterFulfillOption(badReason) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $pull : { 
          alterFulfillReasons : badReason
      }});
      return true;
    }else{
      return false;
    }
  },
  ////////////
  
// NonCon Types
  addNCOption(value) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          nonConOption : value
      }});
      return true;
    }else{
      return false;
    }
  },
  
  removeNCOption(value) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const used = BatchDB.findOne({orgKey: Meteor.user().orgKey, 'nonCon.type': value});
      if(!used) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $pull : { 
            nonConOption : value
        }});
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  
// Smarter NonCon Types
  
  addNonConTypeList(inputValue, inputPrefix) {
    try{
      const newListName = inputValue.toLowerCase().trim();
      const newPrefix = inputPrefix.toLowerCase().trim();
      
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        
        // Check
        const doc = AppDB.findOne({orgKey: Meteor.user().orgKey});
        const dbblTitle = doc.nonConTypeLists.find(
          x => x.listName === newListName );
        const dbblPrefix = doc.nonConTypeLists.find(
          x => x.listPrefix === newPrefix );
        const validPrefix = typeof newPrefix === 'string' && newPrefix.length === 1;
        
        // Insert
        if(!dbblTitle && !dbblPrefix && validPrefix === true) {
          AppDB.update({orgKey: Meteor.user().orgKey}, {
            $push : { 
              nonConTypeLists : { 
                key : new Meteor.Collection.ObjectID().valueOf(),
                listName : newListName,
                listPrefix : newPrefix,
                typeList : []
              }
          }});
          return { pass: true, message: '' };
        
        // Fail 
        }else{
          return { pass: false, message: 'duplicate name or invalid prefix' };
        }
      }else{
        return { pass: false, message: 'insufficient permission' };
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },

  addNonConTypeToList(listKey, inputType) {
    try{
      const validType = typeof inputType === 'string';
      const newType = validType && inputType.toLowerCase().trim();
      
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        
        // Check
        const doc = AppDB.findOne({orgKey: Meteor.user().orgKey});
        const list = !doc || doc.nonConTypeLists.find( x => x.key === listKey );
        if(list) {
          const dbblType = list.typeList.find( x => x.typeText === newType );
          const sequence = list.typeList.length + 1;
          const code = sequence < 10 ? `${list.listPrefix}0${sequence}` : `${list.listPrefix}${sequence}`;
          if(!dbblType) {
            
            // Insert
            AppDB.update({orgKey: Meteor.user().orgKey, 'nonConTypeLists.key': listKey}, {
              $push : { 
                'nonConTypeLists.$.typeList' : { 
                  key : new Meteor.Collection.ObjectID().valueOf(),
                  typeCode : code,
                  typeText : newType,
                  live : true
                }
            }});
            return { pass: true, message: '' };
            
          // Fail
          }else{
            return { pass: false, message: 'duplicate type' };
          }
        }
      }else{
        return { pass: false, message: 'insufficient permission' };
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  switchStateNonConType(listKey, typeKey) {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        
        // Check
        const doc = AppDB.findOne({orgKey: Meteor.user().orgKey});
        const list = !doc || doc.nonConTypeLists.find( x => x.key === listKey );
        if(list) {
          const typeChunk = list.typeList.find( x => x.key === typeKey );
          if(typeChunk) {
            typeChunk.live = !typeChunk.live;
            
            // Update
            AppDB.update({orgKey: Meteor.user().orgKey, 'nonConTypeLists.key': listKey}, {
              $pull : { 
                'nonConTypeLists.$.typeList' : { key : typeKey }
            }});
            AppDB.update({orgKey: Meteor.user().orgKey, 'nonConTypeLists.key': listKey}, {
              $push : { 
                'nonConTypeLists.$.typeList' : {
                  $each: [ typeChunk ],
                  $sort: { typeCode: 1 }
            }}});
            return { pass: true, message: '' };
            
          // Fail
          }else{
            return { pass: false, message: 'unable to change' };
          }
        }
      }else{
        return { pass: false, message: 'insufficient permission' };
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  addNCScale(low, high, max) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          ncScale : {
            low: Number(low),
            high : Number(high),
            max : Number(max)
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  addMissingType(newType) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          missingType : newType || 'missing'
      }});
      return true;
    }else{
      return false;
    }
  },
  
  addAncOp(value) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          ancillaryOption : value
      }});
      return true;
    }else{
      return false;
    }
  },
    
  removeAncOption(value) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const used = BatchDB.findOne({orgKey: Meteor.user().orgKey, 'nonCon.where': value});
      if(!used) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $pull : { 
            ancillaryOption : value
        }});
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  
  addTagOp(value) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          tagOption : value
      }});
      return true;
    }else{
      return false;
    }
  },
  
  setHelpDocs(go) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          helpDocs : go
      }});
      return true;
    }else{
      return false;
    }
  },
  
  setInstruct(go) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          instruct : go
      }});
      return true;
    }else{
      return false;
    }
  },
  
  setTimeClock(go) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          timeClock : go
      }});
      return true;
    }else{
      return false;
    }
  },
  
  sendTestMail(all) {
    if(all) {
      try {
        Meteor.users.update({ orgKey: Meteor.user().orgKey }, {
          $push : { inbox : {
            notifyKey: new Meteor.Collection.ObjectID().valueOf(),
            keyword: 'Sample',
            type: 'test',
            title: 'Sample Notification',
            detail: 'This is a test',
            time: new Date(),
            unread: true
          }
        }},{multi: true});
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }else{
      try {
        Meteor.users.update(Meteor.userId(), {
          $push : { inbox : {
            notifyKey: new Meteor.Collection.ObjectID().valueOf(),
            keyword: 'Sample',
            type: 'test',
            title: 'Sample Notification',
            detail: 'This is a test',
            time: new Date(),
            unread: true
          }
        }});
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
  },
  
  sendErrorMail(errorTitle, errorTime, errorUser, errorMessage) {
    Meteor.users.update({ roles: { $in: ["admin"] } }, {
        $push : { inbox : {
          notifyKey: new Meteor.Collection.ObjectID().valueOf(),
          keyword: 'Error',
          type: 'ERROR',
          title: errorTitle,
          detail: `${errorTime}, ${errorUser}, ${errorMessage}`,
          time: new Date(),
          unread: true
        }
      }},{multi: true});
      
  },

  
  ///////////// CACHES //////////////////
  FORCEcacheUpdate(clientTZ) {
    if(Roles.userIsInRole(Meteor.userId(), 'active')) {
      const key = Meteor.user().orgKey;
      Meteor.call('batchCacheUpdate', key, true);
      Meteor.call('priorityCacheUpdate', key, clientTZ, true);
      Meteor.call('phaseCacheUpdate', key, true);
    }
  },
    
  batchCacheUpdate(accessKey, force) {
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(2, 'hours').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'batchInfo'});
      
      if(force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey}).fetch();
        const batchesX = XBatchDB.find({orgKey: accessKey}).fetch();
        const slim = [...batches,...batchesX].map( x => {
          return Meteor.call('getBasicBatchInfo', x.batch);
        });
        CacheDB.upsert({orgKey: accessKey, dataName: 'batchInfo'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'batchInfo',
            dataSet: slim,
        }});
      }
    }
  },
  
  priorityCacheUpdate(accessKey, clientTZ, force) {
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(1, 'hours').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'priorityRank'});
      
      if(force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey, live: true}).fetch();
        const slim = batches.map( x => {
          return Meteor.call('priorityRank', x._id, clientTZ, accessKey);
        });
        CacheDB.upsert({orgKey: accessKey, dataName: 'priorityRank'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'priorityRank',
            dataSet: slim,
        }});
      }
    }
  },
  
  phaseCacheUpdate(accessKey, force) {
    if(typeof accessKey === 'string') {
      const timeOut = moment().subtract(30, 'minutes').toISOString();
      const currentCache = CacheDB.findOne({
        orgKey: accessKey, 
        lastUpdated: { $gte: new Date(timeOut) },
        dataName:'phaseCondition'});

      if( force || !currentCache ) {
        const batches = BatchDB.find({orgKey: accessKey, live: true}).fetch();
        const batchesX = XBatchDB.find({orgKey: accessKey, live: true}).fetch();
        const slim = [...batches,...batchesX].map( x => {
          return Meteor.call('phaseCondition', x._id, accessKey);
        });
        CacheDB.upsert({orgKey: accessKey, dataName: 'phaseCondition'}, {
          $set : { 
            orgKey: accessKey,
            lastUpdated: new Date(),
            dataName: 'phaseCondition',
            dataSet: slim,
        }});
      }
    }
  },
  
  /*
  backdateTideWall() {
    try {
      const oldDate = moment().subtract(2, 'weeks');
      const replaceDate = oldDate.toISOString();
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : {
          tideWall: replaceDate,
        }});
      return true;
    }catch (err) {
      throw new Meteor.Error(err);
    }
  }
  */
        
});