import React from 'react';

const ActionFunc = ({ doFunc, title, icon, color, noText, lockOut }) => (
  <button
    title={title}
    className='transparent'
    onClick={()=>doFunc()}
    disabled={lockOut}>
    <label className='navIcon actionIconWrap'>
      <i className={'fa ' + icon + ' fa-lg ' + color}></i>
      {!noText && <span className={'actionIconText ' + color}> {title}</span>}
    </label>
  </button>
);

export default ActionFunc;