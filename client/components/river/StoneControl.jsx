import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

// import StoneProgRing from './StoneProgRing.jsx';
import StoneReg from './StoneReg.jsx';
import StoneVerify from './StoneVerify.jsx';
import StoneTest from './StoneTest.jsx';
import StoneFinish from './StoneFinish.jsx';

import useTimeOut from '/client/utility/useTimeOutHook.js';

const StoneControl = ({
	key, id, barcode,
	sKey, step, type,
	branchObj,
	allItems,
	isAlt, hasAlt,
	users, app,
	progCounts,
	blockStone, doneStone, compEntry,
	showVerify, changeVerify, undoOption,
	openUndoOption, closeUndoOption,
	riverFlowState, riverFlowStateSet
})=> {
	
  const [ lockState, lockSet ] = useState( true );
  const [ lockout, lockoutSet ] = useState( true );
	const [ workingState, workingSet ] = useState( false );

	useEffect( ()=> {
		const checkLock = lockState || blockStone || ( !doneStone ? false : true );
		lockoutSet(checkLock);
	}, [ lockState, blockStone, doneStone ]);
	
	
	function unlockAllow() {
		// Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({riverFlowState});
  	// if(doneStone || blockStone) {
  	// 	null;
  	if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		null;
  	}else if(type === 'first' && !Roles.userIsInRole(Meteor.userId(), 'verify')) {
  		null;
  	}else if(type === 'test' && !Roles.userIsInRole(Meteor.userId(), 'test')) {
  		null;
  	}else if(type === 'finish' && !Roles.userIsInRole(Meteor.userId(), 'finish')) {
  		null;
  	}else{
		  lockSet( false );
  	}
	}
	
	const speed = !Meteor.user().unlockSpeed ? 
									4000 : ( Meteor.user().unlockSpeed * 2 );
	
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
  	if(lockState === true) { return false; }
	  lockSet( true );
	  riverFlowStateSet( false );
	  workingSet( true );
  }
  function resolveEntry() {
  	riverFlowStateSet( 'slow' );
		workingSet( false );
		openUndoOption();
	  document.getElementById('lookup').focus();
  }
	
	function handleStepUndo() {
		Meteor.call('popHistory', id, barcode, ()=>{
			closeUndoOption();
		});
	}
    
  const topClass = doneStone ? 'doneStoneMask' :
  								 blockStone ? 'blockStone' : '';
  const topTitle = topClass !== '' ? Pref.stoneislocked : '';
	
	if(type === 'first') {
		return(
			<StoneVerify 
				key={key}
				id={id}
				barcode={barcode}
				sKey={sKey}
				step={step}
				type={type} 
				lockout={lockout}
				topClass={topClass}
				topTitle={topTitle}
				
				changeVerify={changeVerify}
				
				handleStepUndo={handleStepUndo}
				undoOption={undoOption}
			/>
		);
	}
	
	if(type === 'test') {
		return(
			<StoneTest
				key={key}
				id={id}
				barcode={barcode}
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
	
				handleStepUndo={handleStepUndo}
				undoOption={undoOption}
				closeUndoOption={closeUndoOption}
				
				enactEntry={()=>enactEntry()}
				resolveEntry={()=>resolveEntry()}
				workingState={workingState}
			/>
		);
	}
	
	if(type === 'finish') {
		return(
			<StoneFinish
				key={key}
				id={id}
				barcode={barcode}
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
	
				handleStepUndo={handleStepUndo}
				undoOption={undoOption}
				closeUndoOption={closeUndoOption}
				
				enactEntry={()=>enactEntry()}
				workingState={workingState}
			/>
		);
	}
	
	return(
		<StoneReg 
			key={key}
			id={id}
			barcode={barcode}
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

			handleStepUndo={handleStepUndo}
			undoOption={undoOption}
			closeUndoOption={closeUndoOption}
			
			enactEntry={()=>enactEntry()}
			resolveEntry={()=>resolveEntry()}
			workingState={workingState}
		/>
	);
};

function areEqual(prevProps, nextProps) {
	if(
		prevProps.doneStone !== nextProps.doneStone ||
		prevProps.blockStone !== nextProps.blockStone ||
		prevProps.sKey !== nextProps.sKey ||
		(prevProps.undoOption === true && nextProps.undoOption === false)
	) {
  	return false;
	}else{
		return true;
	}
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}

export default React.memo(StoneControl, areEqual);