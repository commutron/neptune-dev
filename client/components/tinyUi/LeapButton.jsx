import React from 'react';

// requires props
// title as text
// sub as text incuding any joiner
// sty as className text
// address as string

const LeapButton = ({ title, sub, sty, address })=> {
  let cssStyle = sty || 'action clear';
  return (
    <button
      className={cssStyle}
      onClick={()=>FlowRouter.go(address)}
      value={title}>
      <i className='up'>{title}</i>
      <br />
      <i className='smaller'>{sub}</i>
    </button>
  );
};

export default LeapButton;