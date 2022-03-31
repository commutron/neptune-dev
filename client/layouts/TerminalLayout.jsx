import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';

import { ScanListenerUtility, ScanListenerOff } from '/client/utility/ScanListener.js';

import HomeIcon from './HomeIcon';
import FindBox from './FindBox';

import TideControl from '/client/components/tide/TideControl/TideControl';
import TideFollow from '/client/components/tide/TideFollow';
import { NonConMerge } from '/client/utility/NonConOptions';

const TerminalWrap = ({ 
  itemSerial, itemData, batchData, seriesData, rapidsData,
  widgetData, radioactive, groupAlias, 
  user, users, app,
  action, tideLockOut, standAlone,
  children
})=> {
  
  const [ isFirst, isFirstSet ] = useState(false);
  
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
                      '/data/overview?request=groups';
  
  return(
    <div className='pro_100 containerPro'>
      <ToastContainer
        position="top-center"
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        {bData && 
          <div className='proLeft'>
            <TideControl 
              batchID={bData._id} 
              tideKey={et} 
              tideFloodGate={tideFloodGate}
              tideLockOut={tideLockOut}
              stopOnly={true} />
          </div>}
        {iS && isFirst ?
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
        <TideFollow proRoute={bData && bData.batch} user={user} />
      </div>
    
        <div className='proPrime forceScrollStyle darkTheme'>
          {React.cloneElement(children,
            { 
              tideKey: et,
              ncTypesCombo: ncTypesComboFlat,
              
              tideFloodGate: tideFloodGate
            }
          )}
        </div>

    </div>
  );
};

export default TerminalWrap;