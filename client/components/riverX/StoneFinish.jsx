import React from 'react';
import { toast } from 'react-toastify';
// import Pref from '/client/global/pref.js';
import StoneProgRing from './StoneProgRing.jsx';


const StoneFinish = ({ 
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
	
  //// Action for marking the board as complete
	function finish() {
		enactEntry();

		Meteor.call('finishItemX', batchId, seriesId, barcode, sKey, step, type, benchmark, 
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
      	  className='stone iFinish'
  				name={step}
  				id='stoneButton'
  				onClick={()=>finish()}
  				tabIndex={-1}
  				disabled={lockout}>
					<i>{step}</i>
				</button>
			</StoneProgRing>
		</div>
  );
};

export default StoneFinish;