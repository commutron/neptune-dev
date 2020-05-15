import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import StoneReg from './StoneReg.jsx';
import StoneVerify from './StoneVerify.jsx';
import StoneTest from './StoneTest.jsx';
import StoneFinish from './StoneFinish.jsx';

import useTimeOut from '/client/utility/useTimeOutHook.js';

const StoneControl = ({
	id, serial,
	sKey, step, type,
	branchObj,
	allItems,
	isAlt, hasAlt,
	users, app,
	progCounts,
	blockStone, doneStone, compEntry,
	handleVerify,
	openUndoOption,
	riverFlowState, riverFlowStateSet
})=> {
	
  const [ holdState, holdSet ] = useState( true );
  const [ lockout, lockoutSet ] = useState( true );
	const [ workingState, workingSet ] = useState( false );
	
	const [ reqULState, reqULSet ] = useState( false );

	useEffect( ()=> {
		const checkLock = holdState || blockStone || ( !doneStone ? false : true );
		lockoutSet(checkLock);
	}, [ serial, sKey, holdState, blockStone, doneStone ]);
	
	function unlockAllow() {
		const thisBranch = branchObj || null;
		const reqUL = thisBranch && thisBranch.reqUserLock === true;
		const reqKey = thisBranch ? ( 'BRK' + branchObj.brKey ) : null;
  	if( reqUL && !Roles.userIsInRole(Meteor.userId(), reqKey) ) {
  		reqULSet(true);
  	}else if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		reqULSet(true);
  	}else if(type === 'first' && !Roles.userIsInRole(Meteor.userId(), 'verify')) {
  		reqULSet(true);
  	}else{
		  holdSet( false );
  	}
	}
	
	const speed = !Meteor.user().unlockSpeed ? 
									5000 : ( Meteor.user().unlockSpeed );
	
  const speedVar = riverFlowState === 'slow' ? ( speed * 6 ) : speed;
	const confirmLock = !riverFlowState ? null : speed;
	const confirmLockVar = !riverFlowState ? null : 
													riverFlowState === 'slow' ? ( speed * 6 ) : speed;

	const timeOutCntrl = !app.lockType || app.lockType === 'timer' ? speed :
																				app.lockType === 'timerVar' ? speedVar :
																				app.lockType === 'confirm' ? confirmLock :
																				app.lockType === 'confirmVar' ? confirmLockVar :
																				0;
	
	useTimeOut( unlockAllow, timeOutCntrl );
  
  function enactEntry() {
  	if(holdState === true) { return false; }
	  holdSet( true );
	  riverFlowStateSet( false );
	  workingSet( true );
  }
  function resolveEntry() {
  	riverFlowStateSet( 'slow' );
		workingSet( false );
		openUndoOption();
	  document.getElementById('lookup').focus();
  }
   
  const topClass = doneStone ? 'doneStoneMask' :
  								 blockStone ? 'blockStone' :
  								 reqULState ? 'authBanMask' : '';
  const topTitle = topClass !== '' ? Pref.stoneislocked : '';
		
	const renderReg = 
		<StoneReg 
			key={id+serial+sKey}
			id={id}
			barcode={serial}
			sKey={sKey}
			step={step}
			type={type} 
			progCounts={progCounts} 
			lockout={lockout}
			topClass={topClass}
			topTitle={topTitle}
			allItems={allItems}
			isAlt={isAlt}
			hasAlt={hasAlt}
			enactEntry={()=>enactEntry()}
			resolveEntry={()=>resolveEntry()}
			workingState={workingState}
		/>;
	
	const renderVerify = 
		<StoneVerify 
			key={id+serial+sKey}
			id={id}
			barcode={serial}
			sKey={sKey}
			step={step}
			type={type} 
			lockout={lockout}
			topClass={topClass}
			topTitle={topTitle}
			handleVerify={handleVerify}
		/>;
	
	const renderTest = 
		<StoneTest
			key={id+serial+sKey}
			id={id}
			barcode={serial}
			sKey={sKey}
			step={step}
			type={type} 
			progCounts={progCounts} 
			lockout={lockout}
			topClass={topClass}
			topTitle={topTitle}
			allItems={allItems}
			isAlt={isAlt}
			hasAlt={hasAlt}
			enactEntry={()=>enactEntry()}
			resolveEntry={()=>resolveEntry()}
			workingState={workingState}
		/>;
	
	const renderFinish = 
		<StoneFinish
			key={id+serial+sKey}
			id={id}
			barcode={serial}
			sKey={sKey}
			step={step}
			type={type} 
			progCounts={progCounts} 
			lockout={lockout}
			topClass={topClass}
			topTitle={topTitle}
			allItems={allItems}
			isAlt={isAlt}
			hasAlt={hasAlt}
			enactEntry={()=>enactEntry()}
			resolveEntry={()=>resolveEntry()}
			workingState={workingState}
		/>;
		
	if(type === 'first') {
		return(
			renderVerify
		);
	}
	
	if(type === 'test') {
		return(
			renderTest
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
		prevProps.riverFlowState !== nextProps.riverFlowState
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