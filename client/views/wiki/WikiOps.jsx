import React from 'react';

import WikiFrame from './WikiFrame';

const WikiOps = ({ wi, root, anchor, fallback, full })=> {
  let goto = wi;
  
  //// custom Fallback for the transition \\\\
  if(fallback) {
    const num = fallback;
    const yr = num.slice(0,2);
    let pisces = root + '?id=workorders:';
    if(yr == '16') {
      pisces = pisces + '16000:' + num;
    }else{
      pisces = pisces + '17000:' + num;
    }
    goto = pisces;
  }else{
    !goto || goto === 'home' || goto === 'none' ? goto = root : false;
    anchor ? goto = goto + '#' + anchor : false;
  }

  return(
    <div className='invert'>
      <WikiFrame go={goto} full={full} />
    </div>
  );
};

export default WikiOps;