import React from 'react';
import AnimateOnChange from 'react-animate-on-change';

const StoneVerify = ({ 
	sKey, step, type, 
	lockout, 
	topClass, topTitle,
	handleVerify
})=> { 
  
  function reveal() {
    handleVerify(sKey, true);
  }
  
  let svar = {
  	'--high-color': 'var(--peterriver)',
  	'--stoneback': 'var(--belizeHole)',
  	'--stoneborder': 'var(--belizeHole)',
  };
  
  let sstyle = {
	  'backgroundImage': 'url(first.svg)'
	};
	
  return(
		<div className={topClass + ' stoneFrame noCopy'} style={svar} title={topTitle}>
    	<AnimateOnChange
    		customTag='span'
		    baseClassName='stoneRing centre'
		    animationClassName="blur-change"
		    animate={lockout === true}
		  >
        <div>
					<div className='centre'>
		      	<button
		      	  className='stone'
		      	  style={sstyle}
		  				name={step}
		  				id='stoneButton'
		  				onClick={()=>reveal()}
		  				tabIndex={-1}
		  				disabled={lockout}>
		  				<label>{type}</label>
							<i>{step}</i>
						</button>
					</div>
        </div>
      </AnimateOnChange>
		</div>
  );
};

export default StoneVerify;