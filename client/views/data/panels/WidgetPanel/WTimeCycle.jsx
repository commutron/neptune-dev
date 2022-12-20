import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { FilterSelect, YearSelect } from '/client/components/smallUi/ToolBarTools';
import { cyclyPaceCalc } from '/client/utility/CycleCalc.js';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import CyclePaceTable from '/client/components/tables/CyclePaceTable';


const WTimeCycle = ({ wID, flows, app })=> {
  
  const mounted = useRef(true);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const [ fsList, fsListSet ] = useState([]);
  const [ fcList, fcListSet ] = useState([]);
  const [ typeState, typeSet ] = useState(false);
  const [ yList, yListSet ] = useState([]);
  const [ yearState, yearSet ] = useState(false);
  const [ range, rangeSet ] = useState(false);
  
  const [ serverData, serverDataSet ] = useState(false);
  const [ stepCycleTimes, stepCycleTimesSet ] = useState(false);
  const [ fallCycleTimes, fallCycleTimesSet ] = useState(false);
  
  useEffect( ()=>{
    const years = Math.ceil( moment().diff(moment(app.createdAt), 'years', true) );
    let yearsList = [];
    for(let tick = 0; tick < years; tick++) {
      yearsList.push( moment().subtract(tick, 'years').year() );
    }
    yListSet(yearsList);
    
    const usedOps = flows.map( (f)=> f.flow ).flat();
    const tList = _.uniq( Array.from(usedOps, o =>
                          o.type !== 'first' && 
                          o.type !== 'scrap' && 
                          o.type !== 'undo' ? 
                          [ o.key, o.step + ' ' + o.type ] : false )
                  );
                
    fsListSet( _.uniq( 
                [...tList, [ app.lastTrack.key, 'Finish (All Types)' ]]
                  .filter(f=>f)
                    .sort((a,b)=> 
                      a[1].toLowerCase() > b[1].toLowerCase() ? 1 :
                      a[1].toLowerCase() < b[1].toLowerCase() ? -1 : 0
                    ),
              true, x => x[0])
            );
    
    const cList = _.uniq( Array.from(app.countOption, o => 
                          [ o.key, o.gate + ' ' + o.type ] ) );
    
    fcListSet( _.uniq( 
                cList
                  .filter(f=>f)
                    .sort((a,b)=> 
                      a[1].toLowerCase() > b[1].toLowerCase() ? 1 :
                      a[1].toLowerCase() < b[1].toLowerCase() ? -1 : 0
                    ),
              true, x => x[0])
            );
  }, []);
  
  useEffect( ()=>{
    if(typeState) {
      Meteor.call('countMultiBatchCycleTimes', wID, typeState, yearState,
      (err, reply)=>{
        err && console.log(err);
        if(reply && mounted.current) {
          serverDataSet(reply);
        }
      });
    }
  }, [typeState, yearState]);
  
  useEffect( ()=>{
    if(serverData) {
      const chunkedStepTypes = JSON.parse(serverData[0]);
      const stepCycles = cyclyPaceCalc( chunkedStepTypes, range );
      stepCycleTimesSet(stepCycles);
          
      const chunkedFallTypes = JSON.parse(serverData[1]);
      const fallCycles = cyclyPaceCalc( chunkedFallTypes, range );
      fallCycleTimesSet(fallCycles);
    }
  }, [serverData, range]);
  
  return(
    <div className='cardSelf dropCeiling'>
      <div className='centreRow rowWrap'>
        {serverData === false && typeState !== false ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='gapL centre centreText'>
          <i className='medBig bold margin5'>Cycle Time</i>
          <i className='small'>In Minutes:Seconds</i>
        </span>
        
        <span className='flexSpace' />
        
        <YearSelect
          yearsList={yList}
          append=' to Present'
          falsey={`Std ${Pref.avgSpan} Days`}
          filterState={yearState}
          changeFunc={(e)=>yearSet(e)}
          extraClass='miniIn18'
        />
        
        <FilterSelect
          unqID='fltrTYPE'
          title='Filter Step'
          optgroup={true}
          selectList={[ [ 'Steps', fsList ], [ 'Counters', fcList ] ]}
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
      
      {!serverData ? <p><em>Select process to calculate cycle time</em></p> :
        <CyclePaceTable
          stepTimes={stepCycleTimes}
          fallTimes={fallCycleTimes}
        />
      }
      
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