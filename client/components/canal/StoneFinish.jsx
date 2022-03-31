import React from 'react';
import { toast } from 'react-toastify';
import StoneProgRing from './StoneProgRing.jsx';

const StoneFinish = ({ 
	batchId,
	seriesId, serial, sKey, step, type, 
	rapIs, rarapid,
	flowCounts, benchmark,
	lockout, 
	topClass, topTitle,
	
	allItems,
	
	enactEntry,
	resolveEntry,
	workingState,
	commTxtState
})=> { 
	
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
			  if(reply === true) {
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
			  if(reply === true) {
					resolveEntry();
				}else{
					toast.warning('Insufficient Permissions');
			  }
			});
		}
	}
    
  return(
		<div className={topClass + ' stoneFrame noCopy'} title={topTitle}>
    	<StoneProgRing
				serial={serial}
				allItems={allItems}
				sKey={sKey}
        step={step}
        type={type}
        flowCounts={flowCounts}
        workingState={workingState}
        lockout={lockout}
      >
      	<button
      	  className='stone iFinish'
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