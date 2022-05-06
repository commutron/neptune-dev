import React from 'react';
import s from './style.css';

const MiniBar = ({ title, count, total, barColor })=> {
  let v = count;
  let t = total === 'percent' ? 100 : total;
  
  let name = {
    position: 'relative',
    top: '0.75rem',
  };
  let num = {
    textAlign: 'right',
    letterSpacing: '1px'
  };
  return(
    <div className={`${s.miniScale} ${s.meterprogStack}`}>
      <p style={name} className='cap'>{title}</p>
      <progress className={barColor || 'proGood'} value={v} max={t}></progress>
      <p style={num} className='numFont'
        >{total === 'percent' ? `${v}%` : `${v}/${t}`}
      </p>
    </div>
  );
};

export default MiniBar;