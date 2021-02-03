import React, { useState } from 'react';
import './style.css';
// import Pref from '/client/global/pref.js';
import TideLock from '/client/components/tide/TideLock.jsx';

import NCAdd from '/client/components/riverX/NCAdd.jsx';
import NCFlood from '/client/components/riverX/NCFlood.jsx';
import ShortAdd from '/client/components/riverX/ShortAdd.jsx';

const XFormBar = ({ 
  batchData, seriesData, itemData, widgetData,
  tideFloodGate, ncTypesCombo, 
  action, showVerifyState, handleVerify, 
  user, users, app 
})=> {
  
  const [ show, showSet ] = useState('NC');
  
  function handleDone(e) {
    showSet( 'NC' );
    this.ncselect.checked = true;
  }
  
  const b = batchData;
  const srs = seriesData;
  const i = itemData;
    
  const showBatch = b && srs && b.completed === false;

  const showItem = srs && i && i.completed === false; // RMA !!!!!!
    
  const pastPN = srs && srs.shortfall ? [...new Set( Array.from(srs.shortfall, x => x.partNum ) )] : [];
  const pastRF = srs && srs.shortfall ? [...new Set( Array.from(srs.shortfall, x => x.refs.toString() ) )] : [];
  
  const verAuth = Roles.userIsInRole(Meteor.userId(), 'verify');
  const lockOutAll = !tideFloodGate || !b.live;
  
  return(
    <div className='proActionForm'>
      {showItem ?
        <div className='footPick'>
          {action === 'xBatchBuild' ? null :
          <label htmlFor='firstselect' className='formBarToggle taskLink butBlue'>
            <input
              type='checkbox'
              id='firstselect'
              name='toggleFirst'
              className='radioIcon'
              checked={showVerifyState === true}
              onChange={()=>handleVerify(null, true)}
              disabled={!verAuth || lockOutAll} />
            <i className='fas fa-thumbs-up' data-fa-transform='up-1'></i>
          </label> }
          <label htmlFor='ncselect' className='formBarToggle taskLink butRed'>
            <input
              type='radio'
              id='ncselect'
              name='formbarselect'
              className='radioIcon'
              checked={show === 'NC'}
              onChange={()=>showSet( 'NC' )}
              disabled={lockOutAll} />
            <i className='fas fa-times-circle'></i>
          </label>
          <label htmlFor='shortselect' className='formBarToggle taskLink butYellow'>
            <input
              type='radio'
              id='shortselect'
              name='formbarselect'
              className='radioIcon'
              checked={show === 'S'}
              onChange={()=>showSet( 'S' )}
              disabled={lockOutAll} />
            <i className='fas fa-exclamation-circle'></i>
          </label>
        </div>
      : null}
      <div className='footFill'>
        <TideLock currentLive={tideFloodGate && b.live} message={true}>
        {i && showItem ?
          show === 'NC' ?
            <NCAdd
              seriesId={srs._id}
              barcode={i.serial}
              user={user}
              app={app}
              ncTypesCombo={ncTypesCombo} />
          : show === 'S' ?
            <ShortAdd
              seriesId={srs._id}
              serial={i.serial}
              pastPN={pastPN}
              pastRF={pastRF}
              app={app}
              doneClose={(e)=>handleDone(e)} />
          : null
        : null
        }
            
        {!i && showBatch ?  /// HOW to Flood without dumb mistakes
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