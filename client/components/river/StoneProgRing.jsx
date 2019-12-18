import React, { useState, useEffect } from 'react';
import { VictoryPie } from 'victory';

const StoneProgRing = ({ sKey, step, type, progCounts, isAlt, workingState, children })=> {
  
  const [ countDone, doneSet ] = useState(0);
  const [ countRemain, remainSet ] = useState(0);
  
  function count() {
    const pre = progCounts;
    let preFetch = false;
    
    if(!pre || type === 'first') {
      null;
    }else{
      const preTotal = isAlt ?
                        pre.altItems :
                        pre.regItems;
      const preCount = isAlt ?
                        pre.altStepData.find( x => x.key === sKey ) :
                        pre.regStepData.find( x => x.key === sKey );
      const preDoneNum = preCount ? preCount.items : 0;
      const preRemain = preTotal - preDoneNum;
      preFetch = {preDoneNum, preRemain};
 
      doneSet( preFetch.preDoneNum );
      remainSet( preFetch.preRemain );
    }
  }
  
  useEffect( ()=>{
    count();
  }, [sKey, progCounts]);
    
  if(type === 'first') {
    return(
      <span className='stoneRing centre'>
        <div>
          {children}
        </div>
      </span>
    );
  }
    
    const color0 = 'rgb(60,60,60)';
    const color1 =
      type === 'build' ? 'rgb(41, 128, 185)' :
      type === 'checkpoint' ? 'rgb(127, 140, 141)' :
      type === 'test' ? 'rgb(22, 160, 133)' :
      type === 'finish' ? 'rgb(142, 68, 173)' :
      'rgb(39, 174, 96)';
    
  return(
    <span className={`stoneRing centre ${workingState ? 'spinOuterSVG' : ''}`}>
      <VictoryPie
        colorScale={ [ color1, color0 ] }
        padAngle={0}
        padding={0}
        innerRadius={190}
        data={ [ countDone, countRemain ] }
        labels={(l)=>null}
      />
      <span className='pieCore numFont'>{children}</span> 
    </span>
  );
};

export default StoneProgRing;