import React from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
import StoneProgRing from './StoneProgRing.jsx';


const StoneFinish = ({ 
	id, barcode, sKey, step, type,
	progCounts, 
	lockout, 
	topClass, topTitle,
	
	allItems, isAlt, hasAlt,
	
	enactEntry,
	resolveEntry,
	workingState
})=> { 
	
  //// Action for marking the board as complete
	function finish() {
		enactEntry();
	  
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
				resolveEntry();
			}else{
		    toast.error('server error');
		  }
		});
	}
    
  return(
		<div className={topClass + ' stoneFrame noCopy'} title={topTitle}>
    	<StoneProgRing
				serial={barcode}
				allItems={allItems}
				isAlt={isAlt}
				hasAlt={hasAlt}
				sKey={sKey}
        step={step}
        type={type}
        progCounts={progCounts}
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