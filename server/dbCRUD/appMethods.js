// import { Random } from 'meteor/random';
// import moment from 'moment';

Meteor.startup(function () {  
  // ensureIndex is depreciated but new createIndex errors as "not a function"
  AppDB._ensureIndex({ org : 1, orgKey: 1 }, { unique: true });
  Meteor.users._ensureIndex({ orgKey: 1, username : 1 }, { unique: true });
  XBatchDB._ensureIndex({ orgKey: 1, batch: 1 }, { unique: true });
  XSeriesDB._ensureIndex({ orgKey: 1, batch: 1, 'items.serial' : 1 }, { unique: true });
  XRapidsDB._ensureIndex({ orgKey: 1, rapid: 1, extendBatch: 1 }, { unique: true });
  
  GroupDB._ensureIndex({ orgKey: 1, group : 1 }, { unique: true });
  WidgetDB._ensureIndex({ orgKey: 1, widget : 1 }, { unique: true });
  VariantDB._ensureIndex({ orgKey: 1, versionKey : 1 }, { unique: true });
  CacheDB._ensureIndex({ dataName : 1 }, { unique: true });
  TraceDB._ensureIndex({ batchID : 1 }, { unique: true });
});

Meteor.methods({
  /*
  addFirstSetting() {
    const orgKey = new Meteor.Collection.ObjectID().valueOf();
    AppDB.insert({
      org: 'crew',
      orgKey: orgKey,
      orgPIN: '0000',
      createdAt: new Date(),
      branches: [
        {
          brKey: 't3rm1n2t1ng8r2nch',
          branch: 'complete',
          common: 'done',
          position: Number(0),
          open: true,
          reqClearance: false,
          reqConsumable: false,
          reqProblemDam: true,
          reqUserLock: true,
          buildMethods: [],
          inspectMethods: [],
        }
      ],
      toolOption: [],
      trackOption: [],
      lastTrack: {
        key: 'f1n15h1t3m5t3p',
        step: 'finish',
        type: 'finish',
        branchKey: 't3rm1n2t1ng8r2nch',
        how: 'finish'
      },
      countOption: [],
      nonConTypeLists: [],
      ncScale: {
        low: Number(5),
        high: Number(10),
        max: Number(25)
      },
      onScale: {
        low: Number(50),
        high: Number(70),
        max: Number(90)
      },
      missingType: 'missing',
      ancillaryOption: [],
      repeatOption: [],
      alterFulfillReasons: [],
      tagOption: [],
      instruct: '',
      helpDocs: '',
      timeClock: '',
      latestSerial: {
        eightDigit: Number(12345678),
        nineDigit: Number(123456789),
        tenDigit: Number(1234567890)
      },
      priorityScale : {
        low: Number(66),
        high: Number(22),
        max: Number(0),
      },
      lockType: 'timer',
      nonWorkDays: []
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
// Clearly this is not the most secure.
// If Exposure Is Higher This Should Be Encrypted
  randomizePIN(accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;
    if(privateKey) {
      const rndm4 = Math.floor( Math.random() * 10000 ).toString().padStart(4, 0);
      AppDB.update({orgKey: privateKey}, {
        $set : { 
          orgPIN : rndm4
      }});
      return true;
    }
  },
  revealPIN() {
    const pinPower = Roles.userIsInRole(Meteor.userId(), ['admin', 'peopleSuper']);
    const org = AppDB.findOne({ orgKey: Meteor.user().orgKey });
    const orgPIN = org ? org.orgPIN : false;
    if(pinPower && orgPIN) {
      return orgPIN;
    }else{
      return false;
    }
  },
  
  // / / / / / / / / / / / / / / / 
  // Branches
  addBranchOption(nameVal, commonVal) {
    const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
    if(appDoc && Roles.userIsInRole(Meteor.userId(), 'admin')) {
      try{
        const nextPos = appDoc.branches.length;
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $push : { 
            branches : {
              brKey: new Meteor.Collection.ObjectID().valueOf(),
              branch: nameVal,
              common: commonVal,
              position: Number(nextPos),
              open: true,
              reqClearance: false,
              reqConsumable: false,
              reqProblemDam: false,
              reqUserLock: false,
              buildMethods: [],
              inspectMethods: [],
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
  
  editBranchConfig(key, posVal, commonVal, opVal, clrVal, prbVal, usrVal, conVal, bMthdArr, iMthdArr) {
    const chB = Array.isArray(bMthdArr);
    const chI = Array.isArray(iMthdArr);
    
    if(chB && chI && Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey, 'branches.brKey': key}, {
        $set : { 
          'branches.$.common': commonVal,
          'branches.$.position': Number(posVal),
          'branches.$.open': opVal,
          'branches.$.reqClearance': clrVal,
          'branches.$.reqConsumable': conVal,
          'branches.$.reqProblemDam': prbVal,
          'branches.$.reqUserLock': usrVal,
          'branches.$.buildMethods': bMthdArr,
          'branches.$.inspectMethods': iMthdArr
      }});
      return true;
    }else{
      return false;
    }
  },
  
  canBranchRemove(keyCheck) {
    try{
      const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
      const used = appDoc.trackOption.find( x => x.branchKey && x.branchKey === keyCheck );
      if(!used && keyCheck !== 't3rm1n2t1ng8r2nch') {
        return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  removeBranchOption(badBrKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      try{
        const isFree = Meteor.call('canBranchRemove', badBrKey);
        if(isFree) {
          AppDB.update({orgKey: Meteor.user().orgKey}, {
            $pull : { 
              branches : { brKey : badBrKey }
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
  
  addTrackStepOption(step, type, branch) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          trackOption : { 
            'key' : new Meteor.Collection.ObjectID().valueOf(),
            'step' : step,
            'type' : type,
            'branchKey' : branch,
            'how' : false
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  editTrackStepOption(opKey, step, type, branch) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey, 'trackOption.key' : opKey}, {
        $set : { 
          'trackOption.$.step' : step,
          'trackOption.$.type' : type,
          'trackOption.$.branchKey' : branch
          }
      });
      return true;
    }else{
      return false;
    }
  },
  
  endTrack(lastStep, lastHow) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const trackObj = 
      { 
        'key' : 'f1n15h1t3m5t3p',
        'step' : lastStep,
        'type' : 'finish',
        'branchKey': 't3rm1n2t1ng8r2nch',
        'how' : lastHow
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
    const branch = split[2];
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          countOption : { 
            key : new Meteor.Collection.ObjectID().valueOf(),
            gate : gate,
            type : type,
            branchKey : branch
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  editCountOption(opKey, gate, type, branch) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey, 'countOption.key' : opKey}, {
        $set : { 
          'countOption.$.gate' : gate,
          'countOption.$.type' : type,
          'countOption.$.branchKey' : branch
          }
      });
      return true;
    }else{
      return false;
    }
  },

  ////////// Lock Unlock control type ////////////////
  setLockType(lockVal) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      
      const lockType = typeof lockVal === 'string' ? lockVal : 'timer';
      
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          lockType : lockType
      }});
      return true;
    }else{
      return false;
    }
  },
  
// set last serial
  setlastestSerial(serialEight, serialNine, serialTen) {
    const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
    const regex10 = RegExp(/^(\d{10})$/);
    const regex9 = RegExp(/^(\d{9})$/);
    const regex8 = RegExp(/^(\d{8})$/);
                    
    const validNums = regex8.test(serialEight) && 
                      regex9.test(serialNine) && 
                      regex10.test(serialTen);

    if(auth && validNums) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          'latestSerial.eightDigit': Number(serialEight),
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
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $pull : { 
          repeatOption : { key : badKey }
      }});
      return true;
    }else{
      return false;
    }
  },
  
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
        const validPrefix = typeof newPrefix === 'string' && 
                              newPrefix.length > 0 && newPrefix.length < 3;
        
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
  
  setDefaultNCTL(nclKey, newValue) {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        let setOp = !newValue || newValue === 'false' ? false : true;
        
        AppDB.update({orgKey: Meteor.user().orgKey, 'nonConTypeLists.key': nclKey}, {
          $set : { 
            'nonConTypeLists.$.defaultOn' : setOp 
          }
        });
        return true;
      }else{
        return false;
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
        
        const doc = AppDB.findOne({orgKey: Meteor.user().orgKey});
        const list = !doc || doc.nonConTypeLists.find( x => x.key === listKey );
        if(list) {
          const dbblType = list.typeList.find( x => x.typeText === newType );
          const sequence = list.typeList.length + 1;
          const code = sequence < 10 ? `${list.listPrefix}0${sequence}` : `${list.listPrefix}${sequence}`;
          if(!dbblType) {
            
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
  
  addOnTargetScale(low, high) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          onScale : {
            low: Number(low),
            high : Number(high)
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
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $pull : { 
          ancillaryOption : value
      }});
      return true;
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
  
  ////// no work days
  addNonWorkDay(newDay) {
    if(Roles.userIsInRole(Meteor.userId(), ['admin', 'peopleSuper'])) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $addToSet : { 
          nonWorkDays : newDay
      }});
      return true;
    }else{
      return false;
    }
  },
  removeNonWorkDay(badDay) {
    if(Roles.userIsInRole(Meteor.userId(), ['admin', 'peopleSuper'])) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $pull : { 
          nonWorkDays : badDay
      }});
      return true;
    }else{
      return false;
    }
  },
  
  resetNonWorkDay() {
    try {
      if(Roles.userIsInRole(Meteor.userId(), ['admin', 'peopleSuper'])) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $set : {
            nonWorkDays: [],
          }});
        return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  }
        
});