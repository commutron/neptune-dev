import React, { useRef, useState, useEffect } from 'react';

import KpiStat from './KpiStat';
import NumStat from '/client/components/tinyUi/NumStat';

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

const textScale = (num)=> {
  return num === null ? 'Indiscernible' :
    num <= -8 ? 'Dreadful' :
    num <= -4 ? 'Terrible' :
    num <= -2 ? 'Awful' :
    num <= -1 ? 'Below Target' :
    num >= 8 ? 'Tremendous' :
    num >= 4 ? 'Exceptional' :
    num >= 2 ? 'Above Target' :
    'On Target';
};

export const PerformKPI = ({ perf })=> {
  
  const pos = perf === null ? '±' : perf >= 0 ? '+' : '';
  
  const golden = `${pos}${perf === null ? '' : perf}`;
  
  const pfText = textScale(perf);
  
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

export const PerformanceSquare = ({ perf })=> {
  
  const pos = perf === null ? '±' : perf >= 0 ? '+' : '';
  
  const golden = <b className='gapR numFont'>{`${pos}${perf === null ? '' : perf}`}</b>;

  const pfText = textScale(perf);

  return(
    <NumStat
      num={<span className='perf'>{golden}</span>}
      name='Performance'
      title={`Performance: ${pfText}`}
      color='blackblackT'
      size='bold bigger'
    />
  );
};