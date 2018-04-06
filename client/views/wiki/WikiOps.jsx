import React from 'react';

import WikiFrame from './WikiFrame';

const WikiOps = ({ wi, root, anchor, fallback })=> {
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
  /*
  let sty = {
    width: '100%',
    border: '0',
    margin: '0',
    padding: '0',
  };
  */

  return(
    <div className='invert'>
      <WikiFrame go={goto} />
      {/*
      <object
        data={goto}
        style={sty}
        height={ ( window.innerHeight - 113 ) + 'px' } 
        type="text/html">
        Alternative Content
      </object>
      */}
    </div>
  );
};

export default WikiOps;