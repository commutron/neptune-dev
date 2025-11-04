import React, { useState, useEffect } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';
import TideFormLock from '/client/components/tide/TideFormLock';

import NCAdd from '/client/components/riverX/NCAdd';
import NCFlood from '/client/components/riverX/NCFlood';
import ShortAdd from '/client/components/riverX/ShortAdd';
import { min2hr } from '/client/utility/Convert';

const XFormBar = ({ 
  batchData, seriesData, itemData, rapIs, radioactive,
  timeOpen, ncTypesCombo, 
  action, showVerifyState, handleVerify, 
  user, eng, app 
})=> {
  
  const [ show, showSet ] = useState('QT');
  
  useEffect( ()=> { showSet('QT') }, [eng.qtKey]);
  
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
  
  const FirstTg = <FormToggle
          id='firstselect'
          type='checkbox'
          name='toggleFirst'
          title='Redo Step'
          check={showVerifyState === true}
          change={()=>handleVerify(null, true)}
          lock={!verAuth} 
          icon='fa-solid fa-check-double fa-fw'
          color='butBlue'
          spec={true}
        />;
        
  const QuoteTg = <FormToggle
            id='qtStatusSelect'
            type='radio'
            name='formbarselect'
            title='Quoted Time'
            check={show === 'QT'}
            change={()=>showSet( 'QT' )}
            icon='fa-solid fa-hourglass-half fa-fw'
            color='butGreen'
          />;
  
  const NonTg = <FormToggle
            id='ncFormSelect'
            type='radio'
            name='formbarselect'
            title={Pref.nonCon}
            check={show === 'NC'}
            change={()=>showSet( 'NC' )}
            icon='fa-solid fa-times fa-fw'
            color='butRed'
          />;
  
  const ShortTg = <FormToggle
            id='shortFormSelect'
            type='radio'
            name='formbarselect'
            title={Pref.shortfall}
            check={show === 'S'}
            change={()=>showSet( 'S' )}
            icon='fa-solid fa-exclamation fa-fw'
            color='butYellow'
          />;
  
  return(
    <div className='darkTheme proActionForm thinScroll'>
      {!lockOutAll && showItem ?
        <div className='gapminC' style={tgsty}>
          {action === 'xBatchBuild' ? null : FirstTg}
          {QuoteTg}
          {NonTg}
          {ShortTg}
        </div>
      : !lockOutAll && !i && showBatch ?
        <div className='gapminC' style={tgsty}>
          {QuoteTg}
          {NonTg}
        </div>
      : null}
      <div style={{flexGrow: '2'}}>
        <TideFormLock 
          currentLive={timeOpen && b.live} 
          message={true} 
          caution={caution}
          radioactive={radioactive}
          holding={b && b.hold}>
        {lockOutAll ? null 
        :
         b && !srs ?
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
            
        {!lockOutAll && !i && showBatch && show === 'NC' ?
          <NCFlood
            seriesId={srs._id}
            live={b.completed === false}
            user={user}
            app={app}
            ncTypesCombo={ncTypesCombo} />
        : null}
        
        {timeOpen && show === 'QT' ?
          <QtStatus 
            batchData={batchData} 
            app={app}
            eng={eng}
          />
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
  icon, color, spec 
})=> {
  
  const sty = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 150ms ease-in-out',
    margin: '0 1vmin',
    fontSize: '30px',
    width: '40px',
    minHeight: '40px',
  };

  const svgsty = {
    width: '30px',
    minHeight: '30px',
    display: 'flex',
    palceItems: 'center'
  };
  
  return(
    <label htmlFor={id} data-tip={title} style={sty} className={`taskLink liteTip ${spec ? 'sq' : 'tall'} ${color}`}>
      <input
        type={type}
        id={id}
        name={name}
        title={title}
        className='radioIcon'
        checked={check}
        onChange={change}
        disabled={lock}
      /><span key={'icon'+id} style={svgsty}><i className={icon}></i></span>
    </label>
  );
};

const QtStatus = ({ batchData, app, eng })=> {
  
  let qt = app.qtTasks.find( q => q.qtKey === eng.qtKey );
  console.log({qt});
  
  let bq = (batchData?.quoteTimeCycles || []).find( q => q[0] === eng.qtKey );
  let min = bq?.[1] || 0;
  let todo = min2hr(min * (batchData?.quantity || 0));
  
  const sty = {
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // transition: 'all 150ms ease-in-out',
    // margin: '0 1vmin',
    fontSize: 'var(--tx1)',
    minHeight: '40px',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  };
  
  return(
    <div className='actionForm' style={sty}>
      {qt && <span data-tip={qt.subTasks.join(',\n')} className='liteTip'>Qt Group: {qt.qtTask}</span>}
      {qt && <span><n-num>{bq ? bq[1] : 0}</n-num> minutes for one item</span>}
      {qt && <span><n-num>{bq ? todo : 0}</n-num> hours for all items</span>}
    </div>
  );
};