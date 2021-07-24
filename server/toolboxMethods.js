import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { avgOfArray } from './calcOps.js';
import { syncHoliday, getEst } from './utility.js';
import { batchTideTime } from './tideGlobalMethods.js';
import { calcShipDay } from './reportCompleted.js';
import { getShipLoad } from '/server/shipOps';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

Meteor.methods({
  
  // Testing Functions //
  
  sendTestMail(all, title, message) {
    const mssgTitle = title || 'Sample Notification';
    const mssgDetail = message || 'This is a test';
    if(all) {
      try {
        Meteor.users.update({ orgKey: Meteor.user().orgKey }, {
          $push : { inbox : {
            notifyKey: new Meteor.Collection.ObjectID().valueOf(),
            keyword: 'General',
            type: 'general',
            title: mssgTitle,
            detail: mssgDetail,
            time: new Date(),
            unread: true
          }
        }},{multi: true});
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }else{
      try {
        Meteor.users.update(Meteor.userId(), {
          $push : { inbox : {
            notifyKey: new Meteor.Collection.ObjectID().valueOf(),
            keyword: 'General',
            type: 'general',
            title: mssgTitle,
            detail: mssgDetail,
            time: new Date(),
            unread: true
          }
        }});
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
  },
  
  sendErrorMail(errorTitle, errorTime, errorUser, errorMessage) {
    Meteor.users.update({ roles: { $in: ["admin"] } }, {
        $push : { inbox : {
          notifyKey: new Meteor.Collection.ObjectID().valueOf(),
          keyword: 'Error',
          type: 'ERROR',
          title: errorTitle,
          detail: `${errorTime}, ${errorUser}, ${errorMessage}`,
          time: new Date(),
          unread: true
        }
      }},{multi: true});
      
  },
  
  
 ///////////// Repair \\\\\\\\\\\\\\\\\\\\\
  
  resetALLCacheDB() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      CacheDB.remove({orgKey: Meteor.user().orgKey});
      return true;
    }else{
      return false;
    }
  },
  
  fixRemoveDamagedBatch() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      const allBatchX = XBatchDB.find({}).fetch();
      for( let bx of allBatchX ) {
        if(!bx.orgKey) {
           XBatchDB.remove({_id: bx._id});
        }
      }
      return true;
    }else{
      return false;
    }
  },
  
  repairNonConsDANGEROUS(oldText, newText, exact) {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return false;
    }else{
      const allSeries = XSeriesDB.find({orgKey: Meteor.user().orgKey}).fetch();
      for(let srs of allSeries) {
        const srsId = srs._id;
        const nonCons = srs.nonCon;
        for(let nc of nonCons) {
          const where = nc.where;
          if(!where) {
            null;
          }else{
            const match = !exact ? where.includes(oldText)
                          : where === oldText;
            if(!match) {
              null;
            }else{
              XSeriesDB.update({_id: srsId, orgKey: Meteor.user().orgKey, 'nonCon.key': nc.key}, {
          			$set : { 
          			  'nonCon.$.where': newText
          			}
          		});
            }
          }
        }
      }
      return true;
    }
  },
  
  
  ResetAppLatestSerial() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {

        let max8s = [];
        let max9s = [];
        let max10s = [];
        
        const allSeries = XSeriesDB.find({}).fetch();
        
        for(let sdt of allSeries) {
          if(sdt.items.length > 0) {
            const highest = _.max(sdt.items, (it)=> {
              if(it.serial.length <= 10) {
                return Number(it.serial);
              }
            });
            if(!highest.serial) {null;
            }else if(highest.serial.length === 10) {
              max10s.push(highest.serial);
            }else if(highest.serial.length === 9) {
              max9s.push(highest.serial);
            }else if(highest.serial.length === 8) {
              max8s.push(highest.serial);
            }else{null}
          }
        }
        
        let max8 = max8s.length == 0 ? 10000000 : 
                    _.max(max8s, (it)=> it);
        let max9 = max9s.length == 0 ? 100000000 :
                    _.max(max9s, (it)=> it);
        let max10 = max10s.length == 0 ? 1000000000 : 
                    _.max(max10s, (it)=> it);
        
        AppDB.update({ orgKey: Meteor.user().orgKey }, {
          $set : { 
            latestSerial: {
              eightDigit: Number(max8),
              nineDigit: Number(max9),
              tenDigit: Number(max10)
            }
          }});
          return true;
      }else{
        return false;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  
  diagnoseProduct(batchID) {
    syncHoliday(Meteor.user().orgKey);
    const now = moment().tz(Config.clientTZ);

    const b = XBatchDB.findOne({_id: batchID});
    
    if(!b) {
      return batchID;
    }else{
      const mEst = getEst(b.widgetId, b.quantity);

      const salesEnd = b.salesEnd;

      const doneEntry = b.completedAt;
      
      const calcShip = calcShipDay( batchID, now, salesEnd );
      const shipAim = calcShip[1];
      const lateLate = calcShip[2];

      const qtBready = !!b.quoteTimeBudget;
      
      if(qtBready && b.tide) {
        const shipLoad = getShipLoad(now);

        const shipAimMmnt = moment(shipAim);
 
        const mQuote = b.quoteTimeBudget.length === 0 ? 0 : b.quoteTimeBudget[0].timeAsMinutes;
        const estimatedMinutes = avgOfArray([mQuote, mEst]);
        
        const totalTideMinutes = batchTideTime(b.tide);
        
        const quote2tide = estimatedMinutes - totalTideMinutes;
        const overQuote = totalTideMinutes > mQuote;
        const q2tNice = Math.max(0, quote2tide);
        
        const aimAhead = shipAimMmnt.clone().subtract(Config.shipAhead, 'hours');
        const estSoonest = now.clone().addWorkingTime(q2tNice, 'minutes');
  
        const buffer = aimAhead.workingDiff(estSoonest, 'minutes');
       
        const estEnd2fillBuffer = buffer || null;
        
        const dayGap = shipAimMmnt.workingDiff(now, 'days', true);
        const shipPull = dayGap <= Config.shipSoon ? shipLoad * 2 : shipLoad;
      
        const bffrRel = Math.round( ( estEnd2fillBuffer / 100 ) + dayGap - shipPull );

        return { 
          mEst, salesEnd, doneEntry, calcShip, shipAim, lateLate, qtBready,
          shipLoad, shipAimMmnt: shipAimMmnt.format(), mQuote, estimatedMinutes, totalTideMinutes, 
          quote2tide, overQuote, q2tNice, 
          aimAhead: aimAhead.format(), 
          estSoonest: estSoonest.format(),
          buffer, estEnd2fillBuffer, dayGap, shipPull, bffrRel
        };
      }else{
        return false;
      }
    }
  }
  
});