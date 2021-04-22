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
  canVerify,
  flowCounts,
  app,
  userSpeed,
  users,
  
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
  
  useEffect( ()=> {
		if(mounted.current) { riverFlowStateSet( true ) }
	}, [ item.serial ]);
	
	const speed = !userSpeed ? 2000 : userSpeed;

	const timeOutCntrl = !app.lockType || 
					app.lockType === 'timer' ? speed :
					app.lockType === 'timerVar' ? 
						riverFlowState === 'slow' ? ( speed * 4 ) : speed : //
					app.lockType === 'confirm' ? 
						!riverFlowState ? null : speed :
					app.lockType === 'confirmVar' ? 
						!riverFlowState ? null : 
							riverFlowState === 'slow' ? ( speed * 4 ) : speed :
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