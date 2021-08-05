import React, { useState, useEffect } from 'react';
import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';
import PrintThis from '/client/components/tinyUi/PrintThis';
import OnTargetTrend from './OnTargetTrend'; 
import DoneItemsTrend from './DoneItemsTrend';
import AvgStat from '/client/components/tinyUi/AvgStat';

const TrendWrap = ({ app, isDebug, isNightly })=> {
  
  const [ rate, rateSet ] = useState([0,'flat']);
  
  useEffect(() => {
    Meteor.call('fetchOpenApproxTime', (err, rtn)=>{
	    err && console.log(err);
      rateSet(rtn);
	  });
  }, []);
  
  return(
    <div className='space36v'>
      <div className='comfort vmarginquarter noPrint'>
        <AvgStat 
          num={rate[0]} 
          trend={rate[1]}
          type='approx. hours on the floor' />
        <PrintThis />
      </div>
      
      <Tabs
        tabs={[
          <b><i className='fas fa-bullseye fa-fw'></i> On Target</b>,
          <b><i className='fas fa-flag-checkered fa-fw'></i> Completed</b>,
        ]}
        wide={true}
        stick={false}
        hold={true}
        sessionTab='trendDownPanelTabs'>
        
        <OnTargetTrend
          app={app}
          isDebug={isDebug}
          isNightly={isNightly} />
          
        <DoneItemsTrend
          app={app}
          isDebug={isDebug}
          isNightly={isNightly} />
          
      </Tabs> 

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