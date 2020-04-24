import React from 'react';

const ActionLink = ({ address, title, icon, color, noText }) => (
  <button
    title={title}
    className='transparent'
    onClick={()=>FlowRouter.go(address)}
    disabled={false}>
    <label className='navIcon actionIconWrap'>
      <i className={'fa ' + icon + ' fa-lg ' + color} aria-hidden='true'></i>
      {!noText && <span className={'actionIconText ' + color}> {title}</span>}
    </label>
  </button>
);

export default ActionLink;










