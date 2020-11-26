// import moment from 'moment';
// Collections \\

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
VariantDB = new Mongo.Collection('variantdb');
BatchDB = new Mongo.Collection('batchdb');
XBatchDB = new Mongo.Collection('xbatchdb');
//ItemDB = new Mongo.Collection('itemdb');// future plans, DO NOT enable
TraceDB = new Mongo.Collection('tracedb');

CacheDB = new Mongo.Collection('cachedb');


Meteor.publish('loginData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(this.userId && orgKey){
    return [
      Meteor.users.find({_id: this.userId},
        {fields: {
          'username': 1,
        }}),
      AppDB.find({orgKey: orgKey}, 
        {fields: { 
          'timeClock': 1
        }}),
      ];
  }else{
    return this.ready();
  }
});

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
          'minorPIN': 0,
          'phases': 0,
          'toolOption': 0
        }}),
      CacheDB.find({dataName: 'lockingTask'})
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
        }})
    ];
  }else if(user && orgKey) {
    return [
      Meteor.users.find({orgKey: orgKey},
        {fields: {
          'username': 1,
          'org': 1,
          'roles': 1,
          'engaged': 1,
          'proTimeShare' : 1
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


// People
Meteor.publish('bCacheData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(!this.userId){
    return this.ready();
  }else{
    return [
      TraceDB.find({orgKey: orgKey}, {
        fields: {
          'batch': 1,
          'batchID': 1,
          'isWhat': 1,
          // 'describe': 1
        }
      })
    ];
  }
});

// Upstream
Meteor.publish('traceDataLive', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  Meteor.defer( ()=>{ Meteor.call('rebuildOpenTrace'); });
  if(!this.userId){
    return this.ready();
  }else{
    return [
      TraceDB.find({
        orgKey: orgKey, live: true, onFloor: false }, {
        fields: {
          // 'lastUpserted': 1,
          // 'lastUpdated': 1,
          'batch': 1,
          'batchID': 1,
          // 'salesOrder': 1,
          'isWhat': 1,
          'describe': 1,
          'quantity': 1,
          'serialize': 1,
          'riverChosen': 1,
          // 'live': 1,
          'salesEnd': 1,
          'shipAim': 1,
          // 'completed': 1,
          // 'completedAt': 1,
          'lateLate': 1,
          'isActive': 1,
          // 'onFloor': 1,
          // 'branchCondition': 1,
          'quote2tide': 1,
          'estSoonest': 1,
          'estLatestBegin': 1,
          'bffrRel': 1,
          'estEnd2fillBuffer': 1
        }
      })
    ];
  }
});
// Overview
Meteor.publish('traceDataActive', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  Meteor.defer( ()=>{ Meteor.call('rebuildOpenTrace'); });
  if(!this.userId){
    return this.ready();
  }else{
    return [
      TraceDB.find({
        orgKey: orgKey, 
        $or: [ { live: true }, { 'isActive.hasDay': { $gt: 0 } } ]
      }, {
        fields: {
          // 'lastUpserted': 1,
          // 'lastUpdated': 1,
          'batch': 1,
          'batchID': 1,
          // 'salesOrder': 1,
          'isWhat': 1,
          'describe': 1,
          'quantity': 1,
          'serialize': 1,
          'riverChosen': 1,
          // 'live': 1,
          'salesEnd': 1,
          'shipAim': 1,
          // 'completed': 1,
          // 'completedAt': 1,
          // 'lateLate': 1,
          'isActive': 1,
          'onFloor': 1,
          'branchCondition': 1,
          'quote2tide': 1,
          'estSoonest': 1,
          'estLatestBegin': 1,
          'bffrRel': 1,
          'estEnd2fillBuffer': 1
        }
      })
    ];
  }
});
// Downstream
Meteor.publish('traceDataOpen', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  Meteor.defer( ()=>{ Meteor.call('rebuildOpenTrace'); });
  const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
  if(!this.userId){
    return this.ready();
  }else{
    return [
      TraceDB.find({
        orgKey: orgKey,
        $or: [ { live: true }, { salesEnd: { $gte: ystrday } } ]
      }, {
        fields: {
          // 'lastUpserted': 1,
          // 'lastUpdated': 1,
          'batch': 1,
          'batchID': 1,
          'salesOrder': 1,
          'isWhat': 1,
          'describe': 1,
          'quantity': 1,
          'serialize': 1,
          // 'riverChosen': 1,
          'live': 1,
          'salesEnd': 1,
          'shipAim': 1,
          'completed': 1,
          'completedAt': 1,
          'lateLate': 1,
          'isActive': 1,
          'onFloor': 1,
          'branchCondition': 1,
          'quote2tide': 1,
          'estSoonest': 1,
          'estLatestBegin': 1,
          'bffrRel': 1,
          'estEnd2fillBuffer': 1
        }
      })
    ];
  }
});

