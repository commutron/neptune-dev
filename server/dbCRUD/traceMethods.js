import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { deliveryState, calcShipDay } from '/server/reportCompleted.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

Meteor.methods({
  
  
  minifyBatchesBase() {
    const accessKey = Meteor.user().orgKey;
    
    const app = AppDB.findOne({orgKey: accessKey});
    const nonWorkDays = app.nonWorkDays;
    if( Array.isArray(nonWorkDays) ) {  
      moment.updateLocale('en', {
        holidays: nonWorkDays
      });
    }
          
    function shrink(bData, accessKey) {
      const isWhat = Meteor.call('getBasicBatchInfo', bData.batch);
      
      const quantity = bData.quantity || bData.items.length;
      const serialize = bData.serialize || Array.isArray(bData.items);
      
      const now = moment().tz(Config.clientTZ);
      
      const endDay = bData.end || bData.salesEnd;
      
      const didFinish = bData.completed || bData.finishedAt !== false;
      const whenFinish = didFinish ? bData.completedAt || bData.finishedAt : false;
      
      const shpdlv = didFinish ? deliveryState( endDay, whenFinish )
                                // salesEnd, shipAim, didFinish, gapZone
                               : calcShipDay( now, endDay );
                                // salesEnd, shipAim, lateLate, shipLate
        
      const salesEnd = shpdlv[0];
      const shipAim = didFinish ? shpdlv[1] : shpdlv[1].format();
      const completedAt = didFinish ? shpdlv[2] : false;
      const gapZone = didFinish ? shpdlv[3] : null;
      const lateLate = didFinish ? gapZone[2] === 'late' : shpdlv[2];
      
      const actvLvl = Meteor.call('tideActivityLevel', bData._id);
      const brchCn = Meteor.call('branchCondition', bData._id);
      
      TraceDB.upsert({orgKey: accessKey, batch: bData.batch}, {
        $set : { 
          orgKey: accessKey,
          lastUpdated: new Date(),
          batch: bData.batch,
          batchID: bData._id,
          salesOrder: bData.salesOrder,
          live: bData.live,
          isWhat: isWhat.isWhat,
          describe: isWhat.more,
          quantity: quantity,
          serialize: serialize,
          salesEnd: salesEnd,
          shipAim: shipAim,
          completed: didFinish,
          completedAt: completedAt,
          lateLate: lateLate,
          isActive: actvLvl.isActive,
          onFloor: brchCn.onFloor,
          branchCondition: brchCn.branchSets
      }});
    }
  
    BatchDB.find({orgKey: accessKey}).forEach( (b)=> shrink( b, accessKey ) );
    
    XBatchDB.find({orgKey: accessKey}).forEach( (x)=> shrink( x, accessKey ) );

    return true;
    
  }
  
  
  
});

