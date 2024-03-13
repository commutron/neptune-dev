import React, { useState, useLayoutEffect } from 'react';
import AnimateOnChange from 'react-animate-on-change';

const StoneProgRing = ({ 
  sKey, 
  flowCounts,
  workingState, lockout,
  children
})=> {
  
  const [ done, doneSet ] = useState("0%");
  
  useLayoutEffect( ()=>{
    const pre = flowCounts;
    
    if(!pre) {
      null;
    }else{
      const preTotal = pre.liveItems;
      const preCount = pre.riverProg.find( x => x.key === sKey )?.items || 0;
      
      const perOf = ( preCount / preTotal ) * 100;
      
      doneSet( perOf + '%' );
    }
  }, [sKey, flowCounts]);
    
  return(
    <AnimateOnChange
  		customTag='span'
	    baseClassName={`stoneRing centre ${workingState ? 'spinOuterSVG' : ''}`}
	    animationClassName="shaker-change"
	    animate={lockout === true}
	  >
	    <div className='cssProgRing' style={{'--stonePercent': done}}>
        <span className='cssProgCore numFont'>{children}</span> 
      </div>
    </AnimateOnChange>
  );
};

export default StoneProgRing;