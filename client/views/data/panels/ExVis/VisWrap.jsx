import React from 'react';
import Pref from '/client/global/pref.js';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import PerfScatter from './PerfScatter';
import ShipScatter from '/client/components/charts/ShipScatter';
import ProbScatter from './ProbScatter';
import QtyScatter from './QtyScatter';
import FailScatterChart from '/client/components/charts/FailScatterChart';

const TrendWrap = ({ brancheS, app })=> (
  <div className='space36v'>
    <Tabs
      tabs={[
        <b><i className='fas fa-cubes fa-fw'></i> Order Quantity</b>,
        <b><i className='fas fa-flag-checkered fa-fw'></i> Fulfill On Time</b>,
        <b><i className='fas fa-bullseye fa-fw'></i> Performance</b>,
        <b><i className='fas fa-exclamation-circle fa-fw'></i> {Pref.nonCons}</b>,
        <b><i className='fas fa-exclamation-triangle fa-fw'></i> {Pref.shortfalls}</b>,
        <b><i className='fas fa-microscope fa-fw'></i> Test Fails</b>,
      ]}
      wide={true}
      stick={false}
      hold={true}
      sessionTab='exTrendPanelTabs'
    >
      <QtyScatter app={app} />
      
      <ShipScatter 
        fetchFunc='getAllOnTime'
        idLimit={false}
        dtStart={app.createdAt}
        print={true} />
      
      <PerfScatter app={app} />
        
      <ProbScatter 
        key='N0NC0N'
        fetchFunc='getAllNConCount'
        fillfade='rgba(211,84,0,0.2)'
        fill='rgb(231, 76, 60)'
        title={Pref.nonCons}
        brancheS={brancheS}
        app={app} />
        
      <ProbScatter 
        key='SH0R7'
        fetchFunc='getAllShortCount'
        fillfade='rgba(230, 126, 34,0.2)'
        fill='rgb(230, 126, 34)'
        title={Pref.shortfalls}
        brancheS={brancheS}
        app={app} />
      
      <FailScatterChart
        fetchFunc='getAllFailCount'
        idLimit={false}
        print={true}
        // height
        // leftpad
        dtst={app.createdAt}
        // extraClass
      />
     
    </Tabs>
  </div>
);
  
export default TrendWrap;