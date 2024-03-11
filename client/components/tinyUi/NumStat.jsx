import React from 'react';
  
  const sty = {
    textAlign: 'center',
  };
  const bSty = {
    verticalAlign: 'bottom',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all'
  };
  
  const sSty = {
    verticalAlign: 'top',
    textTransform: 'capitalize',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all',
  };
 
const NumStat = ({ num, icon, name, title, color, size, moreClass }) => (
  <div style={sty} title={title} className={'numFont noCopy centre  ' + (moreClass || '')}>
    <span 
      style={bSty} 
      className={color + ' ' + size}
      >{num !== false ? num : <n-fa1><i className={icon}></i></n-fa1>}
    </span>
    <n-sm style={sSty} class='label'>{name}</n-sm>
  </div>
);

export default NumStat;