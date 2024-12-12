import React, { useRef, useState, useEffect } from 'react';

import { round2Decimal } from '/client/utility/Convert';
import NumLine from '/client/components/tinyUi/NumLine.jsx';

import Pref from '/client/global/pref.js';

const MultiBatchKPI = ({ widgetId })=> {
  
  const mounted = useRef(true);
  
  const [ batchDT, batchDTset ] = useState(false);
  
  useEffect( ()=>{
    return ()=> mounted.current = false; 
  }, []);
  
  useEffect( ()=>{
    Meteor.call('countMultiBatchTideToQuote', widgetId, (error, reply)=>{
      error && console.log(error);
      if(mounted.current) { batchDTset( reply ); }
    });
  }, []);
  
  return(
    <div className='w100'>
      <h4 className='comfort'><span className='cap'>{`Mean Average of completed ${Pref.xBatchs}`}</span><span className='smaller middle fadeMore'
        >Based on completed orders only. Updates once a day.
      </span></h4>
      
      <KPIBlocks batchDT={batchDT} />
    </div>
  );
};

export default MultiBatchKPI;

const KPIBlocks = ({ batchDT })=> {
  
  if(batchDT) {
    const bdtObj = JSON.parse(batchDT);
    
    const t2qHr = bdtObj.tideToQuoteHoursAvg;
    const toQtext = t2qHr < 0 ? 'hours over quote' : 'hours under quote';
    const hrColor = t2qHr < 0 ? 'redT' : 'tealT';
    
    const t2qPr = bdtObj.tideToQuotePercentAvg;                  
    const toPtext = t2qPr < 0 ? 'over quote' : 'under quote';
    const prColor = t2qPr < 0 ? 'redT' : 'tealT';
    
    const delvAvg = bdtObj.deliveryGap;
    const dlvText = delvAvg < 0 ? 'days late' : 'days early';
    const dlvColr = delvAvg < 0 ? 'redT' : 'greenT';
    
    return(
      <div className='balancer'>
        <NumLine
          num={round2Decimal(bdtObj.tidePerItemAvg)}
          name='minutes per item'
          color='blackT' />
         
        <NumLine
          num={round2Decimal(Math.abs(t2qHr))}
          name={toQtext}
          color={hrColor} />
          
        <NumLine
          num={`${round2Decimal(Math.abs(t2qPr))}%`}
          name={toPtext}
          color={prColor} />
          
        <NumLine
          num={Math.round(Math.abs(delvAvg))}
          name={dlvText}
          color={dlvColr} />
      </div>
    );
  }
  
  return( 
    <div className='centre' style={{minHeight:'55.33px'}}>
      <p className='centreText'>
        <em>Loading...</em>
      </p>
    </div> 
  );
};