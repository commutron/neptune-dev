import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';
import StoneProgRing from './StoneProgRing.jsx';

function useTimeOut(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
  	Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({delay});
  	
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = Meteor.setTimeout(tick, delay);
      return () => Meteor.clearTimeout(id);
    }
  }, [delay]);
}

const Stone = ({
	key, id, barcode,
	sKey, step, type,
	currentLive, allItems,
	isAlt, hasAlt,
	users, app,
	progCounts,
	blockStone, doneStone, compEntry,
	showVerify, changeVerify, undoOption,
	openUndoOption, closeUndoOption,
	riverFlowState, riverFlowStateSet
})=> {
	
  const [ lockState, lockSet ] = useState( true );
  const [ workingState, workingSet ] = useState( false );
  
  useEffect( ()=>{ 
    
    
    //return ()=> riverFlowStateSet( true ); // reset on unmount 
  }, []);
 
	useEffect( ()=>{ // reset on unmount 
    if(doneStone || blockStone) {
    	lockSet( true );
    }
  }, [doneStone, blockStone]);
 
  let speed = !Meteor.user().unlockSpeed ? 4000 : ( Meteor.user().unlockSpeed * 2 );

	function unlockAllow() {
		Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({riverFlowState});
  	if(!currentLive) {
  		null;
  	}else if(doneStone || blockStone) {
  		null;
  	}else if(type === 'inspect' && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
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

	const speedVar = riverFlowState === 'slow' ? ( speed * 5 ) : speed;
	const confirmLock = !riverFlowState ? null : speed;
	const confirmLockVar = !riverFlowState ? null : riverFlowState === 'slow' ? ( speed * 3 ) : speed;
 
	const timeOutCntrl = !app.lockType || app.lockType === 'timer' ? speed :
																				app.lockType === 'timerVar' ? speedVar :
																				app.lockType === 'confirm' ? confirmLock :
																				app.lockType === 'confirmVar' ? confirmLockVar :
																				0;
	
  useTimeOut( unlockAllow, timeOutCntrl );
  
  
  function reveal() {
    changeVerify(false);
  }
  //// Action for standard step
  function passS(pass, doComm) {
  	if(lockState === true) { return false; }
    lockSet( true );
		riverFlowStateSet( false );
		workingSet( true );
		
    let comm = '';
    let comPrompt = doComm ? prompt('Enter A Comment', '') : false;
    comPrompt ? comm = comPrompt : null;
    // if(doComm && !comPrompt) { unlock(); return false; }
    
    const pre = progCounts;
    const preTotal = pre.regItems;
    const preStep = pre.regStepData.find( x => x.key === sKey );
    const preCount = preStep ? preStep.items : undefined;
    const benchmark = preCount === 0 ? 'first' : preCount === preTotal - 1 ? 'last' : false;              
    
		Meteor.call('addHistory', id, barcode, sKey, step, type, comm, pass, benchmark, (error, reply)=>{
	    if(error)
		    console.log(error);
			if(reply === true) {
				riverFlowStateSet( 'slow' );
				workingSet( false );
				openUndoOption();
			  document.getElementById('lookup').focus();
		  }else{
		    toast.error('server error');
		  }
		});
  }
  
  //// Action for test step
  function passT(pass, doComm, shipFail) {
  	if(lockState === true) { return false; }
    lockSet( true );
    riverFlowStateSet( false );
    workingSet( true );
    
    let comm = '';
    let comPrompt = doComm ? prompt('Enter A Comment', '') : false;
    comPrompt ? comm = comPrompt : null;
    // if(doComm && !comPrompt) { unlock(); return false; }
    
    const more = shipFail ? 'ship a failed test' : false;
    
    const pre = progCounts;
    const preTotal = pre.regItems;
    const preStep = pre.regStepData.find( x => x.key === sKey );
    const preCount = preStep ? preStep.items : undefined;
    const benchmark = preCount === 0 ? 'first' : preCount === preTotal - 1 ? 'last' : false;              
		
    if(pass === false && ( !comm || comm == '' ) ) {
    	// unlock();
    	null;
    }else{
			Meteor.call('addTest', id, barcode, sKey, step, type, comm, pass, more, benchmark, (error, reply)=>{
		    if(error)
			    console.log(error);
				if(reply === true) {
					riverFlowStateSet( 'slow' );
					workingSet( false );
					openUndoOption();
					// pass === false && unlock();
				  document.getElementById('lookup').focus();
			  }else{
			    toast.error(Pref.blocked);
			  }
			});
    }
  }

  //// Action for marking the board as complete
	function finish() {
		if(lockState === true) { return false; }
	  lockSet( true );
	  riverFlowStateSet( false );
	  workingSet( true );
	  
    const batchId = id;

    const pre = progCounts;
    const preTotal = pre.regItems;
    const preStep = pre.regStepData.find( x => x.key === sKey );
    const preCount = preStep ? preStep.items : undefined;
    const benchmark = preCount === 0 ? 'first' : preCount === preTotal - 1 ? 'last' : false;              

		Meteor.call('finishItem', batchId, barcode, sKey, step, type, benchmark, (error, reply)=>{
		  if(error)
		    console.log(error);
		  if(reply === true) {
		  	//riverFlowStateSet( 'slow' );
		  	//workingSet( false );
		    document.getElementById('lookup').focus();
		  }else{
		    toast.error(Pref.blocked);
		  }
		});
	}
	
	function handleStepUndo() {
		Meteor.call('popHistory', id, barcode, ()=>{
			closeUndoOption();
		});
	}
	

	let shape = '';
	let ripple = '';
	
	let prepend = type === 'build' || type === 'first' ?
	              <label className='big'>{type}<br /></label> : null;
	let apend = type === 'inspect' ?
	              <label className='big'><br />{type}</label> : null;

	//// Style the Stone Accordingly \\\\
	if(type === 'first'){
		shape = 'stone iFirst';
		ripple = ()=>reveal();
	}else if(type === 'inspect'){
		shape = 'stone iCheck';
		ripple = ()=>passS(true, false);
  }else if(type === 'build'){
		shape = 'stone iBuild';
		ripple = ()=>passS(true, false);
  }else if(type === 'checkpoint'){
		shape = 'stone iPoint';
		ripple = ()=>passS(true, false);
  }else if(type === 'test'){
		shape = 'crackedTop iTest';
		ripple = ()=>passT(true, false, false);
  }else if(type === 'finish'){
		shape = 'stone iFinish';
		ripple = ()=>finish();
  }else{
    null }
    
  const topClass = doneStone ? 'doneStoneMask' :
  								 blockStone ? 'blockStone' : '';
  const topTitle = topClass !== '' ? Pref.stoneislocked : '';
	
  return(
   	<div className='noCopy'>
  		<div className={topClass + ' stoneFrame'} title={topTitle}>
      	<StoneProgRing
  				serial={barcode}
  				allItems={allItems}
  				isAlt={isAlt}
  				hasAlt={hasAlt}
  				sKey={sKey}
          step={step}
          type={type}
          progCounts={progCounts}
          workingState={workingState}>
						{type === 'test' ?
							<div className='centre stone'>
								<button
				      	  className={shape}
				  				name={step + ' pass'}
				  				id='stonepassButton'
				  				onClick={ripple}
				  				tabIndex={-1}
				  				disabled={lockState}>
				  				Pass
				  				<label className=''><br />{step}</label>
								</button>
								<button
				      	  className='crackedBot'
				  				name={step + ' fail'}
				  				id='stonefailButton'
				  				onClick={()=>passT(false, true, false)}
				  				tabIndex={-1}
				  				disabled={lockState}>
				  				Fail
				  				<label className=''><br />{step}</label>
								</button>
							</div>
						:
							<div className='centre'>
				      	<button
				      	  className={shape}
				  				name={step}
				  				id='stoneButton'
				  				onClick={ripple}
				  				tabIndex={-1}
				  				disabled={lockState}>
				  				{prepend}
									<i>{step}</i>
									{apend}
								</button>
							</div>
						}
				</StoneProgRing>
			</div>
			<div className='stoneBase'>
				<div className='undoStepWrap centre'>
					{undoOption ? 
						<button
							className='textAction'
							onClick={(e)=>handleStepUndo(e)}
						>undo</button> 
					: null}
				</div>
				{type === 'first' || type === 'finish' ? null :
					<ContextMenuTrigger
						id={barcode}
						attributes={ {className:'moreStepAction centre'} }
						disable={!currentLive }
						holdToDisplay={1}
            renderTag='div'>
            <i className='fas fa-comment fa-fw fa-lg'></i>
					</ContextMenuTrigger>
				}
	        <ContextMenu id={barcode}>
	          <MenuItem onClick={()=>passS(true, true)} disabled={lockState}>
	            Pass with Comment
	          </MenuItem>
          {type === 'test' ?
	          <MenuItem onClick={()=>passT(true, true, true)} disabled={lockState}>
	            Ship a Failed Test
	          </MenuItem>
          :null}
        </ContextMenu>
    	</div>
    </div>
  );
};

function areEqual(prevProps, nextProps) {
	if(
		prevProps.currentLive !== nextProps.currentLive ||
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

export default React.memo(Stone, areEqual);