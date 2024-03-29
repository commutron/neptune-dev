import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';

export function getShipAim(batchId, salesEnd, recalc) {
  const calcAim = (sEnd)=> {
    const endDay = moment.tz(sEnd, Config.clientTZ);
    
    const shipAim = endDay.isShipDay() ?
            endDay.clone().startOf('day').nextShippingTime().format() :
            endDay.clone().lastShipDay().startOf('day').nextShippingTime().format();
    return shipAim; 
  };
  
  if(!salesEnd) {
    console.error('invalid salesEnd');
    return moment().format();
  }else if(recalc) {
    return calcAim(salesEnd);
  }else{
    
    const b = XBatchDB.findOne({_id: batchId, completed: true},{fields:{'finShipAim':1}});
    const finAim = b ? b.finShipAim || null : null;
    
    if(finAim) {
      return finAim;
    }else{
      return calcAim(salesEnd);
    }
  }
}

export function getShipDue(batchId, salesEnd, recalc) {
  const calcDue = (sEnd)=> {
    const endDay = moment.tz(sEnd, Config.clientTZ);
    
    const shipDue = endDay.isShipDay() ?
            endDay.clone().endOf('day').lastShippingTime().format() :
            endDay.clone().lastShippingTime().format();

    return shipDue;
  };
    
  if(!salesEnd) {
    console.error('invalid salesEnd');
    return moment().format();
  }else if(recalc) {
    return calcDue(salesEnd);
  }else{
    const b = XBatchDB.findOne({_id: batchId, completed: true},{fields:{'finShipDue':1}});
    const finDue = b ? b.finShipDue || null : null;
    
    if(finDue) {
      return finDue;
    }else{
      return calcDue(salesEnd);
    }
  }
}

export function getEndWork(batchId, salesEnd, recalc) {
  const calcWork = (sEnd)=> {
    const endDay = moment.tz(sEnd, Config.clientTZ);
    
    const endWork = endDay.isWorkingDay() ?
                    endDay.clone().endOf('day').lastWorkingTime().format() :
                    endDay.clone().lastWorkingTime().format();
  
    return endWork;
  };
  
  if(!salesEnd) {
    console.error('invalid salesEnd');
    return moment().format();
  }else if(recalc) {
    return calcWork(salesEnd);
  }else{
    const b = XBatchDB.findOne({_id: batchId, completed: true},{fields:{'finEndWork':1}});
    const finWork = b ? b.finEndWork || null : null;
    
    if(finWork) {
      return finWork;
    }else{
      return calcWork(salesEnd);
    }
  }
}

export function getShipLoad(nowMoment) {
  if(moment.isMoment(nowMoment)) {
    // console.time('ShipLoad_run_time');
    const nextStart = nowMoment.clone().nextShippingTime().startOf('day').format();
    const nextEnd = nowMoment.clone().nextShippingTime().endOf('day').format();
    const shipLoad = TraceDB.find({
      completed: false,
      shipAim: {
        $gte: new Date(nextStart),
        $lte: new Date(nextEnd) 
      }
    },{fields:{'_id':1}}).count();
    // console.timeEnd('ShipLoad_run_time');
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