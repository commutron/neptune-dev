import { Meteor } from 'meteor/meteor';
import React from 'react';
//import Pref from '/client/global/pref.js';
import BestWorstBatch from '/client/components/bigUi/BestWorstBatch.jsx';
// import PopularWidget from '/client/components/charts/PopularWidget.jsx'; 

const Reports = ({ groupData, widgetData, batchData, app }) => {

  return(
    <div className='overscroll'>
      <div className='centre wide'>
        
        <div className='balance'>
          <label className='listSortInput'>
            <input
              type='search'
              id='advSearch'
              placeholder='coming soon'
              disabled={true}/>
            <br />Reports
          </label>
        </div>
      </div>
      
      {/*<PopularWidget groupData={groupData} widgetData={widgetData} />*/}
      
      <BestWorstBatch
        groupData={groupData}
        widgetData={widgetData} 
        app={app} />
          
          
    </div>
  );
};

export default Reports;