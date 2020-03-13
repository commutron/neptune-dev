import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time-ship';
import '/client/components/utilities/ShipTime.js';

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

      const workTime = dayTotal <= 5 ? dayTotal :
        moment.duration(dayTotal, 'hours').subtract(45, 'minutes').asHours();
      
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
    
    const workTime = dayTotal <= 5 ? dayTotal :
      moment.duration(dayTotal, 'hours').subtract(45, 'minutes').asHours();
    
    return workTime;
  }else{
    return 0;
  }
}

export function TimeRemainDay( nonWorkDays, dayTime ) {
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  
  if(moment(dayTime).isValid()) {
  
    const end = moment(dayTime).endOf('day');
    
    const dayTotal = end.workingDiff(dayTime, 'hours', true);
    
    const workTime = dayTotal >= 5.75 ?
        moment.duration(dayTotal, 'hours').subtract(45, 'minutes').asHours() :
      dayTotal >= 5.5 ?
        moment.duration(dayTotal, 'hours').subtract(30, 'minutes').asHours() :
      dayTotal >= 5.25 ?
        moment.duration(dayTotal, 'hours').subtract(15, 'minutes').asHours() :
      dayTotal;
    const workTimeNice = workTime.toFixed(2, 10);
    
    return workTimeNice;
  }else{
    return 0;
  }
}