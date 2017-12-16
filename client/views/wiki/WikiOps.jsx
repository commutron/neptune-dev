import React from 'react';

import WikiFrame from './WikiFrame';

const WikiOps = ({ wi, root, anchor, fallback })=> {
  let goto = wi;
  
  //// custom Fallback for the transition \\\\
  if(fallback) {
    const num = fallback;
    const yr = num.slice(0,2);
    let pisces = root + '/doku.php?id=workorders:';
    if(yr == '16') {
      pisces = pisces + '16000:' + num;
    }else{
      pisces = pisces + '17000:' + num;
    }
    return pisces;
  }
  ////
  !goto || goto === 'home' || goto === 'none' ? goto = root : false;
  
  anchor ? goto = goto + '#' + anchor : false;

  return(
    <div className='instructionFix'>
      <WikiFrame go={goto} />
    </div>
  );
};

export default WikiOps;