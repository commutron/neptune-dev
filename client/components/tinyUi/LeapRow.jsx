import React from 'react';

// requires props
// title as text
// sub as text incuding any joiner
// sty as className text
// address as string

const LeapRow = ({ title, cTwo, cThree, cFour, sty, address })=> {
  return(
    <div
      role='button'
      className={sty + ' leapRow up'}
      onClick={()=>FlowRouter.go(address)}
      value={title}>
      <span><p>{title}</p></span>
      {cTwo && <span><p>{cTwo}</p></span>}
      {cThree && <span><p>{cThree}</p></span>}
      {cFour && <span><p>{cFour}</p></span>}
    </div>
  );
};
  


export default LeapRow;