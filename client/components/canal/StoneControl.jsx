import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import StoneReg from './StoneReg.jsx';
import StoneTest from './StoneTest.jsx';
import FoldInNested from './FoldInNested';
import StoneFinish from './StoneFinish.jsx';

import useTimeOut from '/client/utility/useTimeOutHook.js';

const StoneControl = ({
	batchId,
	seriesId, serial,
	sKey, step, type, 
	altIs, rapIs, rarapid,
	branchObj,
	allItems,
	canVerify, users, app,
	flowCounts,
	blockStone, doneStone, compEntry,
	handleVerify,
	openUndoOption, closeUndoOption,
	timeOutCntrl, riverFlowStateSet,
	commTrigger, commTxtState
})=> {
	
	const mounted = useRef(true);
	
  const [ holdState, holdSet ] = useState( true );
  const [ lockout, lockoutSet ] = useState( true );
	const [ workingState, workingSet ] = useState( false );
	
	const [ reqULState, reqULSet ] = useState( false );
	
	useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
	useEffect( ()=> {
		if(mounted.current) {
			const checkLock = holdState || blockStone || doneStone;
			lockoutSet(checkLock);
		}
	}, [ serial, sKey, holdState, blockStone, doneStone ]);
	
	function unlockAllow() {
		const thisBranch = branchObj || null;
		const reqUL = thisBranch && thisBranch.reqUserLock === true;
		const reqKey = thisBranch ? ( 'BRK' + branchObj.brKey ) : null;
  	if( reqUL && !Roles.userIsInRole(Meteor.userId(), reqKey) ) {
  		reqULSet(true);
  	}else if(type === 'test' && !Roles.userIsInRole(Meteor.userId(), 'test')) {
  		reqULSet(true);
  	}else if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		reqULSet(true);
  	}else if(type === 'first' && !canVerify) {
  		reqULSet(true);
  	}else{
		  holdSet( false );
  	}
	}
					
	useTimeOut( unlockAllow, timeOutCntrl );
	
  function enactEntry() {
  	if(holdState === true) { return false; }
	  holdSet( true );
	  riverFlowStateSet( false );
	  workingSet( true );
	  closeUndoOption();
  }
  function resolveEntry(blockUndo, repeat) {
  	commTrigger(false);
  	riverFlowStateSet( 'slow' );
		if(mounted.current) { workingSet( false ); }
		!blockUndo && openUndoOption();
		repeat && unlockAllow();
	  document.getElementById('lookup').focus();
  }
   
  const topClass = doneStone ? 'doneStoneMask' :
  								 blockStone ? 'blockStone' :
  								 reqULState ? 'authBanMask' : '';
  const topTitle = topClass !== '' ? Pref.stoneislocked : '';
  
  const preTotal = flowCounts.liveItems;
  const preStep = flowCounts.riverProg.find( x => x.key === sKey );
  const preCount = preStep ? preStep.items : undefined;
  const benchmark = preCount === 0 ? 'first' : 
  									(preCount === preTotal - 1 ) ||
  									(altIs && flowCounts.altDone === flowCounts.altItems -1 ) ? 
  									'last' : false;              
  
	const renderReg = 
		<StoneReg 
			key={seriesId+serial+sKey}
			batchId={batchId}
			seriesId={seriesId}
			barcode={serial}
			sKey={sKey}
			step={step}
			type={type} 
			flowCounts={flowCounts}
			benchmark={benchmark}
			lockout={lockout}
			topClass={topClass}
			topTitle={topTitle}
			allItems={allItems}
			enactEntry={()=>enactEntry()}
			resolveEntry={()=>resolveEntry()}
			workingState={workingState}
			commTxtState={commTxtState}
		/>;
	
	const renderTest = 
		<StoneTest
			key={seriesId+serial+sKey}
			batchId={batchId}
			seriesId={seriesId}
			barcode={serial}
			sKey={sKey}
			step={step}
			type={type} 
			flowCounts={flowCounts}
			benchmark={benchmark}
			lockout={lockout}
			topClass={topClass}
			topTitle={topTitle}
			allItems={allItems}
			enactEntry={()=>enactEntry()}
			resolveEntry={()=>resolveEntry()}
			workingState={workingState}
			tryagainEntry={()=>resolveEntry(true, true)}
			commTrigger={commTrigger}
			commTxtState={commTxtState}
		/>;
	
	const renderNest =
		<FoldInNested
			batchId={batchId}
      seriesId={seriesId}
      serial={serial}
      sKey={sKey}
      step={step}
      benchmark={benchmark}
      topClass={topClass}
			topTitle={topTitle}
      lockout={lockout}
      riverFlowStateSet={riverFlowStateSet}
      closeUndoOption={closeUndoOption}
    	commTxtState={commTxtState}
    />;
    
	const renderFinish = 
		<StoneFinish
			key={seriesId+serial+sKey}
			batchId={batchId}
			seriesId={seriesId}
			serial={serial}
			sKey={sKey}
			step={step}
			type={type}
			rapIs={rapIs}
			rarapid={rarapid}
			flowCounts={flowCounts}
			benchmark={benchmark}
			lockout={lockout}
			topClass={topClass}
			topTitle={topTitle}
			allItems={allItems}
			enactEntry={()=>enactEntry()}
			resolveEntry={()=>resolveEntry(true)}
			workingState={workingState}
			commTxtState={commTxtState}
		/>;
	
	if(type === 'test') {
		return(
			renderTest
		);
	}
	
	if(type === 'nest') {
		return(
			renderNest
		);
	}
	
	if(type === 'finish') {
		return(
			renderFinish
		);
	}
	
	return(
		renderReg
	);
};


function areEqual(prevProps, nextProps) {
	if(
		prevProps.serial !== nextProps.serial ||
		prevProps.doneStone !== nextProps.doneStone ||
		prevProps.blockStone !== nextProps.blockStone ||
		prevProps.sKey !== nextProps.sKey ||
		prevProps.commTxtState !== nextProps.commTxtState
	) {
  	return false;
	}else{
		return true;
	}
  /*
  return true if nextProps would return the same result as prevProps,
  otherwise return false
	*/  
}

export default React.memo(StoneControl, areEqual);