import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import StoneSelect from './StoneSelect.jsx';
// import RiverFork from './RiverFork.jsx';
// import AltMarker from '/client/components/tinyUi/AltMarker.jsx';

const River = ({ 
  batchData, seriesData, itemData, widgetData, 
  altIs, rapid, rapIs,
  app, users, brancheS,
  useFlow, flowCounts,
  shortfallS, scrapCheck,
  showVerifyState, optionVerify, handleVerify
})=> {
  
  const thingMounted = useRef(true);
  
  const [ undoStepOption, undoOpSet ] = useState(false);
  
  useEffect(() => {
    return () => { thingMounted.current = false; };
  }, []);
  
  function tempOpenOption() {
    undoOpSet( true );
    Meteor.setTimeout(()=> {
      if(thingMounted.current) { undoOpSet( false ); }
    }, Pref.stepUndoWindow);
  }
  function closeOption() {
    if(thingMounted.current) { undoOpSet( false ); }
  }
  
  const canVerify = Roles.userIsInRole(Meteor.userId(), 'verify');

  return(
		<div className={altIs ? 'altHighlight' : rapIs ? 'rapIsHighlight' : ''}>
		
      <StoneSelect
        bID={batchData._id}
        bComplete={batchData.completed}
        flow={useFlow}
        rapIs={rapIs}
        rarapid={rapid ? rapid.rapid : false}
        seriesId={seriesData._id}
        item={itemData}
        allItems={seriesData.items}
        altIs={altIs}
        wFlowOps={widgetData.flows}
        wFlowNow={batchData.river}
        nonCons={seriesData.nonCon}
        shortfalls={shortfallS}
        scrapCheck={scrapCheck}
        
        brancheS={brancheS}
        canVerify={canVerify}
        users={users}
        flowCounts={flowCounts}
        app={app}
        
        showVerifyState={showVerifyState}
        optionVerify={optionVerify}
        handleVerify={handleVerify}
        
        undoOption={undoStepOption}
        openUndoOption={()=>tempOpenOption()}
        closeUndoOption={()=>closeOption()} />
    
		</div>
	);
};

export default River;