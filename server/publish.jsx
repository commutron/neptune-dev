import Config from '/server/hardConfig.js';
import moment from 'moment';
import 'moment-timezone';

// Collections \\
AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
VariantDB = new Mongo.Collection('variantdb');
BatchDB = new Mongo.Collection('batchdb');//X.LEGACY.X\\
XBatchDB = new Mongo.Collection('xbatchdb');
XSeriesDB = new Mongo.Collection('xseriesdb');
XRapidsDB = new Mongo.Collection('xrapidsdb');

EquipDB = new Mongo.Collection('equipdb');
MaintainDB = new Mongo.Collection('maintaindb');

TimeDB = new Mongo.Collection('timedb');
TraceDB = new Mongo.Collection('tracedb');
CacheDB = new Mongo.Collection('cachedb');
EmailDB = new Mongo.Collection('emaildb');


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
        }})
      ];
  }else{
    return this.ready();
  }
});

Meteor.publish('selfData', function(){
  if(!this.userId){
    return this.ready();
  }else{
    return [
      Meteor.users.find({_id: this.userId},
        {fields: {
          'services': 0,
          'orgKey': 0
      }}),
      TimeDB.find({who: this.userId, stopTime: false})
    ];
  }
});

Meteor.publish('ltdUserData', function(){
  if(!this.userId){
    return this.ready();
  }else{
    return [
      Meteor.users.find({ roles: { $in: ["active"] }},
        {fields: {
          'username': 1
      }})
    ];
  }
});

Meteor.publish('appData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  const admin = Roles.userIsInRole(this.userId, 'admin');
  if(!this.userId){
    return this.ready();
  }else if(admin) {
    return [
      AppDB.find({orgKey: orgKey}, 
        {fields: { 
          'orgKey': 0,
          'orgPIN': 0
        }}),
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
  }else{
    return [
      AppDB.find({orgKey: orgKey}, 
        {fields: { 
          'orgKey': 0,
          'orgPIN': 0,
          'devEmail': 0
        }}),
      Meteor.users.find({orgKey: orgKey},
        {fields: {
          'username': 1,
          'roles': 1
        }}),
    ];
  }
});


Meteor.publish('debugData', function(){
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
      CacheDB.find({}, {
        fields: {
          'orgKey': 0,
      }})
    ];
  }
});


// isWhat
Meteor.publish('bNameData', function(){
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
          'rad': 1
        }
      })
    ];
  }
});

Meteor.publish('peopleData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  // const admin = Roles.userIsInRole(this.userId, 'admin');
  // const pplSp = Roles.userIsInRole(this.userId, 'peopleSuper');
  if(!this.userId){
    return this.ready();
  }else{
    return [
      // Meteor.users.find({orgKey: orgKey, roles: { $in: ["active"] }},
      Meteor.users.find({orgKey: orgKey},
        {fields: {
          'username': 1,
          'org': 1,
          'roles': 1,
          'engaged': 1,
          'proTimeShare': 1
      }}),
      CacheDB.find({dataName: 'userLogin_status'})
    ];
  }
});

// Upstream
Meteor.publish('traceDataLive', function(view){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  const loadscope = view === 'docs' ? 
    {orgKey: orgKey, live: true } :
    {orgKey: orgKey, live: true, onFloor: false };
  if(!this.userId){
    return this.ready();
  }else{
    return [
      TraceDB.find(loadscope, {
        fields: {
          // 'lastRefreshed': 1,
          'batch': 1,
          'batchID': 1,
          'tags': 1,
          'salesOrder': 1,
          'isWhat': 1,
          'describe': 1,
          'rad': 1,
          'quantity': 1,
          'serialize': 1,
          'riverChosen': 1,
          'hold': 1,
          'salesEnd': 1,
          'shipAim': 1,
          'lateLate': 1,
          'oRapid': 1,
          'isActive': 1,
          'branchCondition': 1,
          'quote2tide': 1,
          'est2tide': 1,
          'est2item': 1,
          'estSoonest': 1,
          'bffrRel': 1,
          'estEnd2fillBuffer': 1,
          'overQuote': 1,
          'isQuoted': 1,
          'docStatus': 1
        }
      })
    ];
  }
});
// Overview
Meteor.publish('traceDataActive', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  if(!this.userId){
    return this.ready();
  }else{
    return [
      TraceDB.find({
        orgKey: orgKey, 
        $or: [ { live: true }, { 'isActive.hasDay': { $gt: 0 } } ]
      }, {
        fields: {
          'batch': 1,
          'batchID': 1,
          'tags': 1,
          'salesOrder': 1,
          'isWhat': 1,
          'describe': 1,
          'rad': 1,
          'quantity': 1,
          'serialize': 1,
          'riverChosen': 1,
          'hold': 1,
          'salesEnd': 1,
          'shipAim': 1,
          'lateLate': 1,
          'oRapid': 1,
          'isActive': 1,
          'onFloor': 1,
          'stormy': 1,
          'branchCondition': 1,
          'totalItems': 1,
          'branchProg': 1,
          'branchTime': 1,
          'btchNCs': 1,
          'quote2tide': 1,
          'est2tide': 1,
          'est2item': 1,
          'estSoonest': 1,
          'bffrRel': 1,
          'estEnd2fillBuffer': 1,
          'overQuote': 1,
          'isQuoted': 1,
          'performTgt': 1,
          'docStatus': 1
        }
      })
    ];
  }
});
// Downstream
Meteor.publish('traceDataOpen', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
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
          'lastUpserted': 1,
          'lastUpdated': 1,
          'lastRefreshed': 1,
          'batch': 1,
          'batchID': 1,
          'tags': 1,
          'createdAt': 1,
          'salesOrder': 1,
          'isWhat': 1,
          'describe': 1,
          'rad': 1,
          'quantity': 1,
          'serialize': 1,
          'live': 1,
          'hold': 1,
          'salesEnd': 1,
          'shipAim': 1,
          'completed': 1,
          'completedAt': 1,
          'lateLate': 1,
          'oRapid': 1,
          'isActive': 1,
          'onFloor': 1,
          'stormy': 1,
          'branchCondition': 1,
          'totalItems': 1,
          'branchProg': 1,
          'branchTime': 1,
          'btchNCs': 1,
          'quote2tide': 1,
          'est2tide': 1,
          'est2item': 1,
          'estSoonest': 1,
          'bffrRel': 1,
          'estEnd2fillBuffer': 1,
          'overQuote': 1,
          'performTgt': 1,
          'docStatus': 1
        }
      }),
      CacheDB.find({orgKey: orgKey,
        $or: [ { dataName: 'avgDayTime' },
               { dataName: 'avgDayItemFin' } ]
      },{
        fields: {
          'orgKey': 0,
          'lastUpdated': 0
        }})
    ];
  }
});

