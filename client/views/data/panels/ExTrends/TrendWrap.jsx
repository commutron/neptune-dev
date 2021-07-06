import React from 'react';
// import Pref from '/client/global/pref.js';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import PerfScatter from './PerfScatter';
import NCScatter from './NCScatter';
import QtyScatter from './QtyScatter';

const TrendWrap = ({ app, isDebug, isNightly })=> (
  <div className='space36v'>
    <Tabs
      tabs={[
        <b><i className='fas fa-cubes fa-fw'></i> Orders</b>,
        <b><i className='fas fa-bullseye fa-fw'></i> Performance</b>,
        <b><i className='fas fa-exclamation-circle fa-fw'></i> Problems</b>,
      ]}
      wide={true}
      stick={false}
      hold={true}
      sessionTab='exTrendPanelTabs'
    >
      <QtyScatter app={app} />
      
      <PerfScatter app={app} />
        
      <NCScatter app={app} />
     
    </Tabs>
  </div>
);
  
export default TrendWrap;