import React from 'react';
import { toast } from 'react-toastify';

import StoneProgRing from './StoneProgRing';
	
const StoneReg = ({ 
	batchId,
	seriesId, barcode, sKey, step, type, 
	flowCounts, benchmark,
	lockout, 
	topClass, topTitle,
	
	allItems,// isAlt, hasAlt,
	
	enactEntry,
	resolveEntry,
	workingState,
	commTxtState
})=> { 
	
	//// Action for standard step
  function passS(pass) {
	  enactEntry();
    let comm = commTxtState;
   
		Meteor.call('addHistoryX', batchId, seriesId, barcode,
			sKey, step, type, comm, pass, benchmark, 
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
  
  let sstyle = {
  	build: {
		  'backgroundImage': 'url(build.svg)',
		  'backgroundColor': 'transparent',
		  'borderColor': 'var(--belizeHole)',
		  '--high-color': 'var(--peterriver)'
		},
		inspect: {
		  'backgroundImage': 'url(inspect.svg)',
		  'backgroundColor': 'var(--nephritis)',
		  '--high-color': 'var(--emerald)'
		},
	  checkpoint: {
			'backgroundImage': 'url(first.svg)',
  		'backgroundColor': 'transparent',
  		'borderColor': 'var(--wisteria)',
  		'--high-color': 'var(--amethystfade)'
		}
  };
    
	let prepend = type === 'build' ? <label>{type}</label> : null;
	let apend = type === 'inspect' ? <label>{type}</label> : null;
	
  return(
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
      	  className='stone'
      	  style={sstyle[type]}
  				name={step}
  				id='stoneButton'
  				onClick={()=>passS(true)}
  				tabIndex={-1}
  				disabled={lockout}>
  				{prepend}
					<i>{step}</i>
					{apend}
				</button>
			</StoneProgRing>
		</div>
  );
};

export default StoneReg;