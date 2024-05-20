import React, { useRef, useState, useEffect } from 'react';

import KpiStat from './KpiStat';

const PerformKPIData = ({ batchID })=> {
  
  const thingMounted = useRef(true);
  const [ pfData, setPerform ] = useState(null);
  
  useEffect( ()=> {
    return () => { thingMounted.current = false };
  }, []);
  
  useEffect( ()=> {
    Meteor.call('performTrace', batchID, (err, re)=>{
      err && console.log(err);
      if( isFinite(re) ) { 
        if(thingMounted.current) { setPerform( re ); }
      }
    });
  }, [batchID]);
  
  return(
    <PerformKPI perf={pfData} /> 
  );
};

export default PerformKPIData;


export const PerformKPI = ({ perf })=> {
  
  const pos = perf === null ? '±' : perf >= 0 ? '+' : '';
  
  const golden = `${pos}${perf === null ? '' : perf}`;
  
  const pfText = 
    perf === null ? 'Indiscernible' :
    perf <= -8 ? 'Dreadful' :
    perf <= -4 ? 'Terrible' :
    perf <= -2 ? 'Awful' :
    perf <= -1 ? 'Below Target' :
    perf >= 8 ? 'Tremendous' :
    perf >= 4 ? 'Exceptional' :
    perf >= 2 ? 'Above Target' :
    // perf >= 0 ? 
    'On Target';
  
  const exp = <p className='margin5'><small>Performance is a factor of progress, budgeted time and nonconformances.</small></p>;
  
  return(
    <KpiStat
      title='Performance'
      num={golden}
      name={pfText}
      color='var(--amethyst)'
      more={exp}
    />
  );
};