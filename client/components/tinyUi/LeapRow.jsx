import React from 'react';

// requires props
// title as text
// sub as text incuding any joiner
// sty as className text
// address as string

const LeapRow = ({ title, cTwo, cThree, cFour, cFive, cSix, cSeven, cEight, cNine, cTen, sty, address })=> {
  return(
    <div
      role='button'
      className={sty + ' leapRow'}
      onClick={()=>FlowRouter.go(address)}
      value={title}>
      <span>{title}</span>
      {cTwo && <span>{cTwo}</span>}
      {cThree && <span>{cThree}</span>}
      {cFour && <span>{cFour}</span>}
      {cFive && <span>{cFive}</span>}
      {cSix && <span>{cSix}</span>}
      {cSeven && <span>{cSeven}</span>}
      {cEight && <span>{cEight}</span>}
      {cNine && <span>{cNine}</span>}
      {cTen && <span>{cTen}</span>}
    </div>
  );
};
  


export default LeapRow;