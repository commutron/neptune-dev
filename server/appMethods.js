Meteor.startup(function () {  
  // ensureIndex is depreciated 
  // but the new createIndex errors as "not a function"
  BatchDB._ensureIndex({ batch : 1, 'items.serial' : 1 }, { unique: true });
  GroupDB._ensureIndex({ group : 1}, { unique: true });
  WidgetDB._ensureIndex({ widget : 1, 'versions.version' : 1 }, { unique: true });
});

Meteor.methods({
  
  addSetting() {
    const orgKey = Meteor.user().orgKey;
    const orgName = Meteor.user().org;
    var dbK = AppDB.findOne({orgKey: orgKey});
    var dbN = AppDB.findOne({org: orgName});
    if(orgKey) {
      if(!dbK && !dbN) {
        AppDB.insert({
          org: orgName,
          orgKey: orgKey,
          createdAt: new Date(),
          toolOption: [],
          trackOption: [],
          lastTrack: {
            key: 'f1n15h1t3m5t3p',
            step: 'finish',
            type: 'finish',
            how: 'finish'
          },
          nonConOption: [],
          ncScale: {
            low: Number(5),
            high: Number(10),
            max: Number(25)
          },
          ancillaryOption: [],
          tagOption: [],
          instruct: '',
          helpDocs: '',
          timeClock: '',
          latestSerial: {
            nineDigit: Number(123456789),
            tenDigit: Number(1234567890)
          },
          ndaMode: false
        });
        Roles.addUsersToRoles(Meteor.userId(), ['active', 'admin']);
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  
  
  addTrackOption(flatTrack) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      
      const split = flatTrack.split('|');
      const step = split[0];
      const type = split[1];
      const trackObj = 
      { 
        'key' : new Meteor.Collection.ObjectID().valueOf(),
        'step' : step,
        'type' : type,
        'how' : false
      };
      
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $push : { 
          trackOption : trackObj
      }});
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
  
  // clear tool option
  clearToolOp() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      AppDB.update({orgKey: Meteor.user().orgKey}, {
        $set : { 
          toolOption : []
      }});
      return true;
    }else{
      return false;
    }
  },
  
  // new tool option
  addToolOp(title, forStep) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
/*
      const doc = AppDB.findOne({orgKey: Meteor.user().orgKey});
      if(doc.toolOption.find( x => x.title === title )) {
        AppDB.update({orgKey: Meteor.user().orgKey, 'toolOption.title': title}, {
          $pull : {
            toolOption: { title: title }
        }});
      }else{null}
*/
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
  
  
});