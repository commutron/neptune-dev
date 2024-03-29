import React from 'react';
import s from './style.css';

const MiniMeter = ({ title, count, app })=> {
  let df = app.ncScale || { low: 5, high: 15, max: 25 };
  
  let name = {
    position: 'relative',
    top: '0.75rem',
  };
  let bar = {
    width: '100%',
    height: '5px'
  };
  let num = {
    textAlign: 'right'
  };
  return(
    <div className={`wide ${s.miniScale} ${meterprogStack}`}>
      <p style={name} className='cap'>{title}</p>
      <meter
        style={bar}
        value={count}
        min={0}
        optimum={1}
        low={df.low}
        high={df.high}
        max={df.max}>
      </meter>
      <p style={num} className='numFont'>{count}</p>
    </div>
  );
};

export default MiniMeter;