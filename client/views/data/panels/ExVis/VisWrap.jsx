import React from 'react';
import moment from 'moment';
import Pref from '/public/pref.js';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import PerfScatter from './PerfScatter';
import ShipScatter from '/client/components/charts/ShipScatter';
import ProbScatter from './ProbScatter';
import OrderScatter from './OrderScatter';
import FailScatterChart from '/client/components/charts/FailScatterChart';

const TrendWrap = ({ brancheS, app })=> (
  <div className='space36v'>
    <Tabs
      tabs={[
        <b><i className='fas fa-cubes fa-fw'></i> {Pref.xBatchs}</b>,
        <b><i className='fas fa-flag-checkered fa-fw'></i> Fulfill On Time</b>,
        <b><i className='fas fa-bullseye fa-fw'></i> Performance</b>,
        <b><i className='fas fa-times-circle fa-fw'></i> {Pref.nonCons}</b>,
        <b><i className='fas fa-exclamation-triangle fa-fw'></i> {Pref.shortfalls}</b>,
        <b><i className='fas fa-microscope fa-fw'></i> Test Fails</b>,
      ]}
      wide={true}
      stick={false}
      hold={true}
      sessionTab='exTrendPanelTabs'
    >
      <OrderScatter app={app} />
      
      <ShipScatter 
        fetchFunc='getAllOnTime'
        idLimit={false}
        dtStart={app.createdAt}
        print={true} />
        
      <PerfScatter app={app} />
        
      <ProbScatter 
        key='N0NC0N'
        fetchFunc='getAllNConCount'
        fillfade='rgba(231, 76, 60, 0.5)'
        title={Pref.nonCons}
        brancheS={brancheS}
        app={app} />
        
      <ProbScatter 
        key='SH0R7'
        fetchFunc='getAllShortCount'
        fillfade='rgba(230, 126, 34,0.5)'
        title={Pref.shortfalls}
        brancheS={brancheS}
        app={app} />
      
      <FailScatterChart
        fetchFunc='getAllFailCount'
        idLimit={false}
        print={true}
        dtst={app.createdAt}
      />
     
    </Tabs>
    
    
    <p className='grayT small nomargin'>
      Relevant data goes back {Pref.avgSpan} days to {moment().subtract(Pref.avgSpan, 'days').format('MMMM D YYYY')}
    </p>
  </div>
);
  
export default TrendWrap;