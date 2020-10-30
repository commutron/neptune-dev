import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import './ShipTime.js';

import { round2Decimal } from '/client/utility/Convert.js';

export function HolidayCheck( nonWorkDays, dateTime ) {
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  const isit = moment(dateTime).isHoliday() ? true : false;
  return isit;
}

export function listShipDays( nonWorkDays, arrLength, withLast ) {
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  const now = moment().lastShipDay();

  let sArr = [];
  for(let s = 0; sArr.length < arrLength; s++) {
    const newDay = sArr.length === 0 ?
                    withLast ? now : now.nextShipDay() :
                    sArr[sArr.length - 1].nextShipDay();
    sArr.push(newDay);
  }
  return sArr;
}

export function TimeInWeek( nonWorkDays, weekStart ) {
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  if(moment(weekStart, ["YYYY", moment.ISO_8601]).isValid()) {
  
    const begin = moment(weekStart).startOf('day').format(); 

    let weekTotal = 0;
    
    for(let n = 0; n < 7; n++) {
      const dayStart = moment(begin).add(n, 'd');
      const dayEnd = moment(begin).add(n, 'd').endOf('day');
      const dayTotal = dayEnd.workingDiff(dayStart, 'hours', true);
      
      const breakTime = dayTotal <= 5 ? 15 : 30; // << hard coded 15min breaks
      //const idleTime = breakTime + 15; // << hard coded common idle
      const minusTime = ( dayTotal * 60 ) < breakTime ? 0 : breakTime;
        
      const workTime = moment.duration(dayTotal, 'hours')
                        .subtract(minusTime, 'minutes').asHours();

      weekTotal = weekTotal + workTime;
    }
    return weekTotal;
  }else{
    return 0;
  }
}


export function TimeInDay( nonWorkDays, dayStart ) {
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  
  if(moment(dayStart, ["YYYY", moment.ISO_8601]).isValid()) {
  
    const begin = moment(dayStart).startOf('day').format(); 
    const end = moment(dayStart).endOf('day').format();
    const dayTotal = moment(end).workingDiff(begin, 'hours', true);

    const breakTime = dayTotal <= 5 ? 15 : 30; // << hard coded 15min breaks
    //const idleTime = breakTime + 15; // << hard coded common idle
    const minusTime = ( dayTotal * 60 ) < breakTime ? 0 : breakTime;
    
    const workTime = moment.duration(dayTotal, 'hours')
                      .subtract(minusTime, 'minutes').asHours();
                      
    return workTime;
  }else{
    return 0;
  }
}

export function UserTime( userObj, dateTime, span, spanHours ) {
  
  const userProTime = userObj.proTimeShare || false;
  const relProTime = !userProTime ? false : 
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

/*
export function TimeRemainDay( nonWorkDays, dayTime ) {
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  
  if(moment(dayTime).isValid()) {
  
    const end = moment(dayTime).endOf('day');
    
    const dayTotal = end.workingDiff(dayTime, 'hours', true);
                      
    const breakTime = dayTotal <= 5 ? 15 : 30; // fuzzy

    const minusTime = dayTotal === 0 || ( dayTotal * 60 ) < breakTime ? 0 : breakTime;
    
    const workTime = moment.duration(dayTotal, 'hours')
                      .subtract(minusTime, 'minutes').asHours();
    
    return workTime;
  }else{
    return 0;
  }
}*/