import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
// import moment from 'moment';

// import { min2hr } from '/client/utility/Convert';
import NumLine from '/client/components/tinyUi/NumLine.jsx';

import Pref from '/client/global/pref.js';

const MultiBatchKPI = ({ batchIDs, app })=> {
  
  const [ batchDT, batchDTset ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('countMultiBatchTideToQuote', batchIDs, (error, reply)=>{
      error && console.log(error);
      batchDTset( reply );
    });
  }, [batchIDs]);
  
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
    const toPtext = t2qPr < 0 ? `\nover quote` : `\nunder quote`;
    const prColor = t2qPr < 0 ? 'redT' : 'tealT';
    
    return(
      <div className='invert vspacehalf rowWrap' 
        title={`Mean Average of completed ${Pref.batches}`}>
        
        
        <NumLine
          num={bdtObj.tidePerItemAvg}
          name='minutes per item (recored)'
          color='blackT' />
          
        {/* 
        <NumLine
          num={bdtObj.quotePerItemAvg}
          name='minutes per item (quoted)'
          color='blackT' />
        */}
         
        <NumLine
          num={Math.abs(t2qHr)}
          name={toQtext}
          color={hrColor} />
          
        <NumLine
          num={`${Math.abs(t2qPr)}%`}
          name={toPtext}
          color={prColor}
          big={true} />
        
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