/*Meteor.publish('cacheData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  Meteor.defer( ()=>{ Meteor.call('priorityCacheUpdate', orgKey); });
  if(!this.userId){
    return this.ready();
  }else{
    return [
      CacheDB.find({orgKey: orgKey, dataName: 'priorityRank' }, {// structured: true}, {
        fields: {
          'orgKey': 0,
          'structured' : 0,
          'minified': 0
        }})
    ];
  }
});*/
// PartsPlus
Meteor.publish('partsPlusCacheData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  // Meteor.defer( ()=>{ Meteor.call('partslistCacheUpdate', orgKey); });
  if(!this.userId){
    return this.ready();
  }else{
    return [
      CacheDB.find({orgKey: orgKey, dataName: 'partslist'}, {
        fields: {
          'orgKey': 0,
          'structured' : 0,
          'minified': 0
        }})
    ];
  }
});

// Overview
Meteor.publish('shaddowData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(!this.userId){
    return this.ready();
  }else{
    return [
      BatchDB.find({orgKey: orgKey, live: true}, {
        sort: {batch:-1},
        fields: {
          'batch': 1,
          //'widgetId': 1,
          //'versionKey': 1,
          'live': 1,
          'finishedAt': 1,
          'salesOrder': 1,
          'end': 1,
          'releases': 1
        }}),
      XBatchDB.find({orgKey: orgKey, live: true}, {
        sort: {batch:-1},
        fields: {
          'batch': 1,
          //'groupId': 1,
          //'widgetId': 1,
          //'versionKey': 1,
          'live': 1,
          'salesOrder': 1,
          'salesEnd': 1,
          'completed': 1,
          //'completedAt': 1,
          // 'serialize': 1,
          'releases': 1
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
          'group': 1,
          'alias': 1,
          'wiki' : 1
        }}),
      
      WidgetDB.find({orgKey: orgKey}, {
        fields: {
          'widget': 1,
          'describe': 1,
          'groupId': 1,
        }}),
        
      VariantDB.find({orgKey: orgKey}, {
        fields: {
          'groupId': 1,
          'widgetId': 1,
          'versionKey': 1,
          'variant': 1
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
          'floorRelease': 0,
          'lockTrunc': 0
        }}),
      XBatchDB.find({batch: batch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'shareKey': 0,
          'lockTrunc': 0
        }}),
      WidgetDB.find({_id: wID, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'versions': 0
        }}),
      VariantDB.find({widgetId: wID, orgKey: orgKey}, {
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
          'group': 1,
          'alias': 1,
          'hibernate': 1
          // 'orgKey': 0,
          // 'shareKey': 0,
        }}),
      WidgetDB.find({orgKey: orgKey}, {
        fields: {
          'widget': 1,
          'describe': 1,
          'groupId': 1,
        }}),
        
      VariantDB.find({orgKey: orgKey}, {
        fields: {
          'groupId': 1,
          'widgetId': 1,
          'versionKey': 1,
          'variant': 1
        }}),
      
      BatchDB.find({orgKey: orgKey}, {
        sort: {batch:-1},
        fields: {
            'batch': 1,
            'widgetId': 1,
            'versionKey': 1,
            'tags': 1,
            'live': 1,
            'lock': 1,
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
            'lock': 1,
            'salesOrder': 1,
            'completed': 1,
            'completedAt': 1
          }})
      ];
    }
});

Meteor.publish('hotDataEx', function(dataRequest, hotWidget){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  
  let hothotWidgetID = false;
  let hothotWidget = hotWidget || false;
  
  if(!hothotWidget) {
    const hotBatchXBatch = BatchDB.findOne({ batch: dataRequest }) ||
                           XBatchDB.findOne({ batch: dataRequest });
    if(hotBatchXBatch) {
      const maybe = WidgetDB.findOne({ _id: hotBatchXBatch.widgetId });
      if(maybe) {
        hothotWidgetID = maybe._id;
        hothotWidget = maybe.widget;
      }
    }
  }else{
    const otherwise = WidgetDB.findOne({ _id: hotWidget }) ||
                      WidgetDB.findOne({ widget: hotWidget });
    if(otherwise) {
      hothotWidgetID = otherwise._id;
      hothotWidget = otherwise.widget;
    }
  }
                    
  if(!this.userId){
    return this.ready();
  }else{
    if( dataRequest === 'groups' ) {
      return [
        GroupDB.find({orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'shareKey': 0,
        }}),
        WidgetDB.find({orgKey: orgKey}, {
          fields: {
            'createdAt': 1
        }}),
        VariantDB.find({orgKey: orgKey}, {
          fields: {
            'createdAt': 1
        }}),
      ];
    }else if( dataRequest === 'widget' ) {
      return [
        WidgetDB.find({_id: hothotWidgetID, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'versions': 0
          }}),
        VariantDB.find({widgetId: hothotWidgetID, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
          }}),
      ];
    }else {
      return [
        WidgetDB.find({widget: hothotWidget, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'versions': 0
          }}),
        VariantDB.find({widgetId: hothotWidgetID, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
          }}),
        BatchDB.find({batch: dataRequest, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'shareKey': 0,
            'floorRelease': 0,
            // 'lockTrunc': 0
          }}),
        XBatchDB.find({batch: dataRequest, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'shareKey': 0,
            // 'lockTrunc': 0
        }})
      ];
    }
  }
});
  
