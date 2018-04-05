import React from 'react';

const LeapText = ({ title, sty, address })=> {
  let cssStyle = sty ? 'leapText ' + sty : 'leapText';
  return (
    <button
      className={cssStyle}
      onClick={()=>FlowRouter.go(address)}
      >{title}
    </button>
  );
};

export default LeapText;