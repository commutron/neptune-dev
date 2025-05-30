import React from 'react';
import { toast } from 'react-toastify';

const StoneFinish = ({ 
	batchId,
	seriesId, serial, sKey, step, type, 
	rapIs, rarapid,
	benchmark,
	lockout, 
	topClass, topTitle,
	
	enactEntry,
	resolveEntry,
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
		</div>
  );
};

export default StoneFinish;