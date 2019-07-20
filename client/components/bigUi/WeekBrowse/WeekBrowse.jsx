import React from 'react';
import "./style.css";

const WeekBrowse = ({ yearNum, weekNum, tickWeek, backwardLock, forwardLock })=> (

  <p>
    <label>
      <button 
        title='First'
        className='BTTNtxtBTTN clear clearBlack'
        onClick={()=>tickWeek(false)} 
        disabled={backwardLock}
      ><i className="fas fa-angle-double-left fa-lg fa-fw"></i></button>
    </label>
    <label>
      <button 
        title='Previous'
        className='BTTNtxtBTTN clear clearBlack'
        onClick={()=>tickWeek('down')} 
        disabled={backwardLock}
      ><i className="fas fa-angle-left fa-lg fa-fw"></i></button>
    </label>
    <span className='bttnTXTbttn numFont'> {yearNum}<sub>w</sub>{weekNum} </span>
    <label>
      <button 
        title='Next'
        className='BTTNtxtBTTN clear clearBlack'
        onClick={()=>tickWeek('up')} 
        disabled={forwardLock}
      ><i className="fas fa-angle-right fa-lg fa-fw"></i></button>
    </label>
    <label>
      <button 
        title='This week'
        className='BTTNtxtBTTN clear clearBlack'
        onClick={()=>tickWeek('now')} 
        disabled={forwardLock}
      ><i className="fas fa-angle-double-right fa-lg fa-fw"></i></button>
    </label>
  </p>
);
        
export default WeekBrowse;