//import moment from 'moment';
// Collections \\

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');
ArchiveDB = new Mongo.Collection('archivedb');

Meteor.publish('appData', function(){
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
          //'pin': 0
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

Meteor.publish('shaddowData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  return [
    GroupDB.find({orgKey: orgKey}, {
      fields: {
          'alias': 1,
        }}),
    
    WidgetDB.find({orgKey: orgKey}, {
      fields: {
          'widget': 1,
          'versions.versionKey': 1,
          'versions.version': 1
        }}),
    BatchDB.find({orgKey: orgKey}, {
      sort: {batch:-1},
      fields: {
          'batch': 1,
          'widgetId': 1,
          'versionKey': 1,
          'active': 1,
          'finishedAt': 1,
        }}),
    ];
});

Meteor.publish('skinnyData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
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
          'active': 1,
          'finishedAt': 1,
          //'items.serial': 1,
          //'items.finishedAt': 1
        }})
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

Meteor.publish('hotDataEx', function(batch){
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

Meteor.publish('blockData', function(active) {
  if(active) {
    const user = Meteor.users.findOne({_id: this.userId});
    const orgKey = user ? user.orgKey : false;
                
    return [
          
      BatchDB.find({orgKey: orgKey}, {
        fields: {
          'blocks': 1
        }})
              
      ];
    
  }else{
    return this.ready();
  }
    
});

Meteor.publish('scrapData', function(active) {
  if(active) {
    const user = Meteor.users.findOne({_id: this.userId});
    const orgKey = user ? user.orgKey : false;
                
    return [
          
      BatchDB.find({orgKey: orgKey, 'items.history.type': 'scrap'}, {
        fields: {
          'items.history': 1,
          'items.serial': 1,
          'items.finishedAt': 1
        }})
              
      ];
      
  }else{
    return this.ready();
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
    BatchDB.find({orgKey: orgKey, active: true}, {
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