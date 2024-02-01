import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';

export function getShipAim(batchId, salesEnd, recalc) {
  if(!salesEnd) {
    console.error('invalid salesEnd');
    return moment().format();
  }else{
    const b = XBatchDB.findOne({_id: batchId, completed: true},{fields:{'finShipAim':1}});
    const finAim = b ? b.finShipAim || null : null;
    
    if(finAim && !recalc) {
      return finAim;
    }else{
      const endDay = moment.tz(salesEnd, Config.clientTZ);
    
      const shipAim = endDay.isShipDay() ?
              endDay.clone().startOf('day').nextShippingTime().format() :
              endDay.clone().lastShipDay().startOf('day').nextShippingTime().format();
      
      return shipAim;
    }
  }
}

export function getShipDue(batchId, salesEnd, recalc) {
  if(!salesEnd) {
    console.error('invalid salesEnd');
    return moment().format();
  }else{
    const b = XBatchDB.findOne({_id: batchId, completed: true},{fields:{'finShipDue':1}});
    const finDue = b ? b.finShipDue || null : null;
    
    if(finDue && !recalc) {
      return finDue;
    }else{
      const endDay = moment.tz(salesEnd, Config.clientTZ);
    
      const shipDue = endDay.isShipDay() ?
              endDay.clone().endOf('day').lastShippingTime().format() :
              endDay.clone().lastShippingTime().format();
  
      return shipDue;
    }
  }
}

export function getEndWork(batchId, salesEnd, recalc) {
  if(!salesEnd) {
    console.error('invalid salesEnd');
    return moment().format();
  }else{
    const b = XBatchDB.findOne({_id: batchId, completed: true},{fields:{'finEndWork':1}});
    const finWork = b ? b.finEndWork || null : null;
    
    if(finWork && !recalc) {
      return finWork;
    }else{
      const endDay = moment.tz(salesEnd, Config.clientTZ);
    
      const endWork = endDay.isWorkingDay() ?
                      endDay.clone().endOf('day').lastWorkingTime().format() :
                      endDay.clone().lastWorkingTime().format();
    
      return endWork;
    }
  }
}

export function getShipLoad(nowMoment) {
  // console.log('run ship load');
  if(moment.isMoment(nowMoment)) {
    const nextStart = nowMoment.clone().nextShippingTime().startOf('day').format();
    const nextEnd = nowMoment.clone().nextShippingTime().endOf('day').format();
    const shipLoad = TraceDB.find({
      completed: false,
      shipAim: {
        $gte: new Date(nextStart),
        $lte: new Date(nextEnd) 
      }
    },{fields:{'_id':1}}).count();
    return shipLoad;
  }else{
    return 0;
  }
}

Meteor.methods({
  
  mockDayShipLoad(day) {
    const daysafe = day || new Date();
    const dayMoment = moment.tz(daysafe, Config.clientTZ).startOf('day');
    if(!dayMoment.isShipDay()) {
      const shipday = dayMoment.lastShippingTime();
      const load = getShipLoad(shipday);
      return load;
    }else{
      const load = getShipLoad(dayMoment);
      return load;
    }
  }
  
});