import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import PopularWidget from '/client/components/charts/PopularWidget.jsx';
import BestWorstBatch from '/client/components/bigUi/BestWorstBatch.jsx';

const AllGroups = ({ groupData, widgetData, batchData, app }) => {
  
  const verAdd = Array.from(widgetData, x => x.versions.length).reduce((x, y) => x + y);
  
  return(
    <div className='overscroll'>
      <div className='centre'>
        
        <div className='centreRow'>
          <NumBox
            num={groupData.length}
            name={Pref.group + 's'}
            color='blueT' />
          <NumBox
            num={widgetData.length}
            name={Pref.widget + 's'}
            color='blueT' />
          <NumBox
            num={verAdd}
            name={Pref.version + 's'}
            color='blueT' />
        </div>
          
        <i className='biggest'>~</i>
        
        <PopularWidget groupData={groupData} widgetData={widgetData} />
       
      </div>
      
      <BestWorstBatch
        groupData={groupData}
        widgetData={widgetData} 
        app={app}
        widgetSort={true} />
          
    </div>
  );
};

export default AllGroups;