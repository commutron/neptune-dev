import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';

import { ScanListenerUtility, ScanListenerOff } from '/client/utility/ScanListener.js';

import HomeIcon from './HomeIcon';
import FindBox from './FindBox';

import TideControl from '/client/components/tide/TideControl/TideControl';
import TideFollow from '/client/components/tide/TideFollow';
import { NonConMerge } from '/client/utility/NonConOptions';

// import EquipMenu from '/client/views/production/lists/EquipMenu';
import TimeStop from '/client/components/tide/TimeStop';



const TerminalWrap = ({ 
  itemSerial, itemData, batchData, seriesData, rapidsData,
  widgetData, radioactive, groupAlias, 
  user, time, users, app, 
  brancheS, plainBatchS, canMulti,
  eqAlias, equipId, maintId,
  action, tideLockOut, standAlone, defaultWide,
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
  const etPro = eng?.task === 'PROX';
  const etMlt = eng?.task === 'MLTI';
  // 'MAINT', 'EQFX';
  const etKey = eng?.tKey;
  const timeOpen = etPro ? 
                    (bData?.tide || []).find( x => x.tKey === etKey && x.who === Meteor.userId() ) 
                   : etMlt ?
                    (bData?.tide || []).find( x => ( x.tKey === etKey[0] || x.tKey === etKey[1] ) && x.who === Meteor.userId() ) 
                   : time?._id === etKey &&
                    (time?.link === maintId || time?.link === equipId) ? 
                    time : null;

  const exploreLink = itemSerial && bData ?
                      '/data/batch?request=' + bData.batch + '&specify=' + itemSerial :
                      bData ?
                      '/data/batch?request=' + bData.batch :
                      groupAlias ?
                      '/data/overview?request=groups&specify=' + groupAlias :
                      eqAlias ?
                      '/equipment/' + eqAlias :
                      '/data/overview?request=groups';

  const viewContainer = standAlone ? 'pro_100' :
                        !expand ? 'pro_20_80' : 
                                    'pro_40_60';
                        
  return(
    <div className={viewContainer + ' containerPro do_not_use'}>
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        {bData || etKey ? 
          <div className='proLeft'>
            <TimeStop
              tIdKey={etKey}
              timeOpen={timeOpen}
              etPro={etPro}
              etMlt={etMlt}
              tideLockOut={tideLockOut}
            />
          </div>
        : null}
        {itemSerial && isFirst ?
          <div className='auxLeft firstBadge' data-steps={isFirst}>
            <span className='fa-stack'>
              <i className="fas fa-certificate fa-stack-2x fa-fw blueT" data-fa-transform="right-1"></i>
              <i className="fas fa-check-double fa-stack-1x fa-fw" data-fa-transform="right-12"></i>
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
            <i className='fas fa-rocket' data-fa-transform='left-1'></i>
          </button>
        </div>
        <TideFollow tOpen={timeOpen} canMulti={canMulti} />
      </div>
      
      <Fragment>
        
        <div className='proPrime forceScrollStyle darkTheme'>
          {React.cloneElement(children,
            { 
              tideKey: etKey,
              engagedPro: etPro,
              engagedMlti: etMlt,
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
      
        
      </Fragment>
      
      {canMulti ?
        <TideMulti
          user={user}
          brancheS={brancheS}
          plainBatchS={plainBatchS}
        />
      : null}
    </div>
  );
};

export default TerminalWrap;