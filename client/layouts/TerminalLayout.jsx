import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';

import { ScanListenerUtility, ScanListenerOff } from '/client/utility/ScanListener.js';

import HomeIcon from './HomeIcon';
// import FindBox from './FindBox';

// import TideControl from '/client/components/tide/TideControl/TideControl';
import TideFollow from '/client/components/tide/TideFollow';
// import { NonConMerge } from '/client/utility/NonConOptions';

// import EquipMenu from '/client/views/production/lists/EquipMenu';
// import TimeStop from '/client/components/tide/TimeStop';



const TerminalWrap = ({ 
  user, users, app, 
  children
})=> {
  
  const [ showVerifyState, showVerifySet ] = useState(false);
  const [ optionVerify, optionVerifySet ] = useState(false);
  
  
  const [ ncTypesComboFlat, ncTypesComboSet ] = useState([]);
  
  
  useEffect( ()=> {
    if(Meteor.user()) {
      ScanListenerUtility(Meteor.user());
    }
    return ()=> ScanListenerOff();
  }, []);
  
  const eng = user?.engaged || false;
  const etPro = eng?.task === 'PROX';
  const etMlt = eng?.task === 'MLTI';
  // 'MAINT', 'EQFX';
  const etKey = eng?.tKey;
  
  
  const viewContainer = 'pro_100';
                        
  return(
    <div className={viewContainer + ' containerPro do_not_use'}>
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
        
        <div className='proPrime forceScrollStyle darkTheme'>
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
      
    </div>
  );
};

export default TerminalWrap;