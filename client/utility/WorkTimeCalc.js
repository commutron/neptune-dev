import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import { round2Decimal } from '/client/utility/Convert.js';

export function localeUpdate(app) {
  if( app ) {  
    moment.updateLocale('en', { 
      holidays: app.nonWorkDays,
      workinghours: app.workingHours,
      shippinghours: app.shippingHours
    });
  }
}

export function HolidayCheck( app, dateTime ) {
  localeUpdate(app);
  
  const isit = moment(dateTime).isHoliday() ? true : false;
  return isit;
}

export function listShipDays( app, qty, withLast ) {
  localeUpdate(app);
  
  if( Object.values(app.shippingHours).every(x=> x === null) ) {
    return [];
  }else{
    
  const loops = withLast ? qty + 1 : qty;
  const last = moment().lastShipDay();
  
  const lastTime = last.startOf('day').nextShippingTime();
  
  let sArr = [];
  for(let s = 0; s < loops; s++) {
    const newDay = s === 0 ? 
                    withLast ? lastTime : lastTime.nextShipDay().startOf('day').nextShippingTime() :
                    sArr[s - 1][0].nextShipDay().startOf('day').nextShippingTime();
    
    const gap = s === 0 && withLast ? 0 : 
                (s === 0 && !withLast) || (s === 1 && withLast) ? 
                  moment().isAfter(newDay) ? 0 : Math.abs(newDay.workingDiff(moment(), 'days', true)) :
                  Math.abs(newDay.workingDiff(sArr[s - 1][0], 'days', true));
      
    sArr.push([newDay, gap]);
  }
  return sArr;
  }
}

export function TimeInWeek( app, weekStart ) {
  localeUpdate(app);
  
  if(moment(weekStart, ["YYYY", moment.ISO_8601]).isValid()) {
  
    const begin = moment(weekStart).startOf('day').format(); 

    let weekTotal = 0;
    
    for(let n = 0; n < 7; n++) {
      if(!moment(n).isWorkingDay()) {
        continue;
      }else{
        const dayStart = moment(begin).add(n, 'd');
        const dayEnd = moment(begin).add(n, 'd').endOf('day');
        const dayTotal = dayEnd.workingDiff(dayStart, 'hours', true);
        
        const breakTime = dayTotal <= 5 ? Pref.breakMin : Pref.breakMin * 2;
        const idleTime = breakTime + Pref.idleMinutes;
        const minusTime = ( dayTotal * 60 ) < breakTime ? 0 :
                          ( dayTotal * 60 ) < idleTime ? breakTime : idleTime;
          
        const workTime = moment.duration(dayTotal, 'hours')
                          .subtract(minusTime, 'minutes').asHours();
  
        weekTotal = weekTotal + workTime;
      }
    }
    return weekTotal;
  }else{
    return 0;
  }
}


export function TimeInDay( app, dayStart ) {
  localeUpdate(app);
  
  if(moment(dayStart, ["YYYY", moment.ISO_8601]).isValid()) {
    if(!moment(dayStart).isWorkingDay()) {
      return 0;
    }else{
      const begin = moment(dayStart).startOf('day').format(); 
      const end = moment(dayStart).endOf('day').format();
      const dayTotal = moment(end).workingDiff(begin, 'hours', true);
  
      const breakTime = dayTotal <= 5 ? Pref.breakMin : Pref.breakMin * 2;
      const idleTime = breakTime + Pref.idleMinutes;
      const minusTime = ( dayTotal * 60 ) < breakTime ? 0 :
                        ( dayTotal * 60 ) < idleTime ? breakTime : idleTime;
      
      const workTime = moment.duration(dayTotal, 'hours')
                        .subtract(minusTime, 'minutes').asHours();
                        
      return workTime;
    }
  }else{
    return 0;
  }
}

export function UserTime( userObj, dateTime, span, spanHours ) {
  const validate = moment.isDate(dateTime) || moment.isMoment(dateTime);
  
  const userProTime = userObj.proTimeShare || false;
  const relProTime = !userProTime || !validate ? false : 
          userProTime.find( x => moment(x.updatedAt).isSameOrBefore(dateTime, span) );
  
  const proTime = !relProTime ? 1 : relProTime.timeAsDecimal;
  const proHours = ( spanHours * proTime );
  
  const proHoursNice = round2Decimal(proHours);
  
  return proHoursNice;
}

export function UsersTimeTotal( userIDs, allUsers, dateTime, span, spanHours ) {
  
  let userTimeMax = [];
    
  for( let uID of userIDs) {
    const userObj = allUsers.find( x => x._id === uID );
    
    const proHours = UserTime( userObj, dateTime, span, spanHours );
    
    userTimeMax.push(proHours);
  }
  
  const userTimeTotal = userTimeMax.reduce( (arr, x)=> { 
                          return arr + x }, 0 ).toPrecision(10) / 1;
  
  return userTimeTotal;
}

export const splitTidebyPeople = (tideArray)=> {
  
  let totalTimeNum = 0;
  let peopleTime = [];
  let usersNice = [];
  if(!tideArray) {
    null;
  }else{
    const usersGrab = Array.from(tideArray, x => x.who );
    usersNice = [...new Set(usersGrab)];
    
    for(let ul of usersNice) {
      let userTimeNum = 0;
      const userTide = tideArray.filter( x => x.who === ul );
      for(let bl of userTide) {
        const mStart = moment(bl.startTime);
        const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
        const block = moment.duration(mStop.diff(mStart)).asMinutes();
        totalTimeNum = totalTimeNum + block;
        userTimeNum = userTimeNum + block;
      }
      const userTime = Math.round( userTimeNum );
      peopleTime.push({
        uID: ul,
        uTime: userTime
      });
    }
  }
  const totalTime = Math.round( totalTimeNum );
  
  return { totalTime, peopleTime };
};