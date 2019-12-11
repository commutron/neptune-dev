import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import TideLock from '/client/components/tide/TideLock.jsx';

import NCAdd from '../river/NCAdd.jsx';
import NCFlood from '../river/NCFlood.jsx';
import ShortAdd from '../river/ShortAdd.jsx';

const FormBar = ({ 
  batchData, itemData, widgetData, versionData, 
  currentLive, ncListKeys, 
  action, showVerify, changeVerify, 
  user, users, app 
})=> {
  
  const [ show, showSet ] = useState('NC');
  
  function handleDone(e) {
    showSet( 'NC' );
    this.ncselect.checked = true;
  }
  
  const b = batchData;
  const i = itemData;
    
  const showX = b && action === 'xBatchBuild' && b.completed === false;
  const showlegacyItem = (b && i) && !(b.finishedAt !== false || i.finishedAt !== false );
    
  const pastPN = b && b.shortfall ? [...new Set( Array.from(b.shortfall, x => x.partNum ) )] : [];
  const pastRF = b && b.shortfall ? [...new Set( Array.from(b.shortfall, x => x.refs.toString() ) )] : [];
    
  const ncListKeysFlat = ncListKeys.flat();
    
  return(
    <TideLock currentLive={currentLive} message={true}>
    <div className='proActionForm'>
      {showX || showlegacyItem ?
        <div className='footLeft'>
        {action === 'xBatchBuild' ? null :
          <label htmlFor='firstselect' className='formBarToggle'>
            <input
              type='checkbox'
              id='firstselect'
              name='toggleFirst'
              className='radioIcon'
              checked={showVerify}
              onChange={()=>changeVerify(true)}
              disabled={!Roles.userIsInRole(Meteor.userId(), 'verify')} />
            <i className='fas fa-thumbs-up formBarIcon'></i>
            <span className='actionIconText'>First</span>
          </label> }
          <label htmlFor='ncselect' className='formBarToggle'>
            <input
              type='radio'
              id='ncselect'
              name='formbarselect'
              className='radioIcon'
              checked={show === 'NC'}
              onChange={()=>showSet( 'NC' )} />
            <i className='fas fa-bug formBarIcon'></i>
            <span className='actionIconText'>{Pref.nonCon}</span>
          </label>
          <label htmlFor='shortselect' className='formBarToggle'>
            <input
              type='radio'
              id='shortselect'
              name='formbarselect'
              className='radioIcon'
              checked={show === 'S'}
              onChange={()=>showSet( 'S' )} />
            <i className='fas fa-exclamation-circle formBarIcon' data-fa-transform="down-1"></i>
            <span className='actionIconText'>Shortfall</span>
          </label>
        </div>
      : null}
      <div className='footCent'>
        {b ?
          action === 'xBatchBuild' ?
            show === 'NC' ?
              //<NCAdd 
                //id={b._id}
                //barcode={i.serial}
                //app={app} />
              <p className='centreText'>Batch NC form <em>in development</em></p>
            : show === 'S' ?
              //<ShortAdd
                //id={b._id}
                //serial={i.serial}
                //app={app}
                //doneClose={()=>this.handleDone()} />
                <p className='centreText'>Batch Omit form <em>in development</em></p>
            : null
          :
            b && i ?
              show === 'NC' ?
                <NCAdd 
                  id={b._id}
                  barcode={i.serial}
                  user={user}
                  app={app}
                  ncListKeys={ncListKeysFlat} />
              : show === 'S' ?
                <ShortAdd
                  id={b._id}
                  serial={i.serial}
                  pastPN={pastPN}
                  pastRF={pastRF}
                  app={app}
                  doneClose={(e)=>handleDone(e)} />
              : null
            : 
              <NCFlood
                id={b._id}
                live={b.finishedAt === false}
                user={user}
                app={app}
                ncListKeys={ncListKeysFlat} />
        : null}
      </div>
      <div className='footRight'></div>
    </div>
    </TideLock>
  );
};

export default FormBar;