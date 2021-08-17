import React, { useState, useEffect } from 'react';

import { cyclyPaceCalc } from '/client/utility/CycleCalc.js';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import CyclePaceTable from '/client/components/tables/CyclePaceTable';


const TimeCycleChunk = ({ batchData, seriesData, isDebug })=> {
  
  const [ range, rangeSet ] = useState(false);
  const [ stepCycleTimes, stepCycleTimesSet ] = useState(false);
  const [ fallCycleTimes, fallCycleTimesSet ] = useState(false);
  
  useEffect( ()=>{
    
    if(seriesData) {
      
      let historyFlat = [];
      for( let i of seriesData.items ) { 
        for( let h of i.history ) {
          if(h.good === true && 
             h.type !== 'first' && 
             h.type !== 'scrap' && 
             h.type !== 'undo'
          ) {
            historyFlat.push( h );
          }
        }
      }
      const historyFlatS = historyFlat.sort( (a, b)=> 
                            a.time > b.time ? 1 : a.time < b.time ? -1 : 0 );
      
      const chunkedStepTypes = _.groupBy(historyFlatS, (e)=> e.step + ' ' + e.type);
      
      let stepCycles = cyclyPaceCalc( chunkedStepTypes, range, isDebug );
      
      stepCycleTimesSet(stepCycles);
    }else{
      stepCycleTimesSet(null);
    }
    
      let waterfallFlat = [];
      for( let f of batchData.waterfall ) {
        for( let c of f.counts ) { 
          if(c.tick > 0) {
            waterfallFlat.push({
              type: f.gate + ' ' + f.type,
              time: c.time,
              who: c.who
            });
          }
        }
      }
      const waterfallFlatS = waterfallFlat.sort( (a, b)=> 
                            a.time > b.time ? 1 : a.time < b.time ? -1 : 0 );
      
      const chunkedFallTypes = _.groupBy(waterfallFlatS, (e)=> e.type );
      
      let fallCycles = cyclyPaceCalc( chunkedFallTypes, range, isDebug );
      
      fallCycleTimesSet(fallCycles);
    
  }, [range]);
  
  
  return(
    <div className='cardSelf dropCeiling'>
      <div className='rowWrap'>
        {stepCycleTimes === false || fallCycleTimes === false ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='gapL centre centreText'>
          <i className='medBig bold margin5'>Cycle Time</i>
          <i className='small'>In Minutes:Seconds</i>
        </span>
        
        <span className='flexSpace' />
        
        <span className='centre'>
          <ToggleSwitch 
            tggID='toggleRange'
            toggleLeft='Standard Deviation'
            toggleRight='Order of Magnitude'
            toggleVal={range}
            toggleSet={rangeSet}
          />
          <small>Sample Range</small>
        </span>
      </div>
      
      <CyclePaceTable
        stepTimes={stepCycleTimes}
        fallTimes={fallCycleTimes}
      />
      
      <details className='footnotes grayT small'>
        <summary>Calculation Details</summary>
        <p className='footnote'
          >Cycle times are calculated first per person then all people are averaged.
        </p>
        <p className='footnote'
          >Ideal for each person is determined by their top 10% fastest cycles.
        </p>
        <p className='footnote'
          >Par for each person is determined by their slowest ideal cycle.
        </p>
        <p className='footnote'
          >Standard Deviation is a range of 3x par.
        </p>
        <p className='footnote'
          >Order of Magnitude is a range of 10x par.
        </p>
      </details>
      
    </div>
  );
};

export default TimeCycleChunk;