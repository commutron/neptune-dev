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
      
      const lunchTime = dayTotal <= 5 ? 0 : 45; // << hard coded 45min lunch
      const breakTime = dayTotal <= 5 ? 15 : 30; // << hard coded 15min breaks
      const idleTime = lunchTime + breakTime + 15; // << hard coded common idle
      const minusTime = dayTotal === 0 || ( dayTotal * 60 ) < idleTime ? 0 : idleTime;
        
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

    const lunchTime = dayTotal <= 5 ? 0 : 45; // << hard coded 45min lunch
    const breakTime = dayTotal <= 5 ? 15 : 30; // << hard coded 15min breaks
    const idleTime = lunchTime + breakTime + 15; // << hard coded common idle
    const minusTime = dayTotal === 0 || ( dayTotal * 60 ) < idleTime ? 0 : idleTime;
    
    const workTime = moment.duration(dayTotal, 'hours')
                      .subtract(minusTime, 'minutes').asHours();
                      
    return workTime;
  }else{
    return 0;
  }
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
    
    const lunchTime = dayTotal >= 5.75 ? 45 : 
                      dayTotal >= 5.5 ? 30 : 
                      dayTotal >= 5.25 ? 15 : 0;
                      
    const breakTime = dayTotal <= 6 ? 15 : 30; // fuzzy

    const idleTime = lunchTime + breakTime + 15;
    const minusTime = dayTotal === 0 || ( dayTotal * 60 ) < idleTime ? 0 : idleTime;
    
    const workTime = moment.duration(dayTotal, 'hours')
                      .subtract(minusTime, 'minutes').asHours();
    
    return workTime;
  }else{
    return 0;
  }
}*/