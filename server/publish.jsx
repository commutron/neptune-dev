// import moment from 'moment';
// Collections \\

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');
XBatchDB = new Mongo.Collection('xbatchdb');
//ItemDB = new Mongo.Collection('itemdb');// future plans, DO NOT enable
ArchiveDB = new Mongo.Collection('archivedb');

CacheDB = new Mongo.Collection('cachedb');

Meteor.publish('appData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(!this.userId){
    return this.ready();
  }else if(!orgKey) {
    return [
      Meteor.users.find({_id: this.userId},
        {fields: {
          'services': 0,
          'orgKey': 0,
        }}),
      ];
  }else if(user) {
    return [
      Meteor.users.find({_id: this.userId},
        {fields: {
          'services': 0,
          'orgKey': 0
        }}),
      AppDB.find({orgKey: orgKey}, 
        {fields: { 
          'orgKey': 0,
          'orgPIN': 0,
          'minorPIN': 0
        }}),
      ];
  }else{
    return this.ready();
  }
});

Meteor.publish('usersData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  const admin = Roles.userIsInRole(this.userId, 'admin');
  if(!this.userId){
    return this.ready();
  }else if(admin) {
    return [
      Meteor.users.find({},
        {fields: {
          'services': 0,
          'orgKey': 0,
          'usageLog': 0,
          'watchlist': 0,
          'inbox': 0,
          'breadcrumbs': 0
        }}),
      ];
  }else if(user && orgKey) {
    return [
      Meteor.users.find({orgKey: orgKey},
        {fields: {
          'username': 1,
          'org': 1,
          'roles': 1,
          'engaged': 1
        }}),
      ];
  }else{null}
});

Meteor.publish('usersDataDebug', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  const admin = Roles.userIsInRole(this.userId, 'admin');
  if(!this.userId || !admin){
    return this.ready();
  }else{
    return [
      Meteor.users.find({ orgKey: orgKey, roles: { $in: ["debug"] } },
        {fields: {
          'services': 1,
          'usageLog': 1,
          'watchlist': 1,
          'inbox': 1,
          'breadcrumbs': 1,
          'engaged': 1
        }}),
      ];
  }
});

Meteor.publish('eventsData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  Meteor.defer( ()=>{
    Meteor.call('batchCacheUpdate', orgKey);
  });
  if(!this.userId){
    return this.ready();
  }else{
    return [
      BatchDB.find({orgKey: orgKey}, {
        fields: {
          'batch': 1,
          'events': 1,
          'tide': 1
        }}),
      CacheDB.find({orgKey: orgKey}, {
        fields: {
          'orgKey': 0
        }}),
      ];
  }
});

// Overview
Meteor.publish('shaddowData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  Meteor.defer( ()=>{
    Meteor.call('batchCacheUpdate', orgKey);
  });
  if(!this.userId){
    return this.ready();
  }else{
    return [
      BatchDB.find({orgKey: orgKey, live: true}, {
        sort: {batch:-1},
        fields: {
          'batch': 1,
          'widgetId': 1,
          'versionKey': 1,
          'live': 1,
          'finishedAt': 1,
          'floorRelease': 1
        }}),
      XBatchDB.find({orgKey: orgKey, live: true}, {
        sort: {batch:-1},
        fields: {
          'batch': 1,
          'groupId': 1,
          'widgetId': 1,
          'versionKey': 1,
          'live': 1,
          'completed': 1,
          'completedAt': 1,
          'releases': 1
        }}),
      CacheDB.find({orgKey: orgKey}, {
        fields: {
          'orgKey': 0
        }}),
      ];
  }
});

// production
Meteor.publish('thinData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(!this.userId){
    return this.ready();
  }else{
    return [
      GroupDB.find({orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'shareKey': 0,
        }}),
      
      WidgetDB.find({orgKey: orgKey}, {
        fields: {
          'widget': 1,
          'describe': 1,
          'groupId': 1,
        }}),
      
      BatchDB.find({orgKey: orgKey}, {
        sort: {batch:-1},
        fields: {
          'batch': 1,
          'widgetId': 1,
          'versionKey': 1,
          'live': 1,
          'finishedAt': 1,
        }}),
          
      XBatchDB.find({orgKey: orgKey}, {
        sort: {batch:-1},
        fields: {
          'batch': 1,
          'groupId': 1,
          'widgetId': 1,
          'versionKey': 1,
          'live': 1,
          'completed': 1,
          'completedAt': 1,
        }})
      ];
  }
});

