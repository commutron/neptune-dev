import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import { TimeInDay } from '/client/utility/WorkTimeCalc.js';
// import Pref from '/client/global/pref.js';
import { 
  VictoryChart, VictoryArea, VictoryBar,
  VictoryLabel, VictoryAxis, 
  VictoryGroup
} from 'victory';
import Theme from '/client/global/themeV.js';


const TideWorkWeek = ({ 
  tideTimes, weekStart, weekEnd, weekdays,
  app, users, isDebug, selectDayUP
})=> {
  
  const [ dayhoursNum, dayhoursSet ] = useState([0, 0, 0, 0, 0]);
  const [ workhoursNum, workhoursSet ] = useState([0, 0, 0, 0, 0]);
  // const [ hoursMaxNum, hoursMaxSet ] = useState([0, 0, 0, 0, 0]);
  const [ topDayHours, topDayHoursSet ] = useState(50);
  
  // const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
  //                                     !Roles.userIsInRole(x._id, 'readOnly') 
  //                                     ).length;
    
  useLayoutEffect( ()=> {
    
    let workDays = [];
    
    if(tideTimes && weekStart && weekEnd) {
      
      for(const [index, day] of weekdays.entries()) {
        const dateTime = weekStart.clone().add(index, 'day').format();
        //if( weekEnd.add(1, 'day').isSame(dateTime, 'day') ) {
        if( weekEnd.isBefore(dateTime, 'day') ) {
          break;
        }else{
          const dayHours = TimeInDay( app.nonWorkDays, dateTime );
          const tideTime = tideTimes.filter( x => 
                              moment(x.startTime).isSame(dateTime, 'day') );
  
          let dTotal = tideTime.reduce( (arr, x)=> {
            let mStop = x.stopTime ? moment(x.stopTime) : moment();
            let durr = moment.duration(mStop.diff(x.startTime)).asHours();
            return arr + durr }, 0 );
          const dTotalNice = Math.round((dTotal + Number.EPSILON) * 100) / 100;
                                        // exactly rounding to 2 decimal points
          const unqUsers = new Set( Array.from(tideTime, x => x.who ) ).size;
          
          workDays.push({
            day: day,
            hoursDay: dayHours * unqUsers,
            hoursRec: dTotalNice,
            // hoursMax: dayHours * liveUsers
          });
        }
      }
      
      dayhoursSet( Array.from(workDays, x => { 
        return { 'x': x.day, 'y': x.hoursDay } } )
      );
      workhoursSet(Array.from(workDays, x => { 
        return { 'x': x.day, 'y': x.hoursRec } } )
      );
      // hoursMaxSet( Array.from(workDays, x => { 
      //   return { 'x': x.day, 'y': x.hoursMax } } )
      // );
      
      const dht = Array.from(workDays, x => x.hoursDay );
      const whr = Array.from(workDays, x => x.hoursRec.toString() );
      // const dhm = Array.from(workDays, x => x.hoursMax );
      topDayHoursSet( Math.max(...dht,...whr) );
    
      isDebug && console.log({workDays});
    }
  }, [tideTimes, weekStart, weekEnd]);

 
  isDebug && console.log({dayhoursNum, workhoursNum, topDayHours});
  
  return(
    <div className=''>
      
    <VictoryChart 
      theme={Theme.NeptuneVictory}
      height={200} 
      width={500}
      padding={{ top: 10, bottom: 20, left: 20, right: 10 }}
      domainPadding={25}
      // animate={{
      //     duration: 1000,
      //     onLoad: { duration: 2000 }
      //   }}
    >
    
    <VictoryAxis />
        
    <VictoryGroup
      categories={{ x: weekdays }}
      minDomain={{ y: 0 }}
      maxDomain={{ y: topDayHours }}>
    
      {/*<VictoryArea
        data={hoursMaxNum}
        style={{ 
          data: { 
            fill: 'white',
            fillOpacity: 0.2,
            stroke: 'darkgray',
          } }}
        labels={(d) => d.y}
        labelComponent={
          <VictoryLabel 
            style={{ fill: 'darkgray' }} 
            renderInPortal />
        }
      />*/}
      
      <VictoryArea
        data={dayhoursNum}
        style={{ 
          data: { 
            fill: 'whitesmoke',
            fillOpacity: 0.4,
            stroke: 'rgb(23,123,201)',
          } }}
        labels={(d) => d.y}
        labelComponent={
          <VictoryLabel 
            style={{ fill: 'rgba(23,123,201,0.7)' }} 
            renderInPortal />
        }
      />
      
      <VictoryBar
        data={workhoursNum}
        style={{ data: { 
          fill: 'rgb(23,123,201)', 
          fillOpacity: 0.4, 
          stroke: 'rgb(23,123,201)', 
          strokeOpacity: 1, 
          strokeWidth: 1 
        } }}
        labels={(d) => d.y}
        labelComponent={
          <VictoryLabel 
            style={{ fill: 'black' }} 
            renderInPortal />
        }
        events={[
          {
            target: "data",
            eventHandlers: {
              onClick: () => {
                return [{
                  target: "labels",
                  mutation: (props) => {
                    const hours = props.datum.y;
                    const day = props.datum.x;
                    selectDayUP(day);
                    let other = moment.duration(hours, 'hours').asMinutes();
                    return props.text === other + ' min' ?
                      null : { text: other + ' min' };
                  }
                }];
              }
            }
          }
        ]}
      />
      
    </VictoryGroup>

   </VictoryChart>
   
      <details className='footnotes'>
        <summary>Chart Details</summary>
        {/*<p className='footnote'>
          Max Line is the MAX hours available of all <em>active</em> users ({liveUsers})</p>*/}
        <p className='footnote'>
          Upper Line is the TOP hours of that days <em>engaged</em> users</p>
        <p className='footnote'>
          Bar is the Recorded hours of that days <em>engaged</em> users</p>
        <p className='footnote'>Corrected for idle minutes.</p>
        <dl className='monoFont'>
          <dd>lunch_time = day_total  less-than-or-equals 5 then 0 or-else 45</dd>
          <dd>break_time = day_total less-than-or-equals 5 then 15 or-else 30</dd>
          <dd>total_idle = lunch_time + break_time + 15</dd>
        </dl>
      </details>
      
    </div>
  );
};

export default TideWorkWeek;