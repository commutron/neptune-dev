import React from 'react';
import { toast } from 'react-toastify';

import StoneProgRing from './StoneProgRing';
	
const StoneReg = ({ 
	batchId,
	seriesId, barcode, sKey, step, type, 
	flowCounts, benchmark,
	lockout, 
	topClass, topTitle,
	
	enactEntry,
	resolveEntry,
	workingState,
	commTxtState
})=> { 
	
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
  
  let svar = {
  	build: {
		  '--high-color': 'var(--peterriver)',
		  '--stoneborder': 'var(--belizeHole)',
		  '--stoneback': 'transparent'
		},
		inspect: {
		  '--high-color': 'var(--emerald)',
		  '--stoneborder': 'var(--nephritis)',
		  '--stoneback': 'var(--nephritis)'
		},
	  checkpoint: {
  		'--high-color': 'var(--amethystfade)',
  		'--stoneborder': 'var(--wisteria)',
  		'--stoneback': 'transparent'
		}
  };
  
  let sstyle = {
  	build: {
		  'backgroundImage': 'url(build.svg)',
		},
		inspect: {
		  'backgroundImage': 'url(inspect.svg)'
		},
	  checkpoint: {
			'backgroundImage': 'url(first.svg)'
		}
  };
    
	let prepend = type === 'build' ? <label>{type}</label> : null;
	let apend = type === 'inspect' ? <label>{type}</label> : null;
	
  return(
		<div className={topClass + ' stoneFrame noCopy'} style={svar[type]} title={topTitle}>
    	<StoneProgRing
				sKey={sKey}
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