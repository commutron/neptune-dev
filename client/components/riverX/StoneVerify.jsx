import React from 'react';
//import Pref from '/client/global/pref.js';
import AnimateOnChange from 'react-animate-on-change';

const StoneVerify = ({ 
	// batchId, seriesId, barcode,
	sKey, step, type, 
	lockout, 
	topClass, topTitle,
	
	handleVerify
})=> { 
  
  function reveal() {
    handleVerify(sKey, true);
  }
	
	let prepend = <label className='big'>{type}<br /></label>;
	
  return(
		<div className={topClass + ' stoneFrame noCopy'} title={topTitle}>
    	<AnimateOnChange
    		customTag='span'
		    baseClassName='stoneRing centre'
		    animationClassName="blur-change"
		    animate={lockout === true}
		  >
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
      </AnimateOnChange>
		</div>
  );
};

export default StoneVerify;