import React from 'react';

const ActionLink = ({ address, title, icon, color }) => (
  <button
    title={title}
    className='transparent'
    onClick={()=>FlowRouter.go(address)}
    disabled={false}>
    <label className='navIcon actionIconWrap'>
      <i className={'fa ' + icon + ' fa-2x ' + color} aria-hidden='true'></i>
      <span className={'actionIconText ' + color}> {title}</span>
    </label>
  </button>
);

export default ActionLink;









