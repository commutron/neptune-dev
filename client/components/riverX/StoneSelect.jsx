import React, { useRef, useEffect } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import StoneControl from './StoneControl';
import ForkMenu from './ForkMenu';
import FoldInNested from './FoldInNested';
import TestFails from './TestFails';
import NCTributary from './NCTributary';
import Shortfalls from './Shortfalls';
import CompleteRest from './CompleteRest';

const StoneSelect = ({ 
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
  closeUndoOption,
  
  timeOutCntrl, riverFlowStateSet
})=> {
  
  const mounted = useRef(true);
 
  useEffect(() => {
    return () => { 
      closeUndoOption();
      mounted.current = false;
    };
  }, []);
  
  useEffect( ()=> {
    Session.set('ncWhere', null);
	  Session.set('nowStepKey', null);
    Session.set('nowWanchor', null);
		if(mounted.current) { closeUndoOption(); }
	}, [ item.serial ]);
					
  // Complete or Scrap
  if((item.completed && !rapIs) || scrapCheck) {
    Session.set('ncWhere', 'isC0mpl3t3d');
	  Session.set('nowStepKey', 'c0mp13t3');
    Session.set('nowWanchor', '');
    return(
      <CompleteRest
        seriesId={seriesId}
        serial={item.serial}
        iComplete={item.completedAt}
        history={item.history}
        altPath={item.altPath}
        scrap={scrapCheck}
        bComplete={bComplete}
        shortfallS={shortfalls} />
    );
  }
  
  const nc = nonCons.filter( 
              x => x.serial === item.serial && !x.trash && x.inspect === false )
                .sort((n1, n2)=> n1.ref < n2.ref ? -1 : n1.ref > n2.ref ? 1 : 0 );
                
  const ncOutstanding = nc.filter( x => x.snooze === false );
  
  const iDone = item.history;

  const allAnswered = shortfalls.length === 0 ||
            shortfalls.every( x => x.inEffect === true || x.reSolve === true );
  
  function handleStepUndo() {
		Meteor.call('popHistoryX', seriesId, item.serial, ()=>{
			closeUndoOption();
		});
	}
	
  for(let flowStep of flow) {
    const brKey = flowStep && flowStep.branchKey;
    const branchObj = brancheS.find( b => b.brKey === brKey ) || null;
    const stepBranch = branchObj ? branchObj.branch : flowStep.step;
    
    const first = flowStep.type === 'first';
    
    const didFirst = !first ? false : altIs ? 
            allItems.find( i => i.altPath.some( x => x.river !== false ) &&
              i.history.find( x => x.key === flowStep.key && x.good !== false ) 
            ) ? true : false
            :
            allItems.find( i => i.altPath.every( x => !x.river ) &&
              i.history.find( x => x.key === flowStep.key && x.good !== false ) 
        ) ? true : false;
  
    const stepComplete = first ? 
      iDone.find(ip => ip.key === flowStep.key) || didFirst
      :
      iDone.find(ip => ip.key === flowStep.key && ip.good === true);
    
    const ncFromHere = ncOutstanding.filter( x => x.where === stepBranch );
    const ncResolved = ncFromHere.length === 0;
    
    const damStep = !branchObj ? null : branchObj.reqProblemDam;
  
    const ncAllClear = ncOutstanding.length === 0;
    const shAllClear = allAnswered === true;
      
    if( ( ( flowStep.type === 'first' || flowStep.type === 'build' ) && stepComplete ) 
        || ( stepComplete && ncResolved ) 
      ) {
      null;
    }else{
      
      Session.set('ncWhere', stepBranch);
	    Session.set('nowStepKey', flowStep.key);
      Session.set('nowWanchor', flowStep.how);
    
      const compEntry = iDone.find( sc => sc.key === flowStep.key && sc.good === true);
      const fTest = flowStep.type === 'test' ? 
                    iDone.filter( x => x.type === 'test' && x.good === false) : [];
      
      const blockStone = damStep && ( !ncAllClear || !shAllClear ) ? true : false;
      const doneStone = stepComplete || false;
	    
	    return(
        <div className='stoneGrid'>

	        {flowStep.type === 'nest' ?
	          <FoldInNested
              seriesId={seriesId}
              serial={item.serial}
              sKey={flowStep.key}
              step={flowStep.step}
              doneStone={doneStone}
              lock={false} />
          : 
	          <StoneControl
		          key={flowStep.key + item.serial}
              batchId={bID}
              seriesId={seriesId}
              serial={item.serial}
              sKey={flowStep.key}
              step={flowStep.step}
              type={flowStep.type}
              altIs={altIs}
              rapIs={rapIs}
              rarapid={rarapid}
              branchObj={branchObj}
              allItems={allItems}
              canVerify={canVerify}
              users={users}
              app={app}
              flowCounts={flowCounts}
              blockStone={blockStone}
              doneStone={doneStone}
              compEntry={compEntry}
              handleVerify={handleVerify}
              openUndoOption={openUndoOption}
              timeOutCntrl={timeOutCntrl}
              riverFlowStateSet={riverFlowStateSet}
            />
	        }
  	      
  	      {canVerify && wFlowOps.length > 1 && !rapIs ?
    	      <ForkMenu
    	        seriesId={seriesId}
    	        serial={item.serial}
    	        wFlowOps={wFlowOps}
    	        wFlowNow={wFlowNow}
    	        altIs={altIs}
    	      />
  	       : null}
  	      
          <div className='undoStepWrap'>
  					{undoOption ? 
  						<button
  							className='textAction'
  							onClick={(e)=>handleStepUndo(e)}
  						><i className="fas fa-undo-alt spinRe"></i> Go Back</button>
  					: null}
  				</div>
          
          <div className='riverErrors'>
            {fTest.length > 0 && 
              <TestFails fails={fTest} />
            }
          
            <NCTributary
      			  seriesId={seriesId}
      			  serial={item.serial}
      			  nonCons={nc}
      			  sType={flowStep.type} />
      			  
            <Shortfalls
      			  seriesId={seriesId}
      			  shortfalls={shortfalls}
      			  lock={item.completed && !rapIs} />
          </div>
  			</div>
      );
    }
  }
  
  Session.set('ncWhere', 'isC0mpl3t3d');
	Session.set('nowStepKey', 'c0mp13t3');
  Session.set('nowWanchor', '');
  
  return(
    <div className='centre centreText'>
      <p><i className="fas fa-ghost fa-5x fade darkgrayT"></i></p>
      <p className='medBig cap'>no {Pref.flow} available</p>
    </div>
  );
};
  
export default StoneSelect;