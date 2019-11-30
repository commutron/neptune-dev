import React from 'react';
// import Pref from '/client/global/pref.js';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

//import BestWorstBatch from '/client/components/bigUi/BestWorstBatch.jsx';
// import PopularWidget from '/client/components/charts/PopularWidget.jsx'; 
import GeneralReport from './GeneralReport.jsx'; 
import CompletedReport from './CompletedReport.jsx'; 
import MonthKPIReport from './MonthKPIReport.jsx'; 

const ReportsWrap = ({ batchData, widgetData, groupData, app })=> {
  
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  
  return(
    <div className='space36v'>
      
      <Tabs
        tabs={[
          <b><i className='fas fa-flag-checkered fa-fw'></i> Completed</b>,
          <b><i className='fas fa-calendar fa-fw'></i> Month Raw</b>,
          <b><i className='fas fa-umbrella fa-fw'></i> General</b>,
        ]}
        wide={false}
        stick={false}
        hold={true}
        sessionTab='reportExPanelTabs'>
          
        <CompletedReport
          batchData={batchData}
          widgetData={widgetData}
          groupData={groupData} 
          app={app} />
      
      {isNightly ?
        <MonthKPIReport
          batchData={batchData}
          widgetData={widgetData}
          groupData={groupData} 
          app={app} />
        :
        <div><em>available in the "nightly"</em></div>
      }
          
        <GeneralReport
          batchData={batchData}
          widgetData={widgetData}
          groupData={groupData} 
          app={app} />
          
      </Tabs> 
    </div>
  );
};
  
export default ReportsWrap;