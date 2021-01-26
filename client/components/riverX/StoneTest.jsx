import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
// import Pref from '/client/global/pref.js';
import StoneProgRing from './StoneProgRing.jsx';

const StoneTest = ({ 
	id, barcode, sKey, step, type, 
	flowCounts, 
	lockout,
	topClass, topTitle,
	
	allItems, isAlt, hasAlt,
	
	enactEntry,
	resolveEntry,
	workingState,
	tryagainEntry
})=> { 
	
  //// Action for test step
  function passT(pass, doComm, shipFail) {
	  enactEntry();
    
    let comm = '';
    let comPrompt = doComm ? prompt('Enter A Comment', '') : false;
    comPrompt ? comm = comPrompt : null;
    
    const more = shipFail ? 'ship a failed test' : false;
    
    const pre = flowCounts;
    const preTotal = pre.regItems;
    const preStep = pre.regStepData.find( x => x.key === sKey );
    const preCount = preStep ? preStep.items : undefined;
    const benchmark = preCount === 0 ? 'first' : preCount === preTotal - 1 ? 'last' : false;              
		
    if(pass === false && ( !comm || comm == '' ) ) {
    	tryagainEntry();
    }else{
			Meteor.call('addTest', 
				id, barcode, sKey, step, type,
				comm, pass, more, benchmark, 
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
  }
  
  return(
   	<Fragment>
  		<div className={topClass + ' stoneFrame noCopy'} title={topTitle}>
      	<StoneProgRing
  				serial={barcode}
  				allItems={allItems}
  				isAlt={isAlt}
  				hasAlt={hasAlt}
  				sKey={sKey}
          step={step}
          type={type}
          flowCounts={flowCounts}
          workingState={workingState}
          lockout={lockout}
        >
					<div className='centre'>
						<button
		      	  className='crackedTop iTest'
		  				name={step + ' pass'}
		  				id='stonepassButton'
		  				onClick={()=>passT(true, false, false)}
		  				tabIndex={-1}
		  				disabled={lockout}>
		  				Pass
		  				<label className=''><br />{step}</label>
						</button>
						<button
		      	  className='crackedBot'
		  				name={step + ' fail'}
		  				id='stonefailButton'
		  				onClick={()=>passT(false, true, false)}
		  				tabIndex={-1}
		  				disabled={lockout}>
		  				Fail
		  				<label className=''><br />{step}</label>
						</button>
					</div>
				</StoneProgRing>
			</div>
			<div className='stoneBase'>
				{type === 'first' || type === 'finish' ? null :
					<ContextMenuTrigger
						id={barcode}
						attributes={ {className:'moreStepAction centre'} }
						holdToDisplay={1}
            renderTag='div'>
            <i className='fas fa-comment fa-fw fa-lg'></i>
					</ContextMenuTrigger>
				}
	        <ContextMenu id={barcode}>
	          <MenuItem onClick={()=>passT(true, true)} disabled={lockout}>
	            Pass with Comment
	          </MenuItem>
	          <MenuItem onClick={()=>passT(true, true, true)} disabled={lockout}>
	            Ship a Failed Test
	          </MenuItem>
        </ContextMenu>
    	</div>
    </Fragment>
  );
};

export default StoneTest;