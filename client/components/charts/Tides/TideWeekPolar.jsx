import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TimeInDay } from '/client/components/utilities/WorkTimeCalc.js';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';


const TideWeekPolar = ({ tideTimes, dateTime, yearNum, weekNum, app })=> {
  
  const [ workWeek, workWeekSet ] = useState([]);
  
  useEffect( ()=> {
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    let workDays = [];
    
    if(tideTimes && yearNum && weekNum) {
      const pinDate = moment().year(yearNum).week(weekNum);
      const weekStart = pinDate.startOf('week');
      
      for(const [index, day] of weekdays.entries()) {
        const dateTime = weekStart.clone().add(index, 'day').format();
        const dayHours = TimeInDay( app.nonWorkDays, dateTime );
        const tideTime = tideTimes.filter( x => 
                            moment(x.startTime).isSame(dateTime, 'day') );

        let dTotal = tideTime.reduce( (arr, x)=> {
          let mStop = x.stopTime ? moment(x.stopTime) : moment();
          let durr = moment.duration(mStop.diff(x.startTime)).asHours();
          return arr + durr }, 0 )
        .toFixed(2, 10);
        
        const unqUsers = new Set( Array.from(tideTime, x => x.who ) ).size;
        
        workDays.push({
          day: day,
          hoursDay: dayHours,
          hoursRec: dTotal,
          users: unqUsers
        });
      }
      workWeekSet(workDays);
    
      console.log({workDays});
    }
  }, [tideTimes, dateTime]);
  

  // const calcEx = showUser ? ` (people x ${maxHours})` : '';
  
  return(
    <div className='balance middle'>
      
      see console
      
      {/*
      <NumStatRing
        total={durrTotal}
        nums={[ durrTotal, ((userTotal * maxHours) - durrTotal) ]}
        name='Total Hours'
        title={`total of durations in hours \nout of ${userTotal * maxHours}${calcEx}`}
        colour='blueBi'
        maxSize='chart10Contain'
      />
      */}
    </div>
  );
};

export default TideWeekPolar;