Meteor.publish('hotDataPlus', function(batch){
  const user = Meteor.users.findOne({_id: this.userId});
  const valid = user ? true : false;
  const orgKey = valid ? user.orgKey : false;
  const bData = BatchDB.findOne({batch: batch, orgKey: orgKey});
  const xbData = XBatchDB.findOne({batch: batch, orgKey: orgKey});
  const wID = !bData ? !xbData ? false : xbData.widgetId : bData.widgetId;
  if(!this.userId){
    return this.ready();
  }else{
    return [
      BatchDB.find({batch: batch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'shareKey': 0,
          'events': 0,
        }}),
      XBatchDB.find({batch: batch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'shareKey': 0
        }}),
      WidgetDB.find({_id: wID, orgKey: orgKey}, {
        fields: {
          'orgKey': 0
        }})
      ];
  }
});

// Explore
Meteor.publish('skinnyData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(!this.userId){
    return this.ready();
  }else{
    return [
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
            'tags': 1,
            'live': 1,
            'salesOrder': 1,
            'finishedAt': 1,
          }}),
    
      XBatchDB.find({orgKey: orgKey}, {
        sort: {batch:-1},
        fields: {
            'batch': 1,
            'groupId': 1,
            'widgetId': 1,
            'versionKey': 1,
            'tags': 1,
            'live': 1,
            'salesOrder': 1,
            'completed': 1,
            'completedAt': 1
          }})
      ];

    }
});

Meteor.publish('hotDataEx', function(batch){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(!this.userId){
    return this.ready();
  }else{
    return [
      BatchDB.find({batch: batch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'shareKey': 0,
        }}),
      XBatchDB.find({batch: batch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'shareKey': 0
        }})
      ];
  }
});


/*alternitive components search data
Meteor.publish('compData', function(cNum){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  return [
    GroupDB.find({orgKey: orgKey}, {
      fields: {
          'alias': 1,
        }}),
    WidgetDB.find({orgKey: orgKey, 'versions.assembly.component': cNum}, {
      fields: {
          'widget': 1,
          'versions.versionKey': 1,
          'versions.version': 1,
          'versions.assembly': 1
        }}),
    BatchDB.find({orgKey: orgKey, live: true}, {
      sort: {batch:-1},
      fields: {
          'batch': 1,
          'versionKey': 1,
      }})
    ];
});
*/
  
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
/////////////////////////////////////////////////////////////////
  
// diagnose data for development
/*
Meteor.publish('allData', function(dev){
  if(dev) {
    return [
      GroupDB.find(),
      WidgetDB.find(),
      BatchDB.find(),
      ArchiveDB.find()
      ];
  }else{
    return this.ready();
  }
});
*/


//////////////////////////////////////////////////////////////

/*

// Publish the current size of a collection.
Meteor.publish('WIPData', function (roomId) {
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
    
  let count = 0;
  let initializing = true;
  // `observeChanges` only returns after the initial `added` callbacks have run.
  // Until then, we don't want to send a lot of `changed` messages—hence
  // tracking the `initializing` state.
  const handle = BatchDB.find({ orgKey: orgKey }).observeChanges({
    added: (id) => {
      count += 1;
      if (!initializing) {
        this.changed('counts', {}, { count });
      }
    },
    removed: (id) => {
      count -= 1;
      this.changed('counts', {}, { count });
    }
    // We don't care about `changed` events.
  });
  // Instead, we'll send one `added` message right after `observeChanges` has
  // returned, and mark the subscription as ready.
  initializing = false;
  this.added('counts', roomId, { count });
  this.ready();
  // Stop observing the cursor when the client unsubscribes. Stopping a
  // subscription automatically takes care of sending the client any `removed`
  // messages.
  this.onStop(() => handle.stop());
});

*/