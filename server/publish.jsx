// Collections \\

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');
ArchiveDB = new Mongo.Collection('archivedb');

Meteor.publish("appData", function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  const admin = Roles.userIsInRole(this.userId, 'admin');
  if(admin) {
    return [
      AppDB.find({}, {fields: { 'orgKey': 0 }}),
      Meteor.users.find({},
        {fields: {
          'services': 0,
          'orgKey': 0,
          'pin': 0
        }}),
      ];
  }else if(!orgKey) {
    return [
      Meteor.users.find({_id: this.userId},
        {fields: {
          'services': 0,
          'orgKey': 0,
          'pin': 0,
        }}),
      ];
  }else if(user) {
    return [ 
      AppDB.find({orgKey: orgKey}, {fields: { 'orgKey': 0 }}),
      Meteor.users.find({orgKey: orgKey},
        {fields: {
          'services': 0,
          'orgKey': 0,
          'pin': 0,
        }}),
      ];
  }else{null}
});


Meteor.publish("skinnyData", function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  return [
    /*
    GroupDB.find({orgKey: orgKey}, {
      fields: {
          'group': 1,
          'alias': 1,
        }}),
    
    WidgetDB.find({orgKey: orgKey}, {
      fields: {
          'widget': 1,
          'describe': 1,
          'groupId': 1,
          'versions.versionKey': 1,
          'versions.version': 1
        }}),
        */
    GroupDB.find({orgKey: orgKey}, {
      fields: {
          'orgKey': 0,
          'shareKey': 0,
        }}),
    
    WidgetDB.find({orgKey: orgKey}, {
      fields: {
          'orgKey': 0
        }}),
    
    BatchDB.find({orgKey: orgKey}, {
      sort: {batch:-1},
      fields: {
          'batch': 1,
          'widgetId': 1,
          'versionKey': 1,
          'active': 1,
          'finishedAt': 1,
          //'items.serial': 1,
          //'items.finishedAt': 1
        }}),
    
    ];
});

Meteor.publish('hotData', function(batch){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
              
  return [
        
    BatchDB.find({batch: batch, orgKey: orgKey}, {
      fields: {
        'orgKey': 0,
        'shareKey': 0
      }})
            
    ];
    
});

/*
// somethings missing, its not adding the information from widgetDB but
// it is resending the whole groupDB
// including orgKey and shareKey

Meteor.publish('groupwidgetData', function() {
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  
  var sub = this, widgetHandles = [], groupHandle = null;

  // send over the top two comments attached to a single post
  function publishGroupWidgets(groupId) {
    var widgetsCursor = WidgetDB.find({groupId: groupId, orgKey: orgKey});
    widgetHandles[groupId] = 
      Meteor.Collection._publishCursor(widgetsCursor, sub, 'widget');
  }

  groupHandle = GroupDB.find({}).observeChanges({
    added: function(id, group) {
      publishGroupWidgets(group._id);
      sub.added('groupdb', id, group);
    },
    changed: function(id, fields) {
      sub.changed('groupdb', id, fields);
    },
    removed: function(id) {
      // stop observing changes on the post's comments
      widgetHandles[id] && widgetHandles[id].stop();
      // delete the post
      sub.removed('groupdb', id);
    }
  });

  sub.ready();

  // make sure we clean everything up (note `_publishCursor`
  //   does this for us with the comment observers)
  sub.onStop(function() { groupHandle.stop(); });
});

*/

/*

Meteor.publish("allData", function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  return [ 
    GroupDB.find({orgKey: orgKey}, {
      fields: {
        'orgKey': 0,
        'shareKey': 0
      }}),
        
    WidgetDB.find({orgKey: orgKey}, {
      fields: {
        'orgKey': 0
      }}),
        
    BatchDB.find({orgKey: orgKey}, {
      sort: {batch:-1},
      fields: {
        'orgKey': 0,
        'shareKey': 0
      }}),
        
    ArchiveDB.find({orgKey: orgKey}, {
      fields: {
        'orgKey': 0
      }}),
    ];
});

*/
  