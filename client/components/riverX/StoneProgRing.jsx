import React, { useState, useEffect } from 'react';
import { VictoryPie } from 'victory';

import AnimateOnChange from 'react-animate-on-change';

const StoneProgRing = ({ 
  sKey, type, 
  flowCounts,
  workingState, lockout,
  children
})=> {
  
  const [ countDone, doneSet ] = useState(0);
  const [ countRemain, remainSet ] = useState(0);
  
  function count() {
    const pre = flowCounts;
    let preFetch = false;
    
    if(!pre) {
      null;
    }else{
      const preTotal = pre.liveItems;
      const preCount = pre.riverProg.find( x => x.key === sKey );
      const preDoneNum = preCount ? preCount.items : 0;
      const preRemain = preTotal - preDoneNum;
      preFetch = {preDoneNum, preRemain};
 
      doneSet( preFetch.preDoneNum );
      remainSet( preFetch.preRemain );
    }
  }
  
  useEffect( ()=>{
    count();
  }, [sKey, flowCounts]);
    
  const color0 = 'rgb(40,40,40)';
  const color1 =
    type === 'build' ? 'rgb(41, 128, 185)' :
    type === 'test' ? 'rgb(22, 160, 133)' :
    type === 'checkpoint' ? 'rgb(142, 68, 173)' :
    type === 'finish' ? 'rgb(142, 68, 173)' :
    'rgb(39, 174, 96)';
    
  return(
    <AnimateOnChange
  		customTag='span'
	    baseClassName={`stoneRing centre ${workingState ? 'spinOuterSVG' : ''}`}
	    animationClassName="shaker-change"
	    animate={lockout === true}
	  >
      <VictoryPie
        colorScale={ [ color1, color0 ] }
        padAngle={0}
        padding={0}
        innerRadius={190}
        data={ [ countDone, countRemain ] }
        labels={(l)=>null}
      />
      <span className='pieCore numFont'>{children}</span> 
    </AnimateOnChange>
  );
};

export default StoneProgRing;