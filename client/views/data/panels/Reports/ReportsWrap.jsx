import React from 'react';
// import Pref from '/client/global/pref.js';
import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';

import MonthKPIReport from './MonthKPIReport'; 
import ProblemReport from './ProblemReport';
import BuildDurration from './BuildDurration';
import BuildPace from './BuildPace';

const ReportsWrap = ({ 
  allBatch, allXBatch, 
  allWidget, allVariant, allGroup,
  app, isDebug, isNightly
})=> (
  <div className='space36v'>
    
    <Tabs
      tabs={[
        <b><i className='fas fa-calendar fa-fw'></i> Monthly Stats</b>,
        <b><i className='fas fa-exclamation-circle fa-fw'></i> Problems</b>,
        <b><i className='fas fa-hourglass-end fa-fw'></i> Durrations</b>,
        <b><i className='fas fa-icicles fa-fw' data-fa-transform='flip-v'></i> Cycle Pace</b>,
      ]}
      wide={false}
      stick={false}
      hold={true}
      sessionTab='reportExPanelTabs'>
      
      <MonthKPIReport
        batchData={allBatch}
        widgetData={allWidget}
        groupData={allGroup} 
        app={app}
        isDebug={isDebug} />
          
      <ProblemReport
        batchData={allBatch}
        widgetData={allWidget}
        groupData={allGroup} 
        app={app} />
      
      {!isNightly ? <div><em>Nightly Only, Outstanding Performance Issues</em></div> :
        <BuildDurration />}
      
      {!isNightly ? <div><em>Nightly Only, Outstanding Performance Issues</em></div> :
        <BuildPace />}
        
    </Tabs> 
  </div>
);
  
export default ReportsWrap;