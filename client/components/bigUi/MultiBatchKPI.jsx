import React, { useRef, useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

// import { min2hr } from '/client/utility/Convert';
import NumLine from '/client/components/tinyUi/NumLine.jsx';

import Pref from '/client/global/pref.js';

const MultiBatchKPI = ({ batchIDs, app })=> {
  
  const mounted = useRef(true);
  
  const [ batchDT, batchDTset ] = useState(false);
  
  useEffect( ()=>{
    return ()=> mounted.current = false; 
  }, []);
  
  useEffect( ()=>{
    Meteor.call('countMultiBatchTideToQuote', batchIDs, (error, reply)=>{
      error && console.log(error);
      if(mounted.current) { batchDTset( reply ); }
    });
  }, []);
  
  if(!batchDT) {
    return(
      <CalcSpin />
    );
  }
  
  if(batchDT) {
    const bdtObj = JSON.parse(batchDT);
    
    const t2qHr = bdtObj.tideToQuoteHoursAvg;
    const toQtext = t2qHr < 0 ? `hours over per ${Pref.batch} quote` : 
                                `hours under per ${Pref.batch} quote`;
    const hrColor = t2qHr < 0 ? 'redT' : 'tealT';
    
    const t2qPr = bdtObj.tideToQuotePercentAvg;                  
    const toPtext = t2qPr < 0 ? 'over quote' : 'under quote';
    const prColor = t2qPr < 0 ? 'redT' : 'tealT';
    
    const delvAvg = bdtObj.deliveryGap;
    const dlvText = delvAvg < 0 ? 'days late' : 'days early';
    const dlvColr = delvAvg < 0 ? 'redT' : 'greenT';
    
    return(
      <div className='autoGrid' 
        title={`Mean Average of completed ${Pref.batches}`}>
        
        
        <NumLine
          num={bdtObj.tidePerItemAvg}
          name='minutes per item (recored)'
          color='blackT' />
         
        <NumLine
          num={Math.abs(t2qHr)}
          name={toQtext}
          color={hrColor} />
          
        <NumLine
          num={`${Math.abs(t2qPr)}%`}
          name={toPtext}
          color={prColor} />
          
        <NumLine
          num={Math.abs(delvAvg)}
          name={dlvText}
          color={dlvColr} />
        
      </div>
    );
  }
    
  return(
    <div className='centreText fade'>
      <i className='fas fa-ghost fa-3x grayT'></i>
      <p className='big cap'>no {Pref.batches}</p>
    </div>
  );
};

export default MultiBatchKPI;