import React, { useRef, useState, useEffect } from 'react';

import StoneSelect from './StoneSelect';

import usePrevious from '/client/utility/usePreviousHook.js';

const StoneWeir = ({
	bID, 
  bComplete,
  flow,
  rapIs, rarapid,
  seriesId,
  item,
  allItems,
  altIs, altitle, wFlowOps, wFlowNow,
  nonCons,
  shortfalls,
  scrapCheck,
  
  brancheS,
  canVerify,
  flowCounts,
  app,
  userSpeed,
  
  handleVerify,
  
  undoOption,
  openUndoOption,
  closeUndoOption
})=> {
  
  const mounted = useRef(true);
  const preSerial = usePrevious(item.serial);
  
  useEffect(() => {
    return () => { mounted.current = false };
  }, []);
  
  const [ riverFlowState, riverFlowStateSet ] = useState( true );
	
	const speed = !userSpeed ? 2000 : userSpeed;
  const delay = preSerial !== item.serial ? true : riverFlowState;
  
	const timeOutCntrl = !app.lockType || 
					app.lockType === 'timer' ? speed :
					app.lockType === 'timerVar' ? 
						delay === 'slow' ? ( speed * 6 ) : speed : //
					app.lockType === 'confirm' ? 
						!delay ? null : speed :
					app.lockType === 'confirmVar' ? 
						!delay ? null : 
							delay === 'slow' ? ( speed * 6 ) : speed :
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
      altitle={altitle}
      wFlowOps={wFlowOps}
      wFlowNow={wFlowNow}
      nonCons={nonCons}
      shortfalls={shortfalls}
      scrapCheck={scrapCheck}
      
      brancheS={brancheS}
      canVerify={canVerify}
      flowCounts={flowCounts}
      
      handleVerify={handleVerify}
      
      undoOption={undoOption}
      openUndoOption={openUndoOption}
      closeUndoOption={closeUndoOption}
      
      timeOutCntrl={timeOutCntrl}
      riverFlowStateSet={(e)=>mounted.current && riverFlowStateSet(e)}
    />
  );
};

export default StoneWeir;