import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';

import { ScanListenerUtility, ScanListenerOff } from '/client/utility/ScanListener.js';

import HomeIcon from './HomeIcon';
import FindBox from './FindBox';

import TimeStop from '/client/components/tide/TimeStop';
import TideFollow from '/client/components/tide/TideFollow';
import XFormBar from '/client/components/bigUi/ToolBar/XFormBar';
import { NonConMerge } from '/client/utility/NonConOptions';

export const ProWrap = ({ 
  itemSerial, itemData, batchData, seriesData, rapidsData,
  widgetData, radioactive, groupAlias, 
  user, time, users, app, defaultWide, 
  eqAlias, maintId,
  action, tideLockOut, standAlone,
  children
})=> {
  
  const [ expand, expandSet ] = useState( defaultWide || false);
  
  const [ isFirst, isFirstSet ] = useState(false);
  const [ showVerifyState, showVerifySet ] = useState(false);
  const [ optionVerify, optionVerifySet ] = useState(false);
  
  const [ rapIs, rapIsSet ] = useState(false);
  
  const [ ncTypesComboFlat, ncTypesComboSet ] = useState([]);
  
  useEffect( ()=> {
    if(Meteor.user()) {
      ScanListenerUtility(Meteor.user());
    }
    return ()=> ScanListenerOff();
  }, []);
  
  useEffect( ()=> {
    if(itemData) {
      const frstyp = Array.from(itemData.history, x =>
                      x.type === 'first' && x.good ? x.step : null)
                        .filter(f=>f).join('\n');
      if(frstyp) {
        isFirstSet(frstyp);
      }else{
        isFirstSet(false);
      }
    }
  }, [(itemData && itemData.history)]);
  
  useLayoutEffect( ()=> {
    !Session.get('riverExpand') ? null : expandSet( true );
    
    if(itemData && itemData.altPath) {
      const ropen = itemData.altPath.find( x => {
                      let real = rapidsData.find( r => r._id === x.rapId );
                      return x.rapId && !x.completed && real && real.live });
      rapIsSet( ropen );
    }
  }, [(itemData && itemData.altPath)]);
  
  useLayoutEffect( ()=> {
    
    let getNCListKeys = [];
    let getNCTypesCombo = [];
    
    if( batchData && widgetData && seriesData ) {
      const riverKey = !itemData ? batchData.river :
                        itemData.altPath.find( x => x.river !== false ) ?
                        itemData.altPath.find( x => x.river !== false ).river :
                        batchData.river;
                        
      const river = widgetData.flows.find( x => x.flowKey === riverKey );
      if(river) {
        river.type === 'plus' && getNCListKeys.push(river.ncLists);
      }
      const allKeys = rapIs ? true : false;
      getNCTypesCombo = NonConMerge(getNCListKeys, app, user, allKeys);
      
    }
    ncTypesComboSet(getNCTypesCombo);
    
  }, [batchData, widgetData, app]);
  
  
  function handleVerify(value, direct) {
    showVerifySet( !showVerifyState ); 
    optionVerifySet( value );
    handleExpand(direct);
  }
  
  function handleExpand(direct) {
    const openState = direct !== null ? direct : !expand;
    expandSet( openState );
    Session.set( 'riverExpand', openState );
  }
  
  const bData = batchData;
  const append = bData && itemSerial ? bData.batch : null;
  
  const eng = user?.engaged || false;
  const etKey = eng?.tKey;
  const etPro = eng?.task === 'PROX';
  const timeOpen = etPro ? 
                    (bData?.tide || []).find( x => 
                      x.tKey === etKey && x.who === Meteor.userId() )
                   : time?._id === etKey && time?.link === maintId ? time : null;
    
  const exploreLink = itemSerial && bData ?
                      '/data/batch?request=' + bData.batch + '&specify=' + itemSerial :
                      bData ?
                      '/data/batch?request=' + bData.batch :
                      groupAlias ?
                      '/data/overview?request=groups&specify=' + groupAlias :
                      eqAlias ?
                      '/data/overview?request=maintain&specify=' + eqAlias :
                      '/data/overview?request=groups';

  const viewContainer = standAlone ? 'pro_100' :
                        !expand ? 'pro_20_80' : 
                                    'pro_40_60';
                        
  return(
    <div className={viewContainer + ' containerPro'}>
      <ToastContainer
        position="top-center"
        theme='colored'
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        {bData || etKey ? 
          <div className='proLeft'>
            <TimeStop
              tIdKey={etKey}
              timeOpen={timeOpen}
              etPro={etPro}
              tideLockOut={tideLockOut}
            />
          </div>
        : null}
        {itemSerial && isFirst ?
          <div className='auxLeft firstBadge' data-steps={isFirst}>
            <span className='fa-stack'>
              <i className="fas fa-certificate fa-stack-2x fa-fw blueT"></i>
              <i className="fas fa-check-double fa-stack-1x fa-fw" ></i>
            </span>
          </div>
        : null}
        <div className='frontCenterTitle'>
          <FindBox append={append} />
        </div>
        <div className='auxRight'>
          <button
            id='exBatch'
            aria-label='Explore'
            className='taskLink auxTip'
            onClick={()=>FlowRouter.go(exploreLink)}>
            <i className='fas fa-rocket' data-fa-transform='left-1 down-1'></i>
          </button>
        </div>
        <TideFollow proRoute={bData && bData.batch} />
      </div>
      
      <Fragment>
        
        <div className='proPrime forceScrollStyle darkTheme'>
          {React.cloneElement(children[0],
            { 
              tideKey: etKey,
              etPro: etPro,
              timeOpen: timeOpen,
              
              expand: expand, 
              handleExpand: (d)=>handleExpand(d),
              
              ncTypesCombo: ncTypesComboFlat,
              
              showVerifyState: showVerifyState,
              optionVerify: optionVerify,
              handleVerify: (q, d)=>handleVerify(q, d)
            }
          )}
        </div>
        
        <button
          type='button'
          className={!expand ? 'riverExpandToggle' : 'riverShrinkToggle'}
          onClick={()=>handleExpand(null)}>
          <i className='fas fa-sort fa-2x' data-fa-transform='rotate-90'></i>
        </button>
        
        <div className='proInstruct' style={{overflowY:'hidden'}}>
          {children[1]}
        </div>
      
        <XFormBar
          batchData={batchData}
          seriesData={seriesData}
          itemData={itemData}
          rapIs={rapIs}
          widgetData={widgetData}
          radioactive={radioactive}
          
          timeOpen={timeOpen}
          ncTypesCombo={ncTypesComboFlat}
          action={action}
          showVerifyState={showVerifyState}
          handleVerify={(q, d)=>handleVerify(q, d)}
        
          users={users}
          user={user}
          app={app} 
        />

      </Fragment>

    </div>
  );
};


export const ProWindow = ({ children })=> {
  
  useEffect( ()=> {
    if(Meteor.user()) {
      ScanListenerUtility(Meteor.user());
    }
    return ()=> ScanListenerOff();
  }, []);
  
  return(
    <section className='windowPro'>
      <ToastContainer
        position="top-right"
        theme='colored'
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='auxLeft'></div>
        <div className='frontCenterTitle'>
          <FindBox />
        </div>
        <div className='auxRight'></div>
        <TideFollow proRoute={true} />
      </div>
      <div className='proContent darkTheme'>
        <Fragment>
          {children}
        </Fragment>
      </div>
    </section>
  );
};