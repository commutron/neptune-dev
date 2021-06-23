import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { min2hr } from '/client/utility/Convert.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';

import './style';

const PerformanceData = ({ 
  batchID, app, dbDay,
  altNumber, isDebug, showExtra, showLess
})=> {
  
  const thingMounted = useRef(true);
  const [ pfData, setPerform ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('performTarget', batchID, (err, re)=>{
      err && console.log(err);
      if( re ) { 
        if(thingMounted.current) { setPerform( re ); }
        // isDebug && 
        console.log(re);
      }
    });
  }, [batchID]);
  
  useEffect( ()=> {
    return () => { thingMounted.current = false };
  }, []);
  
  return(
    <PerformanceSquare 
      batchID={batchID} 
      pf={pfData}
      app={app}
      isDebug={isDebug}
      showExtra={showExtra}
      showLess={showLess} /> 
  );
};

export default PerformanceData;

///////////////////////////////////////////////////////////////////////////////

export const PerformanceSquare = ({ 
  batchID, pf,
  app, isDebug, showExtra, showLess
})=> {
  
    const baseClass = 'blur-change smCap big';
    const extraClass = showExtra ? 'centre' : '';
    
    
    
    const pfRank = 
      pf.gold <= -4 ? <n-fa3><i className='fas fa-sad-tear fa-lg'></i></n-fa3> :
      pf.gold <= -2 ? <n-fa2><i className='fas fa-frown-open fa-lg'></i></n-fa2> :
      pf.gold <= -1 ? <n-fa1><i className='fas fa-frown fa-lg'></i></n-fa1> :
      pf.gold === 0 ? <n-fa0><i className='fas fa-smile fa-lg'></i></n-fa0> :
      pf.gold >= 4 ? <n-fa6><i className='fas fa-grin-hearts fa-lg'></i></n-fa6> :
      pf.gold >= 2 ? <n-fa5><i className='fas fa-grin-alt fa-lg'></i></n-fa5> :
      pf.gold >= 1 ? <n-fa4><i className='fas fa-smile-wink fa-lg'></i></n-fa4> :
      <n-faX><i className='fas fa-meh fa-lg'></i></n-faX>;
      
    return(
      <div 
        className={`${baseClass} ${extraClass}`}
      >
        <NumStat
          num={pfRank}
          name='Performance'
          color='blackblackT'
          size='bold big' />
      </div>
    );
};