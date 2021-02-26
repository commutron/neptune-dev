import React from 'react';
import { toast } from 'react-toastify';
// import Pref from '/client/global/pref.js';
import StoneProgRing from './StoneProgRing.jsx';


const StoneFinish = ({ 
	batchId,
	seriesId, serial, sKey, step, type, rapIs, rarapid,
	flowCounts, benchmark,
	lockout, 
	topClass, topTitle,
	
	allItems,
	
	enactEntry,
	resolveEntry,
	workingState
})=> { 
	
  //// Action for marking the board as complete
	function finish() {
		enactEntry();

		if(rapIs) {
			Meteor.call('finishItemRapid', seriesId, serial, sKey, step, type, rapIs.rapId, 
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
			Meteor.call('finishItemX', batchId, seriesId, serial, sKey, step, type, benchmark, 
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
					<i>{rarapid ? `${step} ${rarapid}` : step }</i>
				</button>
			</StoneProgRing>
		</div>
  );
};

export default StoneFinish;