import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import StoneProgRing from './StoneProgRing.jsx';

const StoneTest = ({ 
	batchId,
	seriesId, barcode, sKey, step, type, 
	flowCounts, benchmark,
	lockout,
	topClass, topTitle,
	
	allItems,
	
	enactEntry,
	resolveEntry,
	workingState,
	tryagainEntry,
	commTrigger, commTxtState
})=> { 
	
	const [ failing, failingSet ] = useState(false);
	
	function passF() {
		failingSet(true);
		commTrigger(true);
		
		passT(false, false);
	}

  function passT(pass, shipFail) {
    
    let comm = commTxtState;
    
    if(( shipFail || !pass ) && comm.trim() === "") {
    	var element = document.getElementById("stoneCommField");
    	element ? element.reportValidity() : null;
    }else{
    
    	enactEntry();
    	failingSet(false);
    	
    	const more = shipFail ? 'ship a failed test' : false;

			Meteor.call('addTestX', 
				batchId, seriesId, barcode, sKey, step, type,
				comm, pass, more, benchmark, 
			(error, reply)=>{
		    if(error) {
			    console.log(error);
			    toast.error('Server Error');
		    }
				if(reply === true) {
					!pass ? tryagainEntry() : resolveEntry();
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
		  				onClick={()=>passT(true, false)}
		  				tabIndex={-1}
		  				disabled={lockout}>
		  				<label>Pass<br />{step}</label>
						</button>
						<button
		      	  className={`crackedBot ${failing ? 'fail2step' : ''}`}
		  				name={step + ' fail'}
		  				id='stonefailButton'
		  				onClick={()=>passF(false, false)}
		  				tabIndex={-1}
		  				disabled={lockout}>
		  				<label>Fail<br />{step}</label>
						</button>
					</div>
				</StoneProgRing>
			</div>
			
			{failing &&
				<button
      	  className='crackedBot stoneExtra'
  				name={step + ' bypass'}
  				id='stonebypassButton'
  				onClick={()=>passT(true, true)}
  				tabIndex={-1}
  				disabled={lockout}>
  				<label className=''>Bypass Failed Test</label>
				</button>
			}
    </Fragment>
  );
};

export default StoneTest;