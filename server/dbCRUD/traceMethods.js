import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { deliveryState, calcShipDay } from '/server/reportCompleted.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

function shrinkWhole(bData, accessKey) {
  const app = AppDB.findOne({orgKey: accessKey});
  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  const now = moment().tz(Config.clientTZ);
  
  const isWhat = Meteor.call('getBasicBatchInfo', bData.batch);
  
  const quantity = bData.quantity || bData.items.length;
  const serialize = bData.serialize || Array.isArray(bData.items);
  
  const endDay = bData.salesEnd || bData.end;
  
  const isX = bData.completed !== undefined;
  const didFinish = isX ? bData.completed : bData.finishedAt !== false;
  const whenFinish = didFinish ? bData.completedAt || bData.finishedAt : false;
  
  const shpdlv = didFinish ? deliveryState( endDay, whenFinish )
                            // salesEnd, shipAim, didFinish, gapZone
                           : calcShipDay( now, endDay );
                            // salesEnd, shipAim, lateLate, shipLate
    
  const salesEnd = shpdlv[0];
  const shipAim = didFinish ? shpdlv[1] : shpdlv[1].format();
  const completedAt = didFinish ? new Date(shpdlv[2]) : false;
  const gapZone = didFinish ? shpdlv[3] : null;
  const lateLate = didFinish ? gapZone[2] === 'late' : shpdlv[2];
  
  const actvLvl = Meteor.call('tideActivityLevel', bData._id);
  const brchCn = Meteor.call('branchCondition', bData._id);
  
  TraceDB.upsert({batchID: bData._id}, {
    $set : { 
      orgKey: accessKey,
      lastUpserted: new Date(),
      lastUpdated: new Date(),
      batch: bData.batch,
      batchID: bData._id,
      salesOrder: bData.salesOrder,
      isWhat: isWhat.isWhat,
      describe: isWhat.more,
      quantity: Number(quantity),
      serialize: serialize,
      live: bData.live,
      salesEnd: new Date(salesEnd),
      shipAim: new Date(shipAim),
      completed: didFinish,
      completedAt: completedAt,
      lateLate: lateLate,
      isActive: actvLvl.isActive,
      onFloor: brchCn.onFloor,
      branchCondition: brchCn.branchSets
  }});
}

function checkMinify(bData, accessKey) {
  const isWhat = Meteor.call('getBasicBatchInfo', bData.batch);
  
  const quantity = bData.quantity || bData.items.length;
  const serialize = bData.serialize || Array.isArray(bData.items);
  
  TraceDB.update({batchID: bData._id}, {
    $set : { 
      orgKey: accessKey,
      lastUpserted: new Date(),
      batch: bData.batch,
      batchID: bData._id,
      salesOrder: bData.salesOrder,
      isWhat: isWhat.isWhat,
      describe: isWhat.more,
      quantity: Number(quantity),
      serialize: serialize
  }});
}

function checkMovement(bData, accessKey) {
  const app = AppDB.findOne({orgKey: accessKey});
  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  const now = moment().tz(Config.clientTZ);
  
  const endDay = bData.salesEnd || bData.end;
  
  const isX = bData.completed !== undefined;
  const didFinish = isX ? bData.completed : bData.finishedAt !== false;
  const whenFinish = didFinish ? bData.completedAt || bData.finishedAt : false;
  
  const shpdlv = didFinish ? deliveryState( endDay, whenFinish )
                            // salesEnd, shipAim, didFinish, gapZone
                           : calcShipDay( now, endDay );
                            // salesEnd, shipAim, lateLate, shipLate
    
  const salesEnd = shpdlv[0];
  const shipAim = didFinish ? shpdlv[1] : shpdlv[1].format();
  const completedAt = didFinish ? new Date(shpdlv[2]) : false;
  const gapZone = didFinish ? shpdlv[3] : null;
  const lateLate = didFinish ? gapZone[2] === 'late' : shpdlv[2];
  
  const actvLvl = Meteor.call('tideActivityLevel', bData._id);
  const brchCn = Meteor.call('branchCondition', bData._id);
  
  TraceDB.update({batchID: bData._id}, {
    $set : { 
      lastUpdated: new Date(),
      live: bData.live,
      salesEnd: new Date(salesEnd),
      shipAim: new Date(shipAim),
      completed: didFinish,
      completedAt: completedAt,
      lateLate: lateLate,
      isActive: actvLvl.isActive,
      onFloor: brchCn.onFloor,
      branchCondition: brchCn.branchSets
  }});
}

