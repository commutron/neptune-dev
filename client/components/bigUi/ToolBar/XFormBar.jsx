import React, { useState, useEffect, Fragment } from 'react';
import './style.css';
import Pref from '/public/pref.js';
import TideFormLock from '/client/components/tide/TideFormLock';

import NCAdd from '/client/components/riverX/NCAdd';
import NCFlood from '/client/components/riverX/NCFlood';
import ShortAdd from '/client/components/riverX/ShortAdd';

import { addTideArrayDuration } from '/client/utility/WorkTimeCalc.js';
import { CountDownNum, TimeString } from '/client/components/smallUi/ClockString';

const XFormBar = ({ 
  batchData, seriesData, itemData, rapIs, radioactive,
  timeOpen, ncTypesCombo, 
  action, showVerifyState, handleVerify, 
  user, eng, app, users
})=> {
  
  const [ show, showSet ] = useState('QT');
  
  useEffect( ()=> { showSet('QT') }, [eng.qtKey]);
  
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
    height: '100%',
    gridGap: '0 2px'
  };
  
  const FirstTg = <FormToggle
          id='firstselect'
          type='checkbox'
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
            title='Quoted Time'
            check={show === 'QT'}
            change={()=>showSet( 'QT' )}
            icon='fa-solid fa-hourglass-half fa-fw'
            color='butGreen'
          />;
  
  const NonTg = <FormToggle
            id='ncFormSelect'
            type='radio'
            title={Pref.nonCon}
            check={show === 'NC'}
            change={()=>showSet( 'NC' )}
            icon='fa-solid fa-times fa-fw'
            color='butRed'
          />;
  
  const ShortTg = <FormToggle
            id='shortFormSelect'
            type='radio'
            title={Pref.shortfall}
            check={show === 'S'}
            change={()=>showSet( 'S' )}
            icon='fa-solid fa-exclamation fa-fw'
            color='butYellow'
          />;
  
  return(
    <div className='darkTheme proActionForm thinScroll'>
      {!lockOutAll && showItem ?
        <div style={tgsty}>
          {action === 'xBatchBuild' ? null : FirstTg}
          {QuoteTg}
          {NonTg}
          {ShortTg}
        </div>
      : !lockOutAll && !i && showBatch ?
        <div style={tgsty}>
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
                ncTypesCombo={ncTypesCombo} 
              />
            : show === 'S' ?
              <ShortAdd
                seriesId={srs._id}
                serial={i.serial}
                units={i.units}
                pastPN={pastPN}
                pastRF={pastRF}
                user={user}
              />
            : null
        : null
        }
            
        {!lockOutAll && !i && showBatch && show === 'NC' ?
          <NCFlood
            seriesId={srs._id}
            live={b.completed === false}
            user={user}
            app={app}
            ncTypesCombo={ncTypesCombo}
          />
        : null}
        
        {timeOpen && show === 'QT' ?
          <QtStatus 
            batchData={batchData} 
            app={app}
            users={users}
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
  id, type, title, 
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
        name={type === 'radio' ? 'formbarselect' : 'toggleFirst'}
        title={title}
        className='radioIcon'
        checked={check}
        onChange={change}
        disabled={lock}
      /><span key={'icon'+id} style={svgsty}><i className={icon}></i></span>
    </label>
  );
};

const QtStatus = ({ batchData, app, users, eng })=> {
  
  let qt = app.qtTasks.find( q => q.qtKey === eng.qtKey );
  let pr = users.filter( u=> u.engaged && u.engaged.qtKey === eng.qtKey && u.engaged.tName === eng.tName ).length;
  
  let bq = (batchData?.quoteTimeCycles || []).find( q => q[0] === eng.qtKey );
  let min = bq?.[1] || 0;
  let max = qt.fixed ? min : ( min * (batchData?.quantity || 0) );
  
  const bTideThis = batchData.tide.filter( t => t.qtKey === eng.qtKey );
  const tCount = addTideArrayDuration(bTideThis); // rtn in seconds
  const remain = (max * 60) - tCount;
  
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
      {qt && <span className='liteTip line1x noCopy centreText' data-tip={qt.subTasks.join(',\n')}>Qt: {qt.qtTask}</span>}
      
      {qt ?
        <Fragment>
          <span className='line1x noCopy centreRow gapminC'
            >{TimeString(bq ? bq[1] : 0, 'minutes', 'h:mm')} {`${qt.fixed ? 'per ' + Pref.XBatch : 'per item'}`}</span>

          <span className={`line1x noCopy centreRow gapminC ${remain < 0 ? 'redT' : ''}`}
          >{bq ? <CountDownNum dur={remain} peers={pr} /> : <n-num>0:00:00</n-num>} remaining</span>
          
        </Fragment>
      : null}
    </div>
  );
};