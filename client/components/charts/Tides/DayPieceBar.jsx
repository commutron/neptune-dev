import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { TimeInDay } from '/client/utility/WorkTimeCalc.js';
import { UserTime } from '/client/utility/WorkTimeCalc.js';
import { round2Decimal } from '/client/utility/Convert.js';
// import Pref from '/client/global/pref.js';


const DayPieceBar = ({ tideTimes, dateTime, regDayStart, regDayEnd, app, user })=> {
  
  const [ maxHours, maxHoursSet ] = useState(0);
  const [ durrTotal, durrSet ] = useState(0);
  const [ chunkArr, chunkSet ] = useState([]);
  
  useEffect( ()=> {
    if(tideTimes.length > 0) {
    
      const dTotal = tideTimes.reduce( (arr, x)=> { return arr + x.durrAsMin }, 0);
      const durrHr = moment.duration(dTotal, 'minutes').asHours();
      const dTotalNice = round2Decimal(durrHr);
      durrSet(dTotalNice);
      
      const firstBlock = tideTimes[0];
      const lastTime = firstBlock.stopTime || moment().format();
      
      const lastBlock = tideTimes[tideTimes.length-1];
      const firstTime = lastBlock.startTime;
      
      const dayStart = moment(firstTime).isBefore(regDayStart) ?
                        firstTime : regDayStart.format();
      const dayEnd = moment(lastTime).isAfter(regDayEnd) ?
                      lastTime : regDayEnd.format();
      
      const chunkStart = moment(dayStart);
      let chunks = [];
      for(let c = chunkStart; c.isBefore(dayEnd); c.add(10, 'minutes') ) {
        const hourFound = tideTimes.filter( x => {
          let mStop = x.stopTime || moment();
          let next = c.clone().add(10, 'minutes');
          if( moment(x.startTime).isBetween(c, next, null, '[)' ) ||
          c.isBetween(x.startTime, mStop, null, '[]' ) ) {
            return x;
          }
        }).length > 0 ? true : false;
        chunks.push(hourFound);
      }
      chunkSet(chunks);
    }
    
  }, [tideTimes]);
  
  
  useEffect( ()=> {
    const dayHours = TimeInDay( app, dateTime );
    const proHours = UserTime( user, dateTime, 'day', dayHours );
    maxHoursSet(proHours);
  }, [dateTime]);
  
  return(
    <n-piece-bar-wrap>
      <n-piece-bar>
        {chunkArr.map( (et, ix)=>{
          if(!et) { 
            return <n-pc-off key={ix}></n-pc-off>;
          }else{
            return <n-pc-on key={ix}></n-pc-on>;
          }
        })}
      </n-piece-bar>
      <n-prog-bar className='balance'>
        <progress className='progBlue' value={durrTotal} max={maxHours}></progress>
      </n-prog-bar>
    </n-piece-bar-wrap>
  );
};

export default DayPieceBar;