Meteor.methods({

  
  rebuildTrace() {
    this.unblock();
    try {
      const accessKey = Meteor.user().orgKey;
      
      BatchDB.find({orgKey: accessKey})
              .forEach( (b)=> {
                shrinkWhole( b, accessKey );
              });
      
      XBatchDB.find({orgKey: accessKey})
                .forEach( (x)=> {
                  shrinkWhole( x, accessKey );
                });
      return true;
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  buildNewTrace() {
    this.unblock();
    try {
      const accessKey = Meteor.user().orgKey;
      const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
      
      BatchDB.find({ createdAt: { $gte: ystrday } }).forEach( (b)=> {
          const t = TraceDB.findOne({ batchID: b._id });
          if(!t) { shrinkWhole( b, accessKey ) }
      });
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  buildNewTraceX() {
    this.unblock();
    try {
      const accessKey = Meteor.user().orgKey;
      const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
      
      XBatchDB.find({ createdAt: { $gte: ystrday } }).forEach( (x)=> {
          const t = TraceDB.findOne({ batchID: x._id });
          if(!t) { shrinkWhole( x, accessKey ) }
      });
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  rebuildOpenTrace() {
    this.unblock();
    try {
      const accessKey = Meteor.user().orgKey;
      const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
      const lstweek = ( d => new Date(d.setDate(d.getDate()-7)) )(new Date);
      
      const fresh = moment().subtract(12, 'hours').toISOString();
      
      BatchDB.find({orgKey: accessKey,
                      $or: [ { live: true }, 
                             { finishedAt: { $gte: lstweek } },
                             { end: { $gte: ystrday } }
                           ]
      }).forEach( (b)=> {
          const t = TraceDB.findOne({
            batchID: b._id, 
            lastUpserted: { $gte: new Date(fresh) }
          });
          if(!t) {
            shrinkWhole( b, accessKey );
          }
      });
      
      XBatchDB.find({orgKey: accessKey,
                      $or: [ { live: true }, 
                             { completedAt: { $gte: lstweek } },
                             { salesEnd: { $gte: ystrday } }
                           ]
      }).forEach( (x)=> {
          const t = TraceDB.findOne({
            batchID: x._id, 
            lastUpserted: { $gte: new Date(fresh) }
          });
          if(!t) {
            shrinkWhole( x, accessKey );
          }
      });
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  rebuildOneTrace(bID) {
    const accessKey = Meteor.user().orgKey;
    
    BatchDB.find({_id: bID})
            .forEach( (b)=> shrinkWhole( b, accessKey ) );
    
    XBatchDB.find({_id: bID})
              .forEach( (x)=> shrinkWhole( x, accessKey ) );
  },
  
  updateOneMinify(bID) {
    const accessKey = Meteor.user().orgKey;
    
    BatchDB.find({_id: bID})
            .forEach( (b)=> checkMinify( b, accessKey ) );
    
    XBatchDB.find({_id: bID})
              .forEach( (x)=> checkMinify( x, accessKey ) );
  },
  
  updateOneMovement(bID) {
    const accessKey = Meteor.user().orgKey;
    
    BatchDB.find({_id: bID})
            .forEach( (b)=> checkMovement( b, accessKey ) );
    
    XBatchDB.find({_id: bID})
              .forEach( (x)=> checkMovement( x, accessKey ) );
  },
  
  
  updateLiveMovement() {
    this.unblock();
    try {
      const accessKey = Meteor.user().orgKey;
      const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
      const lstweek = ( d => new Date(d.setDate(d.getDate()-7)) )(new Date);
      const fresh = moment().subtract(5, 'minutes').toISOString();
      
      BatchDB.find({orgKey: accessKey,
                      $or: [ { live: true }, 
                             { finishedAt: { $gte: lstweek } },
                             { end: { $gte: ystrday } }
                           ]
      }).forEach( (b)=> {
          const t = TraceDB.findOne({
            batchID: b._id, 
            lastUpdated: { $gte: new Date(fresh) }
          });
          if(!t) {
            checkMovement( b, accessKey );
          }
        });
      
      XBatchDB.find({orgKey: accessKey, 
                      $or: [ { live: true }, 
                             { completedAt: { $gte: lstweek } },
                             { salesEnd: { $gte: ystrday } }
                           ]
      }).forEach( (x)=> {
          const t = TraceDB.findOne({
            batchID: x._id, 
            lastUpdated: { $gte: new Date(fresh) }
          });
          if(!t) {
            checkMovement( x, accessKey );
          }
        });
      
    }catch (err) {
      throw new Meteor.Error(err);
    }
  }
  
  
  
});