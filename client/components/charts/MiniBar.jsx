import React from 'react';

const MiniBar = ({ title, count, total })=> {
  let v = count;
  let t = total;
  
  let name = {
    position: 'relative',
    top: '0.75rem',
  };
  let bar = {
    width: '100%'
  };
  let num = {
    textAlign: 'right'
  };
  return(
    <div className='wide'>
      <p style={name} className='cap'>{title}</p>
      <progress style={bar} className='proGood' value={v} max={t}></progress>
      <p style={num}>{v}/{t}</p>
    </div>
  );
};

export default MiniBar;