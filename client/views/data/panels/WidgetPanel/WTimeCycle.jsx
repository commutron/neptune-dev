import React, { useState, useEffect, useRef } from 'react';
import Pref from '/client/global/pref.js';

import { FilterSelect } from '/client/components/smallUi/ToolBarTools';
import { cyclyPaceCalc } from '/client/utility/CycleCalc.js';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import CyclePaceTable from '/client/components/tables/CyclePaceTable';


const WTimeCycle = ({ wID, app })=> {
  
  const mounted = useRef(true);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const [ fList, fListSet ] = useState([]);
  const [ typeState, typeSet ] = useState(false);
  const [ range, rangeSet ] = useState(false);
  const [ serverData, serverDataSet ] = useState(false);
  const [ stepCycleTimes, stepCycleTimesSet ] = useState(false);
  const [ fallCycleTimes, fallCycleTimesSet ] = useState(false);
  
  useEffect( ()=>{
    const tList = _.uniq( Array.from(app.trackOption, o =>
                          o.type !== 'first' && 
                          o.type !== 'scrap' && 
                          o.type !== 'undo' ? 
                          [ o.key, o.step + ' ' + o.type ] : false )
                  );
                
    const cList = _.uniq( Array.from(app.countOption, o => 
                          [ o.key, o.gate + ' ' + o.type + ' (count)' ] ) );
                
    fListSet( [...tList, ...cList]
                .filter(f=>f)
                  .sort((a,b)=> 
                    a[1].toLowerCase() > b[1].toLowerCase() ? 1 :
                    a[1].toLowerCase() < b[1].toLowerCase() ? -1 : 0
                  )
            );
  }, []);
  
  useEffect( ()=>{
    if(typeState) {
      Meteor.call('countMultiBatchCycleTimes', wID, typeState, (err, reply)=>{
        err && console.log(err);
        if(reply && mounted.current) {
          serverDataSet(reply);
        }
      });
    }
  }, [typeState]);
  
  useEffect( ()=>{
    if(serverData) {
      const chunkedStepTypes = JSON.parse(serverData[0]);
      const stepCycles = cyclyPaceCalc( chunkedStepTypes, range, 1 );
      stepCycleTimesSet(stepCycles);
          
      const chunkedFallTypes = JSON.parse(serverData[1]);
      const fallCycles = cyclyPaceCalc( chunkedFallTypes, range, 2 );
      fallCycleTimesSet(fallCycles);
    }
  }, [serverData, range]);
  
  
  return(
    <div className='cardSelf dropCeiling'>
      <div className='centreRow'>
        {serverData === false && typeState !== false ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='gapL centre centreText'>
          <i className='medBig bold margin5'>Cycle Time</i>
          <i className='small'>In Minutes</i>
        </span>
        
        <span className='flexSpace' />
        
        <FilterSelect
          unqID='fltrTYPE'
          title='Filter Step'
          selectList={fList}
          selectState={typeState}
          falsey=''
          changeFunc={(e)=>typeSet(e.target.value)}
          extraClass='miniIn24'
        />
        
        <span className='centre'>
          <ToggleSwitch 
            tggID='toggleRange'
            toggleLeft='Standard Deviation'
            toggleRight='Order of Magnitude'
            toggleVal={range}
            toggleSet={rangeSet}
          />
          <i className='small'>Sample Range</i>
        </span>
      </div>
      
      <CyclePaceTable
        stepTimes={stepCycleTimes}
        fallTimes={fallCycleTimes}
      />
      
      <details className='footnotes grayT small'>
        <summary>Calculation Details</summary>
        <p className='footnote'
          >Cycle times are calculated first per person then all {Pref.xBatchs} and people are averaged.
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

export default WTimeCycle;