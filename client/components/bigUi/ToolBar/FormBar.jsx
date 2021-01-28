import React, { useState } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';
import TideLock from '/client/components/tide/TideLock.jsx';

import NCAdd from '/client/components/river/NCAdd.jsx';
import NCFlood from '/client/components/river/NCFlood.jsx';
import ShortAdd from '/client/components/river/ShortAdd.jsx';

const FormBar = ({ 
  batchData, itemData, widgetData,
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
  const i = itemData;
    
  const showX = action === 'xBatchBuild';
  const showlegacyBatch = b && b.finishedAt === false;
  const showlegacyItem = i && ( i.finishedAt === false || i.rma.length > 0);
    
  const pastPN = b && b.shortfall ? [...new Set( Array.from(b.shortfall, x => x.partNum ) )] : [];
  const pastRF = b && b.shortfall ? [...new Set( Array.from(b.shortfall, x => x.refs.toString() ) )] : [];
  
  const verAuth = Roles.userIsInRole(Meteor.userId(), 'verify');
  const lockOutAll = !tideFloodGate;
  
  return(
    <div className='proActionForm'>
      {showlegacyItem ?
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
        <TideLock currentLive={tideFloodGate} classSty='' message={true}>
        {b && i && showlegacyItem ?
              show === 'NC' ?
                <NCAdd 
                  id={b._id}
                  barcode={i.serial}
                  user={user}
                  app={app}
                  ncTypesCombo={ncTypesCombo} />
              : show === 'S' ?
                <ShortAdd
                  id={b._id}
                  serial={i.serial}
                  pastPN={pastPN}
                  pastRF={pastRF}
                  app={app}
                  doneClose={(e)=>handleDone(e)} />
              : null
            : null
        }
            
        {
          b && !i && !showX && showlegacyBatch ?
            <NCFlood
              id={b._id}
              live={b.finishedAt === false}
              user={user}
              app={app}
              ncTypesCombo={ncTypesCombo} />
        : null}
        </TideLock>
      </div>
    </div>
  );
};

export default FormBar;