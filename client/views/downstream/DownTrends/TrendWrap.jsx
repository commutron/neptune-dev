import React from 'react';
// import Pref from '/client/global/pref.js';
import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';

import OnTargetTrend from './OnTargetTrend'; 
import DoneItemsTrend from './DoneItemsTrend';

const TrendWrap = ({ app, isDebug, isNightly })=> (
  <div className='space36v'>
    
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
  </div>
);
  
export default TrendWrap;