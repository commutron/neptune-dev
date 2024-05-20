import React, { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import StoneProgRing from './StoneProgRing';

const StoneFinish = ({ 
	batchId,
	seriesId, serial, sKey, step, type, 
	rapIs, rarapid,
	flowCounts, benchmark,
	lockout, 
	topClass, topTitle,
	
	enactEntry,
	resolveEntry,
	workingState,
	commTxtState
})=> { 
	
	const mounted = useRef(true);
	
	useEffect(() => {
    return () => { 
      mounted.current = false;
    };
  }, []);
  
	function finish() {
		enactEntry();
		const comm = commTxtState;

		if(rapIs) {
			Meteor.call('finishItemRapid', seriesId, serial, sKey, step, type, comm, rapIs.rapId, 
				(error, reply)=>{
			  if(error) {
			    console.log(error);
			    toast.error('Server Error');
				}
			  if(reply === true && mounted.current) {
					resolveEntry();
				}else{
					toast.warning('Insufficient Permissions');
			  }
			});
		}else{
			Meteor.call('finishItemX', batchId, seriesId, serial, sKey, step, type, comm, benchmark, 
				(error, reply)=>{
			  if(error) {
			    console.log(error);
			    toast.error('Server Error');
				}
			  if(reply === true && mounted.current) {
					resolveEntry();
				}else{
					toast.warning('Insufficient Permissions');
			  }
			});
		}
	}
	
	let svar = {
		'--high-color': 'var(--amethyst)',
		'--stoneback': 'var(--wisteria)',
		'--stoneborder': 'var(--wisteria)'
	};
		
	let sstyle = {
	  'backgroundImage': 'url(fin.svg)',
	};
    
  return(
		<div className={topClass + ' stoneFrame noCopy'} style={svar} title={topTitle}>
    	<StoneProgRing
				sKey={sKey}
        flowCounts={flowCounts}
        workingState={workingState}
        lockout={lockout}
      >
      	<button
      	  className='stone'
      	  style={sstyle}
      	  name={rapIs ? `${step} Extension` : step }
  				id='stoneButton'
  				onClick={()=>finish()}
  				tabIndex={-1}
  				disabled={lockout}>
					<i>{rapIs && rarapid ? `${step} ${rarapid}` : step }</i>
					{type !== step && <label>{type}</label>}
				</button>
			</StoneProgRing>
		</div>
  );
};

export default StoneFinish;