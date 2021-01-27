import React , { Fragment } from 'react';
import { toast } from 'react-toastify';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import StoneProgRing from './StoneProgRing.jsx';

	
const StoneReg = ({ 
	batchId,
	seriesId, barcode, sKey, step, type, 
	flowCounts, benchmark,
	lockout, 
	topClass, topTitle,
	
	allItems,// isAlt, hasAlt,
	
	enactEntry,
	resolveEntry,
	workingState
})=> { 
	
	//// Action for standard step
  function passS(pass, doComm) {
	  enactEntry();
		
    let comm = '';
    let comPrompt = doComm ? prompt('Enter A Comment', '') : false;
    comPrompt ? comm = comPrompt : null;
    // if(doComm && !comPrompt) { unlock(); return false; }
    
		Meteor.call('addHistoryX', batchId, seriesId, barcode, sKey, step, type, comm, pass, benchmark, 
			(error, reply)=>{
	    if(error) {
		    console.log(error);
		    toast.error('Server Error');
			}	
			if(reply === true) {
				resolveEntry();
			}else{
		    toast.warning('Insufficient Permissions');
		  }
		});
  }
  
	let shape = '';
	
	//// Style the Stone Accordingly \\\\
	if(type === 'inspect'){
		shape = 'stone iCheck';
  }else if(type === 'build'){
		shape = 'stone iBuild';
  }else if(type === 'checkpoint'){
		shape = 'stone iPoint';
  }else{
    null }
    
	let prepend = type === 'build' ?
	              <label className='big'>{type}<br /></label> : null;
	let apend = type === 'inspect' ?
	              <label className='big'><br />{type}</label> : null;
	
  return(
   	<Fragment>
  		<div className={topClass + ' stoneFrame noCopy'} title={topTitle}>
      	<StoneProgRing
  				serial={barcode}
  				allItems={allItems}
  				// isAlt={isAlt}
  				// hasAlt={hasAlt}
  				sKey={sKey}
          step={step}
          type={type}
          flowCounts={flowCounts}
          workingState={workingState}
          lockout={lockout}
        >
	      	<button
	      	  className={shape}
	  				name={step}
	  				id='stoneButton'
	  				onClick={()=>passS(true, false)}
	  				tabIndex={-1}
	  				disabled={lockout}>
	  				{prepend}
						<i>{step}</i>
						{apend}
					</button>
				</StoneProgRing>
			</div>
			<div className='stoneBase'>
				<ContextMenuTrigger
					id={barcode}
					attributes={ {className:'moreStepAction centre'} }
					holdToDisplay={1}
          renderTag='div'>
          <i className='fas fa-comment fa-fw fa-lg'></i>
				</ContextMenuTrigger>
        <ContextMenu id={barcode}>
          <MenuItem onClick={()=>passS(true, true)} disabled={lockout}>
            Pass with Comment
          </MenuItem>
        </ContextMenu>
    	</div>
    </Fragment>
  );
};

export default StoneReg;