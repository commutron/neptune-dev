import React from 'react';
// import Pref from '/client/global/pref.js';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import NonConTrend from './NonConTrend'; 
import PerfScatter from './PerfScatter';

const TrendWrap = ({ app, isDebug, isNightly })=> (
  <div className='space36v'>
    <Tabs
      tabs={[
        <b><i className='fas fa-bullseye fa-fw'></i> Performance</b>,
        <b><i className='fas fa-times-circle fa-fw'></i> NonCon</b>,
      ]}
      wide={true}
      stick={false}
      hold={true}
      sessionTab='exTrendPanelTabs'
    >
      <PerfScatter
        app={app} />
        
      <NonConTrend
        app={app}
        isDebug={isDebug}
        isNightly={isNightly} />
     
    </Tabs>
  </div>
);
  
export default TrendWrap;