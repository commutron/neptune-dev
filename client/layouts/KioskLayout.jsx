import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
// import moment from 'moment';

import { ScanListenLiteUtility, ScanListenLiteOff } from '/client/utility/ScanListener.js';

import HomeIcon from './HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';
// import TideControl from '/client/components/tide/TideControl/TideControl';
// import TimeStop from '/client/components/tide/TimeStop';

import KioskScopeData from '/client/views/kiosk/KioskScopeData';

// function testWithPaste(event) {
//   event.preventDefault();
//   const val = (event.clipboardData || window.clipboardData).getData("text");
//   if(val) {
//     Session.set('now', val);
//   }
// }

const KioskWrap = ({ user, eBatch, doSerial, users, app, allTrace })=> {
  
  const [ bScope, bScopeSet ] = useState(false);
  
  const [ kactionState, kactionSet ] = useState(false);
  const [ klisten, klistenSet ] = useState(false);

  useEffect( ()=> {
    ScanListenLiteUtility();
    return ()=> {
      ScanListenLiteOff();
      // window.removeEventListener('paste', testWithPaste);
      Session.set('now', '');
    };
  }, []);
  
  useEffect( ()=> {
    bScope && bScopeSet(false);
    Session.set('now', '');
  }, [kactionState]);
  
  const toggleListen = ()=> {
    // if(klisten) {
    //   window.removeEventListener('paste', testWithPaste);
    // }else{
    //   window.addEventListener("paste", testWithPaste);
    // }
    klistenSet(!klisten);
  };
  
  const doText = kactionState === 'info' ? 'Listening...' :
                 kactionState === 'serial' ? 'Initiate Serial...' :
                 '...';
  
  const KListener = <button 
                      title={!klisten ? 'Start Listening' : 'Stop Listening'}
                      className='kioskListen' 
                      onClick={()=>toggleListen()}>
                      <n-fa0><i className={`las la-compact-disc la-fw ${!klisten ? '' : 'la-spin'}`}></i></n-fa0>
                      <span>{!klisten ? 'Ready' : doText}</span>
                    </button>;
                        
  return(
    <div className='kioskFrame do_not_use'>
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
            <option value='info'>Info (Scan Tester)</option>
            <option value='serial' disabled={!doSerial}>Initiate Serial</option>
            {/*<option value='checkpoint' disabled={true}>Checkpoint</option>
            <option value='complete' disabled={true}>Complete</option>*/}
          </select>
        </div>
        <div className='auxRight'>
          
        </div>
        <TideFollow tOpen={bScope && bScope === eBatch} />
      </div>
      
      <div className='kioskContent forceScrollStyle darkTheme'>
          
        <div className={`kioskTask ${klisten ? 'nBg' : ''}`}>
          {kactionState === 'info' ?
            KListener
            :
            kactionState === 'serial' ?
              !bScope ?
                <div className='skopegrid forceScrollStyle'>
                  {allTrace.map( (t)=> {
                    return <button 
                      key={t._id}
                      title={t.batch}
                      className='skope'
                      onClick={()=>bScopeSet(t.batch)}>
                      <strong>{t.batch}</strong>
                      <span>{t.isWhat.join(' ')}</span>
                    </button>;
                  })}
                </div>
              :
                KListener
            : <n-fa0><i className="las la-power-off la-fw fillstatic"></i></n-fa0>
          }
        </div>
        
        <KioskScopeData
          kactionState={kactionState}
          klisten={klisten}
          bScope={bScope}
        
        />
      
      </div>
      
    </div>
  );
};

export default KioskWrap;