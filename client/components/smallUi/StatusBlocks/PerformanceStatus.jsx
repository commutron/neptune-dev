import React, { useRef, useState, useEffect } from 'react';
import NumStat from '/client/components/tinyUi/NumStat';

import './style';

const PerformanceData = ({ batchID })=> {
  
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
    <PerformanceSquare perf={pfData} /> 
  );
};

export default PerformanceData;


export const PerformanceSquare = ({ perf })=> {
  
  const pos = perf === null ? '±' : perf > 0 ? '+' : '';
  
  const golden = <b className='gapR numFont'>{pos}{perf}</b>;
  
  const pfRank = 
    perf === null ? <n-faX><i className='fas fa-meh'></i></n-faX> :
    perf <= -6 ? <n-fa4><i className='fas fa-sad-cry'></i></n-fa4> :
    perf <= -4 ? <n-fa3><i className='fas fa-sad-tear'></i></n-fa3> :
    perf <= -2 ? <n-fa2><i className='fas fa-frown-open'></i></n-fa2> :
    perf <= -1 ? <n-fa1><i className='fas fa-frown'></i></n-fa1> :
    perf >= 6 ? <n-fa7><i className='fas fa-grin-hearts'></i></n-fa7> :
    perf >= 4 ? <n-fa6><i className='fas fa-grin-alt'></i></n-fa6> :
    perf >= 2 ? <n-fa5><i className='fas fa-grin'></i></n-fa5> :
    // perf >= 0 ? 
    <n-fa0><i className='fas fa-smile'></i></n-fa0>;
  
  const pfText = 
    perf === null ? 'Fine, Indiscernible' :
    perf <= -6 ? 'Dreadful' :
    perf <= -4 ? 'Terrible' :
    perf <= -2 ? 'Awful' :
    perf <= -1 ? 'Below Target' :
    perf >= 6 ? 'Tremendous' :
    perf >= 4 ? 'Exceptional' :
    perf >= 2 ? 'Above Target' :
    // perf >= 0 ? 
    'On Target';
    
  return(
    <div title={pfText}>
      <NumStat
        num={<span className='perf'>{golden}{pfRank}</span>}
        name='Performance'
        color='blackblackT'
        size='bold bigger' />
    </div>
  );
};