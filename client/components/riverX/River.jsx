import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import StoneSelect from './StoneSelect.jsx';
// import RiverFork from './RiverFork.jsx';
// import RMACascade from './RMACascade.jsx';
// import MiniHistory from './MiniHistory.jsx';
// import AltMarker from '/client/components/tinyUi/AltMarker.jsx';

const River = ({ 
  batchData, seriesData, itemData, widgetData, rapid, rapIs,
  app, users, brancheS,
  useFlow, flowCounts,
  shortfallS, scrapCheck,
  showVerifyState, optionVerify, handleVerify
})=> {
  
  const thingMounted = useRef(true);
  
  const [ undoStepOption, undoOpSet ] = useState(false);
  
  useEffect(() => {
    return () => { thingMounted.current = false;
      // Meteor.clearTimeout(timer);
    };
  }, []);
  
  function tempOpenOption() {
    undoOpSet( true );
    Meteor.setTimeout(()=> {
      if(thingMounted.current) { undoOpSet( false ); }
    }, Pref.stepUndoWindow);
  }
  function closeOption() {
    undoOpSet( false );
  }

  return(
		<div className={rapIs ? 'altHighlight' : ''}>
		
	    {/*i.finishedAt === false && b.riverAlt && i.alt !== false ? 
	      <AltMarker id={b._id} serial={i.serial} alt={i.alt} />
	    : null*/}
      <StoneSelect
        bID={batchData._id}
        bComplete={batchData.completed}
        flow={useFlow}
        rapIs={rapIs}
        rarapid={rapid ? rapid.rapid : false}
        seriesId={seriesData._id}
        item={itemData}
        allItems={seriesData.items}
        nonCons={seriesData.nonCon}
        shortfalls={shortfallS}
        scrapCheck={scrapCheck}
        
        brancheS={brancheS}
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