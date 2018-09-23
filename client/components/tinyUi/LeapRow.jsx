import React from 'react';

// requires props
// title as text
// sub as text incuding any joiner
// sty as className text
// address as string

const LeapRow = ({ title, cTwo, cThree, cFour, cFive, sty, address })=> {
  return(
    <div
      role='button'
      className={sty + ' leapRow up'}
      onClick={()=>FlowRouter.go(address)}
      value={title}>
      <span>{title}</span>
      {cTwo && <span>{cTwo}</span>}
      {cThree && <span>{cThree}</span>}
      {cFour && <span>{cFour}</span>}
      {cFive && <span>{cFive}</span>}
    </div>
  );
};
  


export default LeapRow;