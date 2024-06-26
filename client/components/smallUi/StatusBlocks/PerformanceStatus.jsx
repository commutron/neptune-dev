import React, { useRef, useState, useEffect } from 'react';
import NumStat from '/client/components/tinyUi/NumStat';

import './style';

const PerformanceData = ({ batchID, mini })=> {
  
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
    <PerformanceSquare perf={pfData} mini={mini} /> 
  );
};

export default PerformanceData;


export const PerformanceSquare = ({ perf })=> {
  
  const pos = perf === null ? '±' : perf > 0 ? '+' : '';
  
  const golden = <b className='gapR numFont'>{`${pos}${perf === null ? '' : perf}`}</b>;

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