import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
// import moment from 'moment';

import { min2hr } from '/client/utility/Convert';


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
    return(
      <div className='invert chartNoHeightContain'>
        
        {batchDT}
        
        
        <div className='centreText small'>Duration in Hours</div>
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