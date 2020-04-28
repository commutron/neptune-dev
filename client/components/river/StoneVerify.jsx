import React, { Fragment } from 'react';
//import Pref from '/client/global/pref.js';


const StoneVerify = ({ 
	key, id, barcode, sKey, step, type, 
	lockout, 
	topClass, topTitle,
	
	handleVerify,
	
	handleStepUndo,
	undoOption
})=> { 
  
  function reveal() {
    handleVerify(sKey, true);
  }
	
	let prepend = <label className='big'>{type}<br /></label>;

  return(
   	<Fragment>
  		<div className={topClass + ' stoneFrame noCopy'} title={topTitle}>
      	<span className='stoneRing centre'>
	        <div>
						<div className='centre'>
			      	<button
			      	  className='stone iFirst'
			  				name={step}
			  				id='stoneButton'
			  				onClick={()=>reveal()}
			  				tabIndex={-1}
			  				disabled={lockout}>
			  				{prepend}
								<i>{step}</i>
							</button>
						</div>
	        </div>
	      </span>
			</div>
			<div className='undoStepWrap centre'>
				{undoOption ? 
					<button
						className='textAction'
						onClick={(e)=>handleStepUndo(e)}
					>undo</button> 
				: null}
			</div>
    </Fragment>
  );
};

export default StoneVerify;