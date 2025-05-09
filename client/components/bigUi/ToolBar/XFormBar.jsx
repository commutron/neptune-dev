import React, { useState } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';
import TideFormLock from '/client/components/tide/TideFormLock';

import NCAdd from '/client/components/riverX/NCAdd';
import NCFlood from '/client/components/riverX/NCFlood';
import ShortAdd from '/client/components/riverX/ShortAdd';

const XFormBar = ({ 
  batchData, seriesData, itemData, rapIs, radioactive,
  timeOpen, ncTypesCombo, 
  action, showVerifyState, handleVerify, 
  user, app 
})=> {
  
  const [ show, showSet ] = useState('NC');
  
  function handleDone() {
    showSet( 'NC' );
    this.ncFormSelect.checked = true;
    if(user.shFocusReset) {
      document.getElementById('lookup').focus();
    }else{
      document.querySelector('#ncRefs')?.focus();
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
  const lockOutAll = !timeOpen || !b.live;
  
  const caution = b && b.releases.findIndex( x => 
                    x.type === 'floorRelease' && x.caution !== false) >= 0;
  
  const tgsty = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  };
  
  return(
    <div className='darkTheme proActionForm thinScroll'>
      {showItem && !lockOutAll ?
        <div style={tgsty}>
          {action === 'xBatchBuild' ? null :
          <FormToggle
            id='firstselect'
            type='checkbox'
            name='toggleFirst'
            title='Redo Step'
            check={showVerifyState === true}
            change={()=>handleVerify(null, true)}
            lock={!verAuth} 
            icon='fa-solid fa-check-double'
            color='butBlue'
          />}
          <FormToggle
            id='ncFormSelect'
            type='radio'
            name='formbarselect'
            title={Pref.nonCon}
            check={show === 'NC'}
            change={()=>showSet( 'NC' )}
            icon='fa-solid fa-times'
            color='butRed'
          />
          <FormToggle
            id='shortFormSelect'
            type='radio'
            name='formbarselect'
            title={Pref.shortfall}
            check={show === 'S'}
            change={()=>showSet( 'S' )}
            icon='fa-solid fa-exclamation'
            color='butYellow'
          />
        </div>
      : null}
      <div style={{flexGrow: '2'}}>
        <TideFormLock 
          currentLive={timeOpen && b.live} 
          message={true} 
          caution={caution}
          radioactive={radioactive}
          holding={b.hold}>
        {b && !srs ?
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
                doneClose={()=>handleDone()} />
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
        </TideFormLock>
      </div>
    </div>
  );
};

export default XFormBar;

const FormToggle = ({ 
  id, type, name, title, 
  check, change, lock, 
  icon, color 
})=> {
  
  const sty = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 150ms ease-in-out',
    margin: '0 1vmin',
    fontSize: '30px',
    width: '45px',
    minHeight: '45px'
  };

  const svgsty = {
    width: '30px',
    minHeight: '30px'
  };
  
  return(
    <label htmlFor={id} data-tip={title} style={sty} className={'taskLink liteTip tall ' + color}>
      <input
        type={type}
        id={id}
        name={name}
        title={title}
        className='radioIcon'
        checked={check}
        onChange={change}
        disabled={lock}
      /><i className={icon} style={svgsty}></i>
    </label>
  );
};