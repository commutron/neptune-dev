import React, { useRef, useState, useEffect } from 'react';

import StoneSelect from './StoneSelect';


const StoneWeir = ({
	bID, 
  bComplete,
  flow,
  rapIs, rarapid,
  seriesId,
  item,
  allItems,
  altIs, wFlowOps, wFlowNow,
  nonCons,
  shortfalls,
  scrapCheck,
  
  brancheS,
  canVerify, users,
  flowCounts,
  app,
  
  showVerifyState,
  optionVerify,
  handleVerify,
  
  undoOption,
  openUndoOption,
  closeUndoOption
})=> {
  
  const mounted = useRef(true);
 
  useEffect(() => {
    return () => { mounted.current = false };
  }, []);
  
  const [ riverFlowState, riverFlowStateSet ] = useState( true );

  console.log('select: ' + riverFlowState);
  
  useEffect( ()=> {
		if(mounted.current) { riverFlowStateSet( true ) }
	}, [ item.serial ]);
	
	const speed = !Meteor.user().unlockSpeed ? 5000 : Meteor.user().unlockSpeed;

	const timeOutCntrl = !app.lockType || 
					app.lockType === 'timer' ? speed :
					app.lockType === 'timerVar' ? 
						riverFlowState === 'slow' ? ( speed * 6 ) : speed : ///////
					app.lockType === 'confirm' ? 
						!riverFlowState ? null : speed :
					app.lockType === 'confirmVar' ? 
						!riverFlowState ? null : 
							riverFlowState === 'slow' ? ( speed * 6 ) : speed :
					0;				


  return(
    <StoneSelect
      bID={bID}
      bComplete={bComplete}
      flow={flow}
      rapIs={rapIs}
      rarapid={rarapid}
      seriesId={seriesId}
      item={item}
      allItems={allItems}
      altIs={altIs}
      wFlowOps={wFlowOps}
      wFlowNow={wFlowNow}
      nonCons={nonCons}
      shortfalls={shortfalls}
      scrapCheck={scrapCheck}
      
      brancheS={brancheS}
      canVerify={canVerify}
      users={users}
      flowCounts={flowCounts}
      app={app}
      
      showVerifyState={showVerifyState}
      optionVerify={optionVerify}
      handleVerify={handleVerify}
      
      undoOption={undoOption}
      openUndoOption={openUndoOption}
      closeUndoOption={closeUndoOption}
      
      timeOutCntrl={timeOutCntrl}
      riverFlowStateSet={(e)=>riverFlowStateSet(e)}
    />
  );
};

export default StoneWeir;