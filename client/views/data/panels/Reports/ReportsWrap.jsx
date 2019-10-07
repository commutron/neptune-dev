import React from 'react';
// import Pref from '/client/global/pref.js';
import Slides from '/client/components/smallUi/Slides.jsx';

//import BestWorstBatch from '/client/components/bigUi/BestWorstBatch.jsx';
// import PopularWidget from '/client/components/charts/PopularWidget.jsx'; 
import GeneralReport from './GeneralReport.jsx'; 
import CompletedReport from './CompletedReport.jsx'; 

const ReportsWrap = ({ batchData, widgetData, groupData, app })=> (
  
  <div>
      
    <Slides
      menu={[
        <b><i className='fas fa-flag-checkered fa-fw'></i>   Completed</b>,
        <b><i className='fas fa-umbrella fa-fw'></i>   General</b>,
       
      ]}>
      
      <CompletedReport
        batchData={batchData}
        widgetData={widgetData}
        groupData={groupData} 
        app={app} />
        
      <GeneralReport
        batchData={batchData}
        widgetData={widgetData}
        groupData={groupData} 
        app={app} />
        
    </Slides> 
  </div>
);
  
export default ReportsWrap;