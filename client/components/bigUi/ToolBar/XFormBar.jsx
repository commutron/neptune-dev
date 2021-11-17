import React, { useState } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';
import TideLock from '/client/components/tide/TideLock';

import NCAdd from '/client/components/riverX/NCAdd';
import NCFlood from '/client/components/riverX/NCFlood';
import ShortAdd from '/client/components/riverX/ShortAdd';

const XFormBar = ({ 
  batchData, seriesData, itemData, rapIs, widgetData, radioactive,
  tideFloodGate, ncTypesCombo, 
  action, showVerifyState, handleVerify, 
  user, users, app 
})=> {
  
  const [ show, showSet ] = useState('NC');
  
  function handleDone(e) {
    showSet( 'NC' );
    this.ncselect.checked = true;
    if(user.shFocusReset) {
      document.getElementById('lookup').focus();
    }else{
      document.getElementById('ncRefs').focus();
    }
  }
  
  const b = batchData;
  const srs = seriesData;
  const i = itemData;
    
  const showBatch = b && srs && b.completed === false;

  const showItem = srs && i && (i.completed === false || rapIs);
    
  const pastPN = srs && srs.shortfall ? [...new Set( Array.from(srs.shortfall, x => x.partNum ) )] : [];
  const pastRF = srs && srs.shortfall ? [...new Set( Array.from(srs.shortfall, x => x.refs.toString() ) )] : [];
  
  const verAuth = Roles.userIsInRole(Meteor.userId(), 'verify');
  const lockOutAll = !tideFloodGate || !b.live;
  
  const caution = b && b.releases.findIndex( x => 
                    x.type === 'floorRelease' && x.caution !== false) >= 0;
  
  return(
    <div className='proActionForm forceScrollStyle'>
      {showItem ?
        <div className='footPick'>
          {action === 'xBatchBuild' ? null :
          <label htmlFor='firstselect' className='formBarToggle taskLink butBlue'>
            <input
              type='checkbox'
              id='firstselect'
              name='toggleFirst'
              title='Redo Step'
              className='radioIcon'
              checked={showVerifyState === true}
              onChange={()=>handleVerify(null, true)}
              disabled={!verAuth || lockOutAll} 
            /><i className='fas fa-redo-alt'></i>
          </label> }
          <label htmlFor='ncselect' className='formBarToggle taskLink butRed'>
            <input
              type='radio'
              id='ncselect'
              name='formbarselect'
              title={Pref.nonCon}
              className='radioIcon'
              checked={show === 'NC'}
              onChange={()=>showSet( 'NC' )}
              disabled={lockOutAll}
            /><i className='fas fa-times'></i>
          </label>
          <label htmlFor='shortselect' className='formBarToggle taskLink butYellow'>
            <input
              type='radio'
              id='shortselect'
              name='formbarselect'
              title={Pref.shortfall}
              className='radioIcon'
              checked={show === 'S'}
              onChange={()=>showSet( 'S' )}
              disabled={lockOutAll} 
            /><i className='fas fa-exclamation'></i>
          </label>
        </div>
      : null}
      <div className='footFill'>
        <TideLock 
          currentLive={tideFloodGate && b.live} 
          message={true} 
          caution={caution}
          radioactive={radioactive}
          holding={b.hold}>
        {!srs ?
          <p className='whiteT centreText wide'>
            <em>{Pref.nonCon}, {Pref.shortfall}, and {Pref.trackFirst} require a {Pref.series}</em>
          </p>
        : 
          i && showItem ?
            show === 'NC' ?
              <NCAdd
                seriesId={srs._id}
                serial={i.serial}
                units={i.units}
                user={user}
                app={app}
                ncTypesCombo={ncTypesCombo} />
            : show === 'S' ?
              <ShortAdd
                seriesId={srs._id}
                serial={i.serial}
                units={i.units}
                pastPN={pastPN}
                pastRF={pastRF}
                app={app}
                doneClose={(e)=>handleDone(e)} />
            : null
        : null
        }
            
        {!i && showBatch ?
          <NCFlood
            seriesId={srs._id}
            live={b.completed === false}
            user={user}
            app={app}
            ncTypesCombo={ncTypesCombo} />
        : null}
        </TideLock>
      </div>
    </div>
  );
};

export default XFormBar;