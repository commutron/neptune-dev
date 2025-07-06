import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import StoneControl from './StoneControl';
import ForkMenu from './ForkMenu';
import { CommField } from './CommField';
import TestFails from './TestFails';
import NCTributary from './NCTributary';
import Shortfalls from './Shortfalls';
import CompleteRest from './CompleteRest';
import { CommTrigger } from './CommField';

const StoneSelect = ({ 
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
  
  const [ commDoState, commDoSet ] = useState(false);
  const [ commTxtState, commTxtSet ] = useState("");
  
  const commTrigger = (flip)=> {
    commDoSet(flip);
    commTxtSet("");
  };
  
  useEffect( ()=> {
    Session.set('ncWhere', null);
	  Session.set('nowStepKey', null);
    Session.set('nowWanchor', null);
		if(mounted.current) { closeUndoOption() }
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
        altitle={altitle}
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
   
      const fTest = flowStep.type === 'test' ? 
                    iDone.filter( x => x.type === 'test' && x.good === false) : [];
      
      const blockStone = damStep && ( !ncAllClear || !shAllClear ) ? true : false;
      const doneStone = stepComplete || false;
	    
	    return(
        <div className='stoneGrid'>

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
            canVerify={canVerify}
            flowCounts={flowCounts}
            blockStone={blockStone}
            doneStone={doneStone}
            handleVerify={handleVerify}
            openUndoOption={openUndoOption}
            closeUndoOption={closeUndoOption}
            timeOutCntrl={timeOutCntrl}
            riverFlowStateSet={riverFlowStateSet}
            commTrigger={(e)=>commTrigger(e)}
            commTxtState={commTxtState}
          />
	        
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
  					  <GoBack 
  					    handleStepUndo={(e)=>handleStepUndo(e)}
  					    selfCancel={closeUndoOption}
  					  />
  					: null}
  				</div>
  				
  				{flowStep.type !== 'first' &&
  				  <div className='stoneComm'>
      				<CommTrigger
      					commTrigger={()=>commTrigger(!commDoState)} />
          	</div>}
  				
  				{rapIs && rarapid ?
  				  <div className='altTitle cap'>
  				    <small>{Pref.rapidExd}: {rarapid}</small>
  				  </div>
  				:
  				 altIs && 
  				  <div className='altTitle cap'>
  				    <small>Alt Flow: {altitle}</small>
  				  </div>
  				}
  				
  				{commDoState &&
  				  <CommField commSet={(e)=>commTxtSet(e)} />}
          
          <div className='riverErrors'>
            {fTest.length > 0 && 
              <TestFails fails={fTest} />
            }
          
            <NCTributary
      			  seriesId={seriesId}
      			  serial={item.serial}
      			  nonCons={nc}
      			  sType={flowStep.type}
      			  rapIs={rapIs}
      			  canVerify={canVerify}
      			/>
      			  
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
      <p><i className="fas fa-question-circle fa-4x fade darkgrayT"></i></p>
      <p className='medBig cap'>no {Pref.flow} available</p>
    </div>
  );
};
  
export default StoneSelect;

const GoBack = ({ handleStepUndo, selfCancel })=> {
  
  useEffect( ()=>{
    let t = Meteor.setTimeout(selfCancel, Pref.stepUndoWindow);
    return ()=> { Meteor.clearTimeout(t) };
  },[]);
  
  return(
    <button
			className='textAction'
			title='Undo Last Step'
			onClick={(e)=>{e.target.disabled = true;handleStepUndo(e)}}
			disabled={false}
		><i className="fas fa-undo-alt spinRe gapR"></i>Go Back</button>
  );
};