import React from 'react';

import PrintThis from '/client/components/tinyUi/PrintThis';
import OnTargetTrend from './OnTargetTrend'; 

const TrendWrap = ({ app, isDebug })=> {
  
  return(
    <div className='space36v'>
      <div className='rowWrapR vmarginquarter noPrint'>
        <PrintThis />
      </div>
      
      <OnTargetTrend
        app={app}
        isDebug={isDebug}
      />
          
      <div className='rowWrapR noPrint'>
        <span>
          <p className='small rightText'>Gaps in the data are intentional. Indicate when no orders were completed</p>
          <p className='small rightText noPrint'>Data is NOT live. Refreshed once a day</p>
        </span>
      </div>
    </div>
  );
};
  
export default TrendWrap;