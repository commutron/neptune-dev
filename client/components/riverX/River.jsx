import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';

import StoneWeir from './StoneWeir';

const River = ({ 
  batchData, seriesData, itemData, widgetData, 
  altIs, altitle, rapid, rapIs,
  app, userSpeed, users, brancheS,
  useFlow, flowCounts,
  shortfallS, scrapCheck,
  showVerifyState, optionVerify, handleVerify
})=> {
  
  const thingMounted = useRef(true);
  
  const [ undoStepOption, undoOpSet ] = useState(false);
  
  useEffect(() => {
    return () => { thingMounted.current = false; };
  }, []);
  
  function closeOption() {
    if(thingMounted.current) { undoOpSet( false ) }
  }
  function tempOpenOption() {
    undoOpSet( true );
  }
  
  const canVerify = Roles.userIsInRole(Meteor.userId(), 'verify');

  return(
		<div className={altIs ? 'altHighlight' : rapIs ? 'rapIsHighlight' : ''}>
		
      <StoneWeir
        bID={batchData._id}
        bComplete={batchData.completed}
        flow={useFlow}
        rapIs={rapIs}
        rarapid={rapid ? rapid.rapid : false}
        seriesId={seriesData._id}
        item={itemData}
        allItems={seriesData.items}
        altIs={altIs}
        altitle={altitle}
        wFlowOps={widgetData.flows}
        wFlowNow={batchData.river}
        nonCons={seriesData.nonCon}
        shortfalls={shortfallS}
        scrapCheck={scrapCheck}
        
        brancheS={brancheS}
        canVerify={canVerify}
        flowCounts={flowCounts}
        app={app}
        userSpeed={userSpeed}
        users={users}
        
        showVerifyState={showVerifyState}
        optionVerify={optionVerify}
        handleVerify={handleVerify}
        
        undoOption={undoStepOption}
        openUndoOption={()=>tempOpenOption()}
        closeUndoOption={()=>closeOption()}
      />
		</div>
	);
};

export default River;