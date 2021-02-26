import React from 'react';

  const sty = {
    textAlign: 'center',
    margin: '5px',

  };
  const bSty = {
    verticalAlign: 'bottom',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all'
  };
  
  const sSty = {
    fontSize: 'smaller',
    verticalAlign: 'top',
    textTransform: 'capitalize',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all',
  };
 
const NumStat = ({ num, icon, name, title, color, size, moreClass }) => (
  <div style={sty} title={title} className={'noCopy ' + moreClass || ''}>
    <span 
      style={bSty} 
      className={color + ' numFont ' + size}
    >{num ? num : <n-fa1><i className={`${icon} fa-lg`}></i></n-fa1>}</span>
    <br />
    <i style={sSty} className='label'>{name}</i>
  </div>
);

export default NumStat;