import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

const WeekBrowse = ({ sendUp, app })=> {
  
  const [yearNum, setYearNum] = useState(moment().weekYear());
  const [weekNum, setWeekNum] = useState(moment().week());
  const [backwardLock, setBacklock] = useState(false);
  const [forwardLock, setForlock] = useState(true);
  
  function tickWeek(direction) {
    const yearNow = yearNum;
    const weekNow = weekNum;
    
    if( direction === 'down' ) {
      if( weekNow > 1 ) {
        setWeekNum( weekNow - 1 );
      }else{
        setYearNum( yearNow - 1 );
        setWeekNum( moment(yearNow - 1, 'YYYY').weeksInYear() );
      }
    }else if( direction === 'up') {
      if( weekNow < moment(yearNow, 'YYYY').weeksInYear() ) {
        setWeekNum( weekNow + 1 );
      }else{
        setYearNum( yearNow + 1 );
        setWeekNum( 1 );
      }
    }else if( direction === 'now') {
      setYearNum(moment().weekYear());
      setWeekNum(moment().week());
    }else{
      setYearNum(moment(app.tideWall || app.createdAt).weekYear());
      setWeekNum(moment(app.tideWall || app.createdAt).week());
    }
  }
  
  useEffect(() => {
    yearNum === moment().weekYear() && weekNum === moment().week() ?
      setForlock(true) : setForlock(false);
    yearNum === moment(app.tideWall || app.createdAt).weekYear() && 
    weekNum === moment(app.tideWall || app.createdAt).week() ?
      setBacklock(true) : setBacklock(false);
  
    sendUp({ yearNum, weekNum });
    
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({ yearNum, weekNum });
  }, [yearNum, weekNum]);
  
  const BTTNtxtBTTN = {
    lineHeight: '1',
    letterSpacing: '1px',
    minWidth: '2vmax',
  	height: '2.5vmax',
  	fontSize: '1.5vmax',
  	padding: '0 10px',
  };
  
  return(
    <span>
     
      <button 
        title='First'
        className='smallAction blackHover'
        style={{...BTTNtxtBTTN,borderRight: 'none'}}
        onClick={()=>tickWeek(false)} 
        disabled={backwardLock}
      ><i className="fas fa-angle-double-left fa-fw"></i></button>
   
      <button 
        title='Previous'
        className='smallAction blackHover'
        style={BTTNtxtBTTN}
        onClick={()=>tickWeek('down')} 
        disabled={backwardLock}
      ><i className="fas fa-angle-left fa-fw"></i></button>
      
      <span className='numFont' style={{fontSize: '2.5vmax',verticalAlign: 'middle'}}> {yearNum}<sub>w</sub>{weekNum} </span>
      
      <button 
        title='Next'
        className='smallAction blackHover'
        style={BTTNtxtBTTN}
        onClick={()=>tickWeek('up')} 
        disabled={forwardLock}
      ><i className="fas fa-angle-right fa-fw"></i></button>
    
      <button 
        title='This week'
        className='smallAction blackHover'
        style={{...BTTNtxtBTTN,borderLeft: 'none'}}
        onClick={()=>tickWeek('now')} 
        disabled={forwardLock}
      ><i className="fas fa-angle-double-right fa-fw"></i></button>
      
    </span>
  );
};
        
export default WeekBrowse;