// PartsPlus
Meteor.publish('partsPlusCacheData', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
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
      XBatchDB.find({orgKey: orgKey, live: true}, {
        fields: {
          'batch': 1,
          'live': 1,
          'hold': 1,
          'salesOrder': 1,
          'salesEnd': 1,
          'completed': 1,
          'releases': 1
        },
        sort: {batch:-1}
      }),
      EquipDB.find({orgKey: orgKey, hibernate: { $ne: true }}, {
        fields: {
          'alias': 1,
          'branchKey': 1
      }}),
      MaintainDB.find({orgKey: orgKey,
                      open: { $lte: new Date() },
                      expire: { $gte: new Date() }
      }, {
        fields: {
          'equipId': 1,
          'name': 1,
          'status': 1,
          'close': 1
      }})
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
        }}),
        
      EquipDB.find({orgKey: orgKey}, {
        fields: {
          'alias': 1,
          'hibernate': 1,
          'branchKey': 1
      }}),
      MaintainDB.find({orgKey: orgKey,
                      open: { $lte: new Date() },
                      expire: { $gte: new Date() }
      }, {
        fields: {
          'equipId': 1,
          'name': 1,
          'status': 1
      }})
    ];
  }
});

Meteor.publish('hotDataPlus', function(scanOrb, keyMatch){
  const user = Meteor.users.findOne({_id: this.userId});
  const valid = user ? true : false;
  const orgKey = valid ? user.orgKey : false;

  const trueBatch = keyMatch ? scanOrb :
                    Config.regexSN.test(scanOrb) ?
                      Meteor.call( 'serialLookup', scanOrb ) :
                      Meteor.call( 'batchLookup', scanOrb ) ? scanOrb : false;

  const bxData = XBatchDB.findOne({batch: trueBatch, orgKey: orgKey});
  
  const wID = !bxData ? false : bxData.widgetId;
  if(!this.userId){
    return this.ready();
  }else{
    return [
      XBatchDB.find({batch: trueBatch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'shareKey': 0,
          'lockTrunc': 0,
          'finShipAim': 0,
          'finShipDue': 0,
          'finEndWork': 0,
          'finBffrRel': 0
        }}),
      XSeriesDB.find({batch: trueBatch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0
        }}),
      XRapidsDB.find({extendBatch: trueBatch, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'createdAt': 0,
          'createdWho': 0,
          'closedWho': 0
        }}),
      WidgetDB.find({_id: wID, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'quoteStats': 0,
          'turnStats': 0,
        }}),
      VariantDB.find({widgetId: wID, orgKey: orgKey}, {
        fields: {
          'orgKey': 0
        }})
    ];
  }
});

Meteor.publish('hotProEquip', function(hotEquipId) {
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;

  if(!this.userId) {
    return this.ready();
  }else{
    return [
      EquipDB.find({_id: hotEquipId, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'stewards': 0
        }})
    ];
  }
});

