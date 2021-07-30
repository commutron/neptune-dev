import React from 'react';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import PerfScatter from './PerfScatter';
import ShipScatter from './ShipScatter';
import NCScatter from './NCScatter';
import QtyScatter from './QtyScatter';
import NCBranches from './NCBranches';

const TrendWrap = ({ brancheS, app })=> (
  <div className='space36v'>
    <Tabs
      tabs={[
        <b><i className='fas fa-cubes fa-fw'></i> Order Quantity</b>,
        <b><i className='fas fa-flag-checkered fa-fw'></i> Completed On Time</b>,
        <b><i className='fas fa-bullseye fa-fw'></i> Performance</b>,
        <b><i className='fas fa-exclamation-circle fa-fw'></i> Problems</b>,
        <b><i className='fas fa-code-branch fa-fw'></i> Branches</b>,
      ]}
      wide={true}
      stick={false}
      hold={true}
      sessionTab='exTrendPanelTabs'
    >
      <QtyScatter app={app} />
      
      <ShipScatter app={app} />
      
      <PerfScatter app={app} />
        
      <NCScatter app={app} />
      
      <NCBranches brancheS={brancheS} app={app} />
     
    </Tabs>
  </div>
);
  
export default TrendWrap;