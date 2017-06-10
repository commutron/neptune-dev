// Collections \\

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');
ArchiveDB = new Mongo.Collection('archivedb');

Meteor.publish("appData", function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  const email = user ? user.emails : false;
  const staircase = email ? Meteor.settings.devMaster === email[0].address : false;
  if(staircase) {
    return [
      AppDB.find(),
      Meteor.users.find({},
        {fields: {
          'services': 0,
          // 'orgKey': 0,
          // 'pin': 0
        }}),
      ];
  }else if(user) {
    return [ 
      AppDB.find({orgKey: orgKey}),
      Meteor.users.find({orgKey: orgKey},
        {fields: {
          'services': 0,
          // 'orgKey': 0,
          // 'pin': 0,
        }}),
      ];
  }else{null}
});


/*
Meteor.publish("allBatch", function(){
  return BatchDB.find({}, {sort: {batch:-1}});
});

Meteor.publish("allGroup", function(){
  return GroupDB.find();  
});

Meteor.publish("allStats", function(){
  return StatsDB.find();
});
*/
Meteor.publish("allData", function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  return [ 
    //AppDB.find({orgKey: orgKey}),
    /*
    Meteor.users.find({orgKey: orgKey},
      {fields: {
        '_id': 1,
        'username': 1,
        'active': 1,
        'org': 1,
        'orgKey': 1, //remove for production
        'admin': 1,
        'power': 1,
        'inspector': 1,
        'tester': 1,
        'creator': 1,
      }}),
      */
    GroupDB.find({orgKey: orgKey}),
    WidgetDB.find({orgKey: orgKey}),
    BatchDB.find({orgKey: orgKey}, {sort: {batch:-1}}),
    ArchiveDB.find({orgKey: orgKey})
    ];
});

Meteor.publish('liveData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  return [ 
    //AppDB.find({orgKey: orgKey}),
    /*
    Meteor.users.find({orgKey: orgKey},
      {fields: {
        '_id': 1,
        'username': 1,
        'active': 1,
        'org': 1,
        'orgKey': 1, //remove for production
        'power': 1,
        'inspector': 1,
        'tester': 1,
        'creator': 1,
      }}),
      */
    GroupDB.find({orgKey: orgKey}),
    WidgetDB.find({orgKey: orgKey}),
    BatchDB.find({orgKey: orgKey, active:true}, {sort: {batch:-1}}), 
    ArchiveDB.find({orgKey: orgKey})
    ];
});
  