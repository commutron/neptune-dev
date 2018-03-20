import React from 'react';

/*
window.addEventListener('keypress', function onPress(event) {
    const inputKey = event.key;
    //console.log(inputKey);
    const inputCode = event.keyCode;
    let scanListener = Session.get('scanListener') ? 
                       Session.get('scanListener') : 
                       '';
    if( inputKey ) {
      if( inputCode === 13 ) { // "enter"
        if(scanListener.length === 9 || scanListener.length === 10) {
          Session.set('now', scanListener);
        }
        scanListener = '';
      }else if( !inputKey.match(/[0-9]/) ) {
        scanListener = '';
      }else if( inputKey.match(/[0-9]/) ) {
        scanListener = scanListener.concat(event.key);
      }
      Session.set('scanListener', scanListener);
    }
});
*/
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