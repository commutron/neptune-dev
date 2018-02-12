import React from 'react';

const ScanWrap = ({ children })=> {
    
  let scrollFix = {
    overflowY: 'auto'
  };
  let overScrollSpacer = {
    width: '100%',
    height: '60px'
  };
  
  return (
    <div className='dashMainSplit'>
      <div className='dashMainLeft' style={scrollFix}>
        {children[0]}
        <div style={overScrollSpacer}></div>
      </div>
      
      <div className='gridMainRight' style={scrollFix}>
        {children[1]}
        <div style={overScrollSpacer}></div>
      </div>
    </div>
  );
};

export default ScanWrap;