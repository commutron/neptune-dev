import React from 'react';
import Pref from '/public/pref.js';

import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';

// import { timeRanges } from '/client/utility/CycleCalc';

const BranchLanding = ({ canEdt })=> {
  
 
  return(
    <div className='overscroll'>
      
      <div className='wide rowWrapR gapsC'>

        
        
        <span className='flexSpace' />
        
        <KpiStat
          num={1}
          name={Pref.group + 's'}
          color='var(--peterriver)'
        />
        

      </div>
      
      <div className='centreRow'>
        
        
       
      </div>
      
      <details className='footnotes'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          Trends include {12} months, including the current month. 
          Read left to right as past to current.
        </p>
      </details>
      
      
            
    </div>
  );
};

export default BranchLanding;