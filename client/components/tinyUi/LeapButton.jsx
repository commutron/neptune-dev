import React from 'react';

const LeapButton = ({ title, sub, sty, address, bonusFloat, bonusColor })=> {
  let cssStyle = sty || 'action clear';
  return (
    <button
      data-bonus={bonusFloat}
      data-color={bonusColor}
      className={cssStyle + ' ' + ( bonusFloat ? 'leapBonus' : '')}
      onClick={()=>FlowRouter.go(address)}
      value={title}>
      <i className='up'>{title}</i>
      <br />
      <i className='smaller'>{sub}</i>
    </button>
  );
};

export default LeapButton;