Meteor.publish('hotProMaint', function(hotMaintId) {
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  const mtData = MaintainDB.findOne({_id: hotMaintId},{ fields:{'equipId':1}});
  
  if(!this.userId || !mtData) {
    return this.ready();
  }else{
    return [
      EquipDB.find({_id: mtData.equipId, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
          'stewards': 0
        }}),
      MaintainDB.find({_id: hotMaintId, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
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
          'hibernate': 1,
          'internal': 1
        }}),
      WidgetDB.find({orgKey: orgKey}, {
        fields: {
          'widget': 1,
          'describe': 1,
          'groupId': 1
        }}),
      VariantDB.find({orgKey: orgKey}, {
        fields: {
          'groupId': 1,
          'widgetId': 1,
          'versionKey': 1,
          'variant': 1,
          'createdAt': 1
        }})
    ];
  }
});

Meteor.publish('hotDataEx', function(dataView, dataRequest, hotWidget){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  
  let hothotGroupID = false;
  let hothotWidgetID = false;
  let hothotWidget = hotWidget || false;
  
  if(!hothotWidget) {
    const hotXBatch = XBatchDB.findOne({ batch: dataRequest });
    if(hotXBatch) {
      const maybe = WidgetDB.findOne({ _id: hotXBatch.widgetId });
      if(maybe) {
        hothotWidgetID = maybe._id;
        hothotWidget = maybe.widget;
      }
    }
  }else{
    const otherwise = WidgetDB.findOne({ _id: hotWidget }) ||
                      WidgetDB.findOne({ widget: hotWidget });
    if(otherwise) {
      hothotGroupID = otherwise.groupId;
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
            'topStats': 0
        }}),
        WidgetDB.find({orgKey: orgKey}, {
          fields: {
            'createdAt': 1
        }}),
        VariantDB.find({orgKey: orgKey}, {
          fields: {
            'createdAt': 1
        }}),
        XBatchDB.find({orgKey: orgKey, completed: false }, {
          sort: {batch:-1},
          fields: {
            'batch': 1,
            'widgetId': 1,
            'completed': 1,
        }})
      ];
    }else if( dataView === 'widget' ) {
      return [
        GroupDB.find({_id: hothotGroupID, orgKey: orgKey}, {
          fields: {
            'group': 1,
            'alias': 1,
            'hibernate': 1,
            'internal': 1,
            'wiki': 1
          }}),
        WidgetDB.find({_id: hothotWidgetID, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'quoteStats': 0,
            'turnStats': 0,
            'ncRate': 0
          }}),
        VariantDB.find({orgKey: orgKey, widgetId: hothotWidgetID}, {
          fields: {
            'orgKey': 0,
          }}),
        XBatchDB.find({orgKey: orgKey, widgetId: hothotWidgetID}, {
          sort: {batch:-1},
          fields: {
            'batch': 1,
            'groupId': 1,
            'widgetId': 1,
            'versionKey': 1,
            'createdAt': 1,
            'live': 1,
            'salesOrder': 1,
            'completed': 1,
            'completedAt': 1,
            'quantity': 1
            // 'river': 1
        }})
      ];
    }else {
      return [
        WidgetDB.find({widget: hothotWidget, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'quoteStats': 0,
            'turnStats': 0,
            'ncRate': 0
          }}),
        VariantDB.find({widgetId: hothotWidgetID, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
          }}),
        XBatchDB.find({batch: dataRequest, orgKey: orgKey}, {
          fields: {
            'orgKey': 0,
            'shareKey': 0,
            'lockTrunc': 0,
            'finShipAim': 0,
            // 'finShipDue': 0,
            'finEndWork': 0,
            'finBffrRel': 0
        }}),
        XSeriesDB.find({batch: dataRequest, orgKey: orgKey}, {
          fields: {
            'orgKey': 0
        }}),
        XRapidsDB.find({extendBatch: dataRequest, orgKey: orgKey}, {
          fields: {
            'orgKey': 0
        }})
      ];
    }
  }
});

Meteor.publish('thinEquip', function(){
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  
  const week0 = moment().tz(Config.clientTZ).startOf('week').toISOString();
  const week6 = moment().tz(Config.clientTZ).endOf('week').toISOString();

  if(!this.userId){
    return this.ready();
  }else{
    return [
      EquipDB.find({orgKey: orgKey}, {
        fields: {
          'alias': 1,
          'branchKey': 1,
          'hibernate': 1,
          'online': 1,
      }}),
      MaintainDB.find({orgKey: orgKey, status: false,
                      close: { $gte: new Date(week0), $lte: new Date(week6) }
      }, {
        fields: {
          'equipId': 1,
          'name': 1,
          'close': 1
      }})
      // TimeDB.find({})
    ];
  }
});

Meteor.publish('hotEquip', function(hotEquipID) {
  const user = Meteor.users.findOne({_id: this.userId});
  const orgKey = user ? user.orgKey : false;
  
  if(!this.userId) {
    return this.ready();
  }else{
    return [
      EquipDB.find({_id: hotEquipID, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
        }}),
        
      MaintainDB.find({equipId: hotEquipID, orgKey: orgKey}, {
        fields: {
          'orgKey': 0,
        }})
    ];
  }
});