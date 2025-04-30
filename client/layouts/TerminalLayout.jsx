import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';

import { ScanListenLiteUtility, ScanListenLiteOff } from '/client/utility/ScanListener.js';

import HomeIcon from './HomeIcon';
// import FindBox from './FindBox';

// import TideControl from '/client/components/tide/TideControl/TideControl';
import TideFollow from '/client/components/tide/TideFollow';
// import { NonConMerge } from '/client/utility/NonConOptions';

// import EquipMenu from '/client/views/production/lists/EquipMenu';
// import TimeStop from '/client/components/tide/TimeStop';

const TerminalWrap = ({ 
  orb, user, users, app, 
  children
})=> {
  
  const [ showVerifyState, showVerifySet ] = useState(false);
  const [ optionVerify, optionVerifySet ] = useState(false);
  
  
  const [ ncTypesComboFlat, ncTypesComboSet ] = useState([]);
  
  
  useEffect( ()=> {
    ScanListenLiteUtility();
    return ()=> ScanListenLiteOff();
  }, []);
  
  useEffect( ()=> {
    console.log('orb in hand');
  }, [orb]);
  
  const eng = user?.engaged || false;
  const etPro = eng?.task === 'PROX';
  const etMlt = eng?.task === 'MLTI';
  // 'MAINT', 'EQFX';
  const etKey = eng?.tKey;
  
                        
  return(
    <div className={'kioskFrame do_not_use'}>
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        
        <div className='frontCenterTitle'>
          filer
        </div>
        <div className='auxRight'>
          
        </div>
        <TideFollow tOpen={null} />
      </div>
      
      <Fragment>
        
        <div className='kioskContent forceScrollStyle darkTheme'>
          
          {React.cloneElement(children,
            { 
              tideKey: etKey,
              engagedPro: etPro,
              engagedMlti: etMlt,
              
              ncTypesCombo: ncTypesComboFlat,
              
              showVerifyState: showVerifyState,
              optionVerify: optionVerify,
              
            }
          )}
        </div>
      
        
      </Fragment>
      {/*<div className='oneFooter' />*/}
    </div>
  );
};

export default TerminalWrap;