import React, { useState, useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import ErrorCatch from '/client/components/utilities/ErrorCatch.jsx';
import { ToastContainer } from 'react-toastify';
//import Pref from '/client/global/pref.js';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideControl from '/client/components/tide/TideControl/TideControl.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import FindBox from './FindBox.jsx';
import FormBar from '/client/components/bigUi/FormBar.jsx';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';

export const ProWrap = ({ 
  itemSerial, itemData, batchData, widgetData, versionData, groupAlias, 
  user, users, app,
  action, tideLockOut, standAlone,
  children
})=> {
  
  const [ expand, expandSet ] = useState(false);
  const [ showVerify, showVerifySet ] = useState(false);
  const [ optionVerify, optionVerifySet ] = useState(false);
  
  const [ flow, flowSet ] = useState([]);
  const [ flowAlt, flowAltSet ] = useState([]);
  const [ ncListKeys, ncListKeysSet ] = useState([]);
  const [ progCounts, progCountsSet ] = useState(false);


  useLayoutEffect( ()=> {
    !Session.get('riverExpand') ? null : expandSet( true );
    
    const b = batchData;
    const w = widgetData;
    let getFlow = [];
    let getFlowAlt = [];
    let getNCListKeys = [];
    let getProgCounts = false;
    if( b && w ) {
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
      if(river) {
        getFlow = river.flow;
        river.type === 'plus' && getNCListKeys.push(river.ncLists);
      }
      if(riverAlt) {
        getFlowAlt = riverAlt.flow;
        riverAlt.type === 'plus' && getNCListKeys.push(riverAlt.ncLists);
      }
      if(action !== 'xBatchBuild') {
        getProgCounts = ProgressCounter(getFlow, getFlowAlt, b);
      }
    }
    flowSet(getFlow);
    flowAltSet(getFlowAlt);
    ncListKeysSet(getNCListKeys);
    progCountsSet(getProgCounts);
    
  }, [batchData, widgetData]);
  
  
  function handleVerify(value) {
    showVerifySet( !showVerify ); 
    optionVerifySet( value );
  }
  
  function handleExpand() {
    const openState = expand;
    expandSet( !openState );
    Session.set( 'riverExpand', !openState );
  }
    
  let scrollFix = {
    overflowY: 'auto'
  };
  
  const u = user;
  const gAlias = groupAlias;
  const bData = batchData;
  const iS = itemSerial;
  const append = bData && iS ? bData.batch : null;
  
  const et = !u || !u.engaged ? false : u.engaged.tKey;
  const tide = !bData || !bData.tide ? [] : bData.tide;
  const currentLive = tide.find( 
    x => x.tKey === et && x.who === Meteor.userId() 
  );
    
  const exploreLink = iS && bData ?
                      '/data/batch?request=' + bData.batch + '&specify=' + iS :
                      bData ?
                      '/data/batch?request=' + bData.batch :
                      gAlias ?
                      '/data/overview?request=groups&specify=' + gAlias :
                      '/data/overview?request=batches';

  const cSize = children.length;
  
  let riverExpand = expand;
    
  return(
    <ErrorCatch>
      <div className='containerPro'>
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
                currentLive={currentLive}
                tideLockOut={tideLockOut} />
            </div>}
          <div className='frontCenterTitle'>
            <FindBox append={append} />
          </div>
          <div className='auxRight'>
            <button
              id='exBatch'
              title='View this in explore'
              onClick={()=>FlowRouter.go(exploreLink)}>
              <i className='fas fa-rocket primeRightIcon' data-fa-transform='left-1'></i>
            </button>
          </div>
          <TideFollow proRoute={true} />
        </div>
        
        {standAlone ?
          <div className='proFull'>
            {children}
          </div>
        :
        <section className={!riverExpand ? 'proNarrow' : 'proWide'}>
          
          <div 
            className={
              !riverExpand ? 'proSingle forceScrollStyle' : 
              cSize > 2 ? 'proDual forceScrollStyle' : 
              'proSingle forceScrollStyle'
            }
          >
            <div className='proPrime'>
              {React.cloneElement(children[0],
                { 
                  currentLive: currentLive,
                  flow: flow,
                  flowAlt: flowAlt,
                  progCounts: progCounts,
                  showVerify: showVerify,
                  optionVerify: optionVerify,
                  changeVerify: (q)=>handleVerify(q)
                }
              )}
            </div>
            
            {cSize > 2 && riverExpand ?
              <div className='proExpand'>
                {React.cloneElement(children[1],
                  { 
                    currentLive: currentLive,
                    flow: flow,
                    flowAlt: flowAlt,
                    progCounts: progCounts
                  }
                )}
              </div>
            :null}
          </div>
          
        
          <button
            type='button'
            className={!riverExpand ? 'riverExpandToggle' : 'riverShrinkToggle'}
            onClick={()=>handleExpand()}>
            <i className='fas fa-sort fa-2x' data-fa-transform='rotate-90'></i>
          </button>
            
          <div className='proInstruct' style={scrollFix}>
            {children[cSize - 1]}
          </div>
  
          <FormBar
            batchData={batchData}
            currentLive={currentLive}
            itemData={itemData}
            widgetData={widgetData}
            versionData={versionData}
            users={users}
            user={user}
            app={app}
            ncListKeys={ncListKeys}
            action={action}
            showVerify={showVerify}
            changeVerify={(q)=>handleVerify(q)} />
          
        </section>
        }
      </div>
    </ErrorCatch>
  );
};