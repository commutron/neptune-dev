import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { deliveryState, calcShipDay } from '/server/reportCompleted.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

function syncHoliday(accessKey) {
  const app = AppDB.findOne({orgKey:accessKey}, {fields:{'nonWorkDays':1}});
  if(Array.isArray(app.nonWorkDays) ) {  
    moment.updateLocale('en', { holidays: app.nonWorkDays });
  }
}

function shrinkWhole(bData, now, accessKey) {
  return new Promise( ()=> {
    const isWhat = Meteor.call('getBasicBatchInfo', bData.batch);
    
    const quantity = bData.quantity || bData.items.length;
    const serialize = bData.serialize || Array.isArray(bData.items);
    const rFlow = bData.river ? true :
                  bData.waterfall && bData.waterfall.length > 0 ? false : 
                  null;
    
    const isX = bData.completed !== undefined;
    
    const endDay = isX ? bData.salesEnd : bData.end;
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
    
    const actvLvl = Meteor.call('tideActivityLevel', bData._id, accessKey);
    const brchCnd = Meteor.call('branchCondition', bData._id, accessKey);
    const prtyRnk = Meteor.call('priorityRank', bData._id, accessKey);
    
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
        riverChosen: rFlow,
        live: bData.live,
        salesEnd: new Date(salesEnd),
        shipAim: new Date(shipAim),
        completed: didFinish,
        completedAt: completedAt,
        lateLate: lateLate,
        isActive: actvLvl.isActive,
        onFloor: brchCnd.onFloor,
        branchCondition: brchCnd.branchSets,
        quote2tide: prtyRnk.quote2tide,
        estSoonest: prtyRnk.estSoonest,
        estLatestBegin: prtyRnk.estLatestBegin,
        bffrRel: prtyRnk.bffrRel,
        estEnd2fillBuffer: prtyRnk.estEnd2fillBuffer
    }});
  });
}

function checkMinify(bData, accessKey) {
  return new Promise( ()=> {
    const isWhat = Meteor.call('getBasicBatchInfo', bData.batch);
    
    const quantity = bData.quantity || bData.items.length;
    const serialize = bData.serialize || Array.isArray(bData.items);
    const rFlow = bData.river ? true :
                  bData.waterfall && bData.waterfall.length > 0 ? false : 
                  null;
                  
    TraceDB.update({batchID: bData._id}, {
      $set : { 
        orgKey: accessKey,
        lastUpserted: new Date(),
        batch: bData.batch,
        // batchID: bData._id,
        salesOrder: bData.salesOrder,
        isWhat: isWhat.isWhat,
        describe: isWhat.more,
        quantity: Number(quantity),
        serialize: serialize,
        riverChosen: rFlow
    }});
  });
}

function checkMovement(bData, now, accessKey) {
  return new Promise( ()=> {
    const isX = bData.completed !== undefined;
    
    const endDay = isX ? bData.salesEnd : bData.end;
    const didFinish = isX ? bData.completed : bData.finishedAt !== false;
    const whenFinish = didFinish ? bData.completedAt || bData.finishedAt : false;
    
    const shpdlv = didFinish ? deliveryState( endDay, whenFinish )
                              // salesEnd, shipAim, didFinish, fillZ, shipZ
                             : calcShipDay( now, endDay );
                              // salesEnd, shipAim, lateLate, shipLate
      
    const salesEnd = shpdlv[0];
    const shipAim = didFinish ? shpdlv[1] : shpdlv[1].format();
    const completedAt = didFinish ? new Date(shpdlv[2]) : false;
    const fillZ = didFinish ? shpdlv[3] : null;
    const lateLate = didFinish ? fillZ[2] === 'late' : shpdlv[2];
    
    const actvLvl = Meteor.call('tideActivityLevel', bData._id, accessKey);
    const brchCnd = Meteor.call('branchCondition', bData._id, accessKey);
    const prtyRnk = Meteor.call('priorityRank', bData._id, accessKey);
    
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
        onFloor: brchCnd.onFloor,
        branchCondition: brchCnd.branchSets,
        quote2tide: prtyRnk.quote2tide,
        estSoonest: prtyRnk.estSoonest,
        estLatestBegin: prtyRnk.estLatestBegin,
        bffrRel: prtyRnk.bffrRel,
        estEnd2fillBuffer: prtyRnk.estEnd2fillBuffer
    }});
  });
}

Meteor.methods({

  
  rebuildTrace() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    (async ()=> {
      try {
        syncHoliday(accessKey);
        const now = moment().tz(Config.clientTZ);
        
        BatchDB.find({orgKey: accessKey})
                .forEach( (b)=> {
                  shrinkWhole( b, now, accessKey );
                });
        
        XBatchDB.find({orgKey: accessKey})
                  .forEach( (x)=> {
                    shrinkWhole( x, now, accessKey );
                  });
        return true;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    })();
  },
  
  clearTraceErrors() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const allTrace = TraceDB.find({}).fetch();
      for( let t of allTrace ) {
        const doc = BatchDB.findOne({_id: t.batchID});
        const docX = XBatchDB.findOne({_id: t.batchID});
        if(!doc && !docX) {
           TraceDB.remove({batchID: t.batchID});
        }
      }
      return true;
    }else{
      return false;
    }
  },
  
  buildNewTrace(privateKey) {
    this.unblock();
    const accessKey = privateKey || Meteor.user().orgKey;
    (async ()=> {
      try {
        syncHoliday(accessKey);
        const now = moment().tz(Config.clientTZ);
        
        const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
        
        BatchDB.find({ createdAt: { $gte: ystrday } }).forEach( (b)=> {
            const t = TraceDB.findOne({ batchID: b._id });
            if(!t) { shrinkWhole( b, now, accessKey ) }
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    })();
  },
  buildNewTraceX(privateKey) {
    this.unblock();
    const accessKey = privateKey || Meteor.user().orgKey;
    (async ()=> {
      try {
        syncHoliday(accessKey);
        const now = moment().tz(Config.clientTZ);
        
        const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
        
        XBatchDB.find({ createdAt: { $gte: ystrday } }).forEach( (x)=> {
            const t = TraceDB.findOne({ batchID: x._id });
            if(!t) { shrinkWhole( x, now, accessKey ) }
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    })();
  },
  
  reMiniOpenTrace(privateKey) {
    this.unblock();
    const accessKey = privateKey || Meteor.user().orgKey;
    (async ()=> {
      try {
        syncHoliday(accessKey);
        
        const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
        const lstweek = ( d => new Date(d.setDate(d.getDate()-7)) )(new Date);
        
        const fresh = moment().subtract(12, 'hours').toISOString();
        
        BatchDB.find({orgKey: accessKey, lock: {$ne: true},
                        $or: [ { live: true }, 
                               { finishedAt: { $gte: lstweek } },
                               { end: { $gte: ystrday } }
                             ]
        }).forEach( async (b)=> {
            const t = TraceDB.findOne({
              batchID: b._id, 
              lastUpserted: { $gte: new Date(fresh) }
            });
            if(!t) {
              await checkMinify( b, accessKey );
            }
        });
      
        XBatchDB.find({orgKey: accessKey, lock: {$ne: true},
                        $or: [ { live: true }, 
                               { completedAt: { $gte: lstweek } },
                               { salesEnd: { $gte: ystrday } }
                             ]
        }).forEach( async (x)=> {
            const t = TraceDB.findOne({
              batchID: x._id, 
              lastUpserted: { $gte: new Date(fresh) }
            });
            if(!t) {
              await checkMinify( x, accessKey );
            }
        });
      }catch (err) {
        throw new Meteor.Error(err);
      }
    })();
  },
  
  rebuildOneTrace(bID, privateKey) {
    const accessKey = privateKey || Meteor.user().orgKey;
    (async ()=> {
      try {
        syncHoliday(accessKey);
        const now = moment().tz(Config.clientTZ);
        
        BatchDB.find({_id: bID})
                .forEach( (b)=> shrinkWhole( b, now, accessKey ) );
        
        XBatchDB.find({_id: bID})
                  .forEach( (x)=> shrinkWhole( x, now, accessKey ) );
      }catch (err) {
        throw new Meteor.Error(err);
      }
    })();
  },
  
  updateOneMinify(bID, privateKey) {
    const accessKey = privateKey || Meteor.user().orgKey;
    (async ()=> {
      try {
        syncHoliday(accessKey);
          
        BatchDB.find({_id: bID})
                .forEach( (b)=> checkMinify( b, accessKey ) );
        
        XBatchDB.find({_id: bID})
                  .forEach( (x)=> checkMinify( x, accessKey ) );
      }catch (err) {
        throw new Meteor.Error(err);
      }
    })();
  },
  
  updateOneMovement(bID, privateKey) {
    const accessKey = privateKey || Meteor.user().orgKey;
    (async ()=> {
      try {
        syncHoliday(accessKey);
        const now = moment().tz(Config.clientTZ);
        
        BatchDB.find({_id: bID})
                .forEach( async (b)=> await checkMovement( b, now, accessKey ) );
        
        XBatchDB.find({_id: bID})
                  .forEach( async (x)=> await checkMovement( x, now, accessKey ) );
      }catch (err) {
          throw new Meteor.Error(err);
        }
    })();
  },
  
  
  updateLiveMovement(privateKey) {
    this.unblock();
    
    (async ()=> {
      const accessKey = privateKey || Meteor.user().orgKey;
      try {
        syncHoliday(accessKey);
        const now = moment().tz(Config.clientTZ);
        
        const ystrday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
        const lstweek = ( d => new Date(d.setDate(d.getDate()-7)) )(new Date);
        const fresh = moment().subtract(10, 'minutes').toISOString();
        
        BatchDB.find({orgKey: accessKey, lock: {$ne: true},
                        $or: [ { live: true }, 
                               { finishedAt: { $gte: lstweek } },
                               { end: { $gte: ystrday } }
                             ]
        }).forEach( async (b)=> {
            const t = TraceDB.findOne({
              batchID: b._id, 
              lastUpdated: { $gte: new Date(fresh) }
            });
            if(!t) {
              await checkMovement( b, now, accessKey );
            }
          });
      
        XBatchDB.find({orgKey: accessKey, lock: {$ne: true},
                        $or: [ { live: true }, 
                               { completedAt: { $gte: lstweek } },
                               { salesEnd: { $gte: ystrday } }
                             ]
        }).forEach( async (x)=> {
            const t = TraceDB.findOne({
              batchID: x._id, 
              lastUpdated: { $gte: new Date(fresh) }
            });
            if(!t) {
              await checkMovement( x, now, accessKey );
            }
          });
        
        }catch (err) {
          throw new Meteor.Error(err);
        }
      })();
  }
  
  
  
});