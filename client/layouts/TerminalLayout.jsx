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

function testWithPaste(event) {
  event.preventDefault();
  const val = (event.clipboardData || window.clipboardData).getData("text");
  if(val) {
    Session.set('now', val);
  }
}

const TerminalWrap = ({ 
  orb, user, users, app, 
  hotReady, hotxBatch,
  children
})=> {
  
  const [ kactionState, kactionSet ] = useState(false);
  const [ klisten, klistenSet ] = useState(false);
  const [ kondeckState, kondeckSet ] = useState(false);
  const [ konfirm, konfirmSet ] = useState(undefined);
  
  const [ ncTypesComboFlat, ncTypesComboSet ] = useState([]);
  
  useEffect( ()=> {
    ScanListenLiteUtility();
    return ()=> {
      ScanListenLiteOff();
      window.removeEventListener('paste', testWithPaste);
    };
  }, []);
  
  const kflash = (state)=> {
    konfirmSet(state);
    Meteor.setTimeout(()=>konfirmSet(undefined),!state ? 7500 : 750);
  };
  
  useEffect( ()=> {
    if(klisten && kactionState === 'info') {
      Meteor.apply('kallInfo', 
        [ orb ],
        {wait: true},
        (error, re)=> {
          error && console.error(error);
          kondeckSet(re);
          kflash(re);
        } 
      );
    }
  }, [orb]);
  
  useEffect( ()=> {
    console.log({kactionState});
    
    console.log({kondeckState});
    
    console.log({hotxBatch});
    
  }, [kactionState, kondeckState, hotxBatch]);
  
  const startListen = ()=> {
    klistenSet(true);
    window.addEventListener("paste", testWithPaste);
  };
  
  const stopListen = ()=> {
    klistenSet(false);
    window.removeEventListener('paste', testWithPaste);
  };
  
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
          <select 
            id='kioskSelect' 
            onChange={(e)=>kactionSet(e.target.value)}
            value={kactionState}
            className={!kactionState ? 'grayT' : ''}
            disabled={klisten}>
            <option value='' className='grayT'>Select Terminal Action</option>
            <option value='info'>Info</option>
            <option value='serial' disabled={true}>Initiate Serial</option>
            <option value='checkpoint' disabled={true}>Checkpoint</option>
            <option value='complete' disabled={true}>Complete</option>
          </select>
        </div>
        <div className='auxRight'>
          
        </div>
        <TideFollow tOpen={null} />
      </div>
      
      <Fragment>
        
        <div className='kioskContent forceScrollStyle darkTheme'>
          
          <div className={`kioskTask ${klisten ? 'nBg' : kactionState ? 'intrBlueSq' : ''}`}>
            {!kactionState ?
              <n-fa0><i className="fa-solid fa-power-off fa-fw fillstatic"></i></n-fa0>
            :
              !klisten ?
                <button 
                  title='Start Listening'
                  className='kioskListen' 
                  onClick={()=>startListen()}>
                  <n-fa0><i className="fa-solid fa-compact-disc fa-fw"></i></n-fa0>
                  <span>Ready</span>
                </button>
              :
                <button 
                  title='Stop Listening'
                  className='kioskListen' 
                  onClick={()=>stopListen()}>
                  <n-fa1><i className="fa-solid fa-compact-disc fa-fw fa-spin"></i></n-fa1>
                  <span>Listening...</span>
                </button>
            }
          </div>
          
          
          <div className='kioskBatch'>
            {hotxBatch ?
              <div>{hotxBatch.batch}</div>
              :
              <div>no batch on deck</div>
            }
          </div>
          
          {konfirm === undefined ? null :
           konfirm ?
            <div className='kioskFlash good'>
              <n-faA><i className='fas fa-check fa-fw'></i></n-faA>
            </div>
            :
            <div className='kioskFlash bad'>
              <n-faX><i className='fas fa-times fa-fw'></i></n-faX>
            </div>
          }
          
          {React.cloneElement(children,
            { 
              tideKey: etKey,
              engagedPro: etPro,
              engagedMlti: etMlt,
              
              ncTypesCombo: ncTypesComboFlat,
              
              kondeckState: kondeckState
            }
          )}
        </div>
      
      </Fragment>
    </div>
  );
};

export default TerminalWrap;