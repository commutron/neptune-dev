import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import { 
  TimeInDay, UsersTimeTotal, HolidayCheck
} from '/client/utility/WorkTimeCalc.js';
import { round2Decimal } from '/client/utility/Convert.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
  Title,
  Tooltip
);

const TideWorkWeek = ({ 
  tideTimes, weekStart, weekEnd, weekdays,
  app, users, isDebug, 
  // selectDayUP,
  totalWeekHrsUP, totalLogHrsUP, diffPotHrsUP
})=> {
  
  const [ dayhoursNum, dayhoursSet ] = useState([0, 0, 0, 0, 0]);
  const [ workhoursNum, workhoursSet ] = useState([0, 0, 0, 0, 0]);
  const [ nonDays, nonDaysSet ] = useState([]);
    
  useLayoutEffect( ()=> {
    
    let workDays = [];
    let nonWorkDays = [];
    
    let totalWeekTime = 0;
    let totalLogTime = 0;
    
    if(tideTimes && weekStart && weekEnd) {
      
      for(const [index, day] of weekdays.entries()) {
        const dateTime = weekStart.clone().add(index, 'day').format();
        if( weekEnd.isBefore(dateTime, 'day') ) {
          break;
        }else{
          const dayHours = TimeInDay( app, dateTime );
          const isNoDay = HolidayCheck(app, dateTime);
          if(isNoDay) { 
            nonWorkDays.push(day);
          }
          
          const tideTime = tideTimes.filter( x => 
                              moment(x.startTime).isSame(dateTime, 'day') );
  
          const dTotal = tideTime.reduce( (arr, x)=> arr + x.durrAsMin, 0);
          const durrHr = moment.duration(dTotal, 'minutes').asHours();
          const dTotalNice = round2Decimal(durrHr);
    
          const userIDs = new Set( Array.from(tideTime, x => x.who ) );
          const getUsersTime = UsersTimeTotal( userIDs, users, dateTime, 'day', dayHours );
          
          workDays.push({
            day: day,
            hoursDay: getUsersTime,
            hoursRec: dTotalNice,
          });
          
          totalWeekTime = totalWeekTime + getUsersTime;
          totalLogTime = totalLogTime + dTotalNice;
        }
      }
      
      dayhoursSet( Array.from(workDays, x => { 
        return { 'x': x.day, 'y': x.hoursDay } } )
      );
      workhoursSet(Array.from(workDays, x => { 
        return { 'x': x.day, 'y': x.hoursRec } } )
      );
      nonDaysSet(nonWorkDays);
      
      totalWeekHrsUP( round2Decimal(totalWeekTime) );
      totalLogHrsUP( round2Decimal(totalLogTime) );
      diffPotHrsUP( round2Decimal(totalWeekTime - totalLogTime) );
      
      isDebug && console.log({workDays});
    }
  }, [tideTimes, weekStart, weekEnd]);

  const options = {
    responsive: true,
    animation: false,
    elements: {
      line: {
        borderColor: 'rgb(26, 188, 156)',
        fill: false,
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        type: 'category',
        offset: true
      },
      y: {
        type: 'linear',
        ticks: {
          precision: 1,
        },
      }
    },
    plugins: {
      title: {
        display: false
      },
      legend: false,
    },
  };
  
  isDebug && console.log({dayhoursNum, workhoursNum});
  
  return(
    <div>
      {nonDays.length > 0 &&
        <div>
          <span>Holiday: </span>
          {nonDays.map( (n,i)=> <span key={i}>{n}</span> )}
        </div>
      }
 
      <div className='chart50vContain'>
        <Bar 
          options={options} 
          data={{
            datasets:[
              {
                type:'bar',
                data:workhoursNum,
                normalized: true,
                pointHitRadius: 10,
                backgroundColor:'rgb(23,123,201,0.4)',
                borderColor:'rgb(23,123,201)'
              },
              {
                type:'line',
                data:dayhoursNum,
                normalized: true,
                pointRadius:1,
                pointHitRadius:10
              }
            ]
          }} 
        />
      </div>
   
      <details className='footnotes'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          Upper Line is the TOP hours of that days <em>engaged</em> users</p>
        <p className='footnote'>
          Bar is the Recorded hours of that days <em>engaged</em> users</p>
        <p className='footnote'>Corrected for breaks minutes.</p>
        <dl className='monoFont'>
          <dd>break_time = day_total less-than-or-equals 5 then 15 or-else 30</dd>
        </dl>
      </details>
      
    </div>
  );
};

export default TideWorkWeek;