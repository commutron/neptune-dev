import React, { useState, useEffect, useLayoutEffect } from 'react';
//import Pref from '/client/global/pref.js';

import ItemCard from './ItemCard.jsx';
import BatchCard from './BatchCard.jsx';

import ProgressCounter from '/client/components/utilities/ProgressCounter.js';

const DoProCard = ({ 
  itemData, batchData, widgetData, versionData, groupData,
  user, users, app, 
  
  ncTypesCombo, tideLockOut,
  
  tideFloodGate,
  expand, handleExpand,
  
  showVerify, 
  optionVerify,
  handleVerify
})=> {
  

  const [ brancheState, brancheSortSet ] = useState([]);
  
  const [ flow, flowSet ] = useState([]);
  const [ flowAlt, flowAltSet ] = useState([]);
  const [ floorReleased, floorReleaseSet ] = useState(false);
  
  const [ progCounts, progCountsSet ] = useState(false);

  useEffect( ()=>{
    const branchesSort = app.branches.sort((b1, b2)=> {
      return b1.position < b2.position ? 1 : 
             b1.position > b2.position ? -1 : 0 });
     brancheSortSet(branchesSort);
  }, [app]);
  
  useLayoutEffect( ()=> {
    const b = batchData;
    const w = widgetData;
    let getFlow = [];
    let getFlowAlt = [];
    let getFlRel = false;
    let getProgCounts = false;
    if( b && w ) {
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
      if(river) {
        getFlow = river.flow;
      }
      if(riverAlt) {
        getFlowAlt = riverAlt.flow;
      }
      getFlRel = b.releases.findIndex( x => x.type === 'floorRelease') >= 0;
      if( Array.isArray(b.items) ) {
        getProgCounts = ProgressCounter(getFlow, getFlowAlt, b);
      }
    }
    flowSet(getFlow);
    flowAltSet(getFlowAlt);
    floorReleaseSet(getFlRel);
    progCountsSet(getProgCounts);
  }, [batchData, widgetData]);
  
  

  
  // const u = user;
  // const bData = batchData;
  
  // const et = !u || !u.engaged ? false : u.engaged.tKey;
  // const tide = !bData || !bData.tide ? [] : bData.tide;
  
    
  
  
  // let riverExpand = expand;
  
  // import TideLock from '/client/components/tide/TideLock.jsx';

  // <TideLock tideFloodGate={tideFloodGate}>
    
  return(
      <div>
          
          <div 
            className=''>
            <div className='proPrime'>
              {itemData ?
              
                <ItemCard
            batchData={batchData}
            itemData={itemData}
            widgetData={widgetData}
            users={users}
            app={app}
            
                  tideFloodGate={tideFloodGate}
                  brancheS={brancheState}
                  flow={flow}
                  flowAlt={flowAlt}
                  floorReleased={floorReleased}
                  progCounts={progCounts}
                  showVerify={showVerify}
                  optionVerify={optionVerify}
                  changeVerify={(q)=>handleVerify(q)}
                />
                : null
              }
            </div>
            
       
              <div className='proExpand'>
                <BatchCard
            batchData={batchData}
            itemData={itemData}
            widgetData={widgetData}
            versionData={versionData}
          
            user={user}
            app={app}
            tideFloodGate={tideFloodGate}
                  brancheS={brancheState}
                  
                  
                  
                     flow={flow}
                  flowAlt={flowAlt}
                  floorReleased={floorReleased}
                  progCounts={progCounts} />
              </div>
  
          </div>
          
  
      </div>

  );
};

export default DoProCard;



// UNSAFE_componentWillReceiveProps(nextProps) {
//     itemData.serial !== nextProps.itemData.serial ?
//       this.forceUpdate() : null;
//   }

// const ItemCard = ({ 
//   batchData, itemData, widgetData, 
//   users, app,
//   currentLive, flow, flowAlt, progCounts,
//   showVerify, optionVerify, changeVerify
// })=> {
//   let itemContext = useContext(itemData);
  
//   return useMemo(() => {
//     return(
//       <ItemCardContent
//         itemContext={itemContext}
//         batchData={batchData}
//         itemData={itemData} 
//         widgetData={widgetData} 
//         users={users}
//         app={app}
//         currentLive={currentLive}
//         brancheS={brancheS}
//         fow={flow}
//         flowAlt={flowAlt}
//         progCounts={progCounts}
//         showVerify={showVerify}
//         optionVerify={optionVerify}
//         changeVerify={changeVerify} />
//     );
//   }, [ itemContext, currentLive ]);
// };