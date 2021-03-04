import React, { useState, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';
//import Pref from '/client/global/pref.js';

import HomeIcon from './HomeIcon.jsx';
import FindBox from './FindBox.jsx';

import TideControl from '/client/components/tide/TideControl/TideControl.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import FormBar from '/client/components/bigUi/ToolBar/FormBar.jsx';
import XFormBar from '/client/components/bigUi/ToolBar/XFormBar.jsx';
import NonConOptionMerge from '/client/utility/NonConOptionMerge.js';

export const ProWrap = ({ 
  itemSerial, itemData, batchData, seriesData,
  widgetData, groupAlias, 
  user, users, app,
  action, tideLockOut, standAlone,
  children
})=> {
  
  const [ expand, expandSet ] = useState(false);
  const [ showVerifyState, showVerifySet ] = useState(false);
  const [ optionVerify, optionVerifySet ] = useState(false);
  
  const [ rapIs, rapIsSet ] = useState(false);
  
  const [ ncTypesComboFlat, ncTypesComboSet ] = useState([]);
  
  useLayoutEffect( ()=> {
    !Session.get('riverExpand') ? null : expandSet( true );
    
    if(itemData && itemData.altPath) {
      rapIsSet( itemData.altPath.find( x => x.rapId && !x.completed ) );
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
      getNCTypesCombo = NonConOptionMerge(getNCListKeys, app, user, allKeys);
      
    }else if( batchData && widgetData ) {
      const river = widgetData.flows.find( x => x.flowKey === batchData.river );
      const rvAlt = widgetData.flows.find( x => x.flowKey === batchData.riverAlt );
      if(river) {
        river.type === 'plus' && getNCListKeys.push(river.ncLists);
      }
      if(rvAlt) {
        rvAlt.type === 'plus' && getNCListKeys.push(rvAlt.ncLists);
      }
      getNCTypesCombo = NonConOptionMerge(getNCListKeys, app, user);
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
    
  let scrollFix = {
    overflowY: 'hidden'
  };
  
  const gAlias = groupAlias;
  const bData = batchData;
  const iS = itemSerial;
  const append = bData && iS ? bData.batch : null;
  
  const et = !user || !user.engaged ? false : user.engaged.tKey;
  const tide = !bData || !bData.tide ? [] : bData.tide;
  const tideFloodGate = tide.find( 
    x => x.tKey === et && x.who === Meteor.userId() 
  );
    
  const exploreLink = iS && bData ?
                      '/data/batch?request=' + bData.batch + '&specify=' + iS :
                      bData ?
                      '/data/batch?request=' + bData.batch :
                      gAlias ?
                      '/data/overview?request=groups&specify=' + gAlias :
                      '/data/overview?request=batches';
  
  let riverExpand = expand;
  
  const viewContainer = standAlone ? 'pro_100' :
                        !riverExpand ? 'pro_20_80' : 
                                         'pro_40_60';
                        
  return(
    <div className={viewContainer + ' containerPro'}>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        {bData && 
          <div className='auxLeft'>
            <TideControl 
              batchID={bData._id} 
              tideKey={et} 
              tideFloodGate={tideFloodGate}
              tideLockOut={tideLockOut}
              stopOnly={true} />
          </div>}
        <div className='frontCenterTitle'>
          <FindBox append={append} />
        </div>
        <div className='auxRight'>
          <button
            id='exBatch'
            title='View this in explore'
            className='taskLink'
            onClick={()=>FlowRouter.go(exploreLink)}>
            <i className='fas fa-rocket' data-fa-transform='left-1 down-1'></i>
          </button>
        </div>
        <TideFollow proRoute={bData && bData.batch} user={user} />
      </div>
      
      <Fragment>
        
        <div className='proPrime forceScrollStyle darkTheme'>
          {React.cloneElement(children[0],
            { 
              tideKey: et,
              ncTypesCombo: ncTypesComboFlat,
              
              tideFloodGate: tideFloodGate,
              expand: expand, 
              handleExpand: (d)=>handleExpand(d),
              
              showVerifyState: showVerifyState,
              optionVerify: optionVerify,
              handleVerify: (q, d)=>handleVerify(q, d)
            }
          )}
        </div>
        
        <button
          type='button'
          className={!riverExpand ? 
            'riverExpandToggle' : 'riverShrinkToggle'
          }
          onClick={()=>handleExpand(null)}>
          <i className='fas fa-sort fa-2x' data-fa-transform='rotate-90'></i>
        </button>
        
        <div className='proInstruct' style={scrollFix}>
          {children[1]}
        </div>
      
        {seriesData ?
          <XFormBar
            batchData={batchData}
            seriesData={seriesData}
            itemData={itemData}
            rapIs={rapIs}
            widgetData={widgetData}
            
            tideFloodGate={tideFloodGate}
            ncTypesCombo={ncTypesComboFlat}
            action={action}
            showVerifyState={showVerifyState}
            handleVerify={(q, d)=>handleVerify(q, d)}
          
            users={users}
            user={user}
            app={app} />
        :
          <FormBar
            batchData={batchData}
            itemData={itemData}
            widgetData={widgetData}
            
            tideFloodGate={tideFloodGate}
            ncTypesCombo={ncTypesComboFlat}
            action={action}
            showVerifyState={showVerifyState}
            handleVerify={(q, d)=>handleVerify(q, d)}
          
            users={users}
            user={user}
            app={app} />
        }
      </Fragment>

    </div>
  );
};


export const ProWindow = ({ children })=> {
  
  // let scrollFix = {
  //   overflowY: 'auto'
  // };
  
  return(
    <section className='windowPro'>
      <ToastContainer
        position="top-right"
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