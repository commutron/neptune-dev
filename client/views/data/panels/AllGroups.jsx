import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import PopularWidget from '/client/components/charts/PopularWidget.jsx';

const AllGroups = ({ groupData, widgetData, batchData, app }) => {
            
  return(
    <div className='centre wide'>
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
        </div>
          
        <i className='biggest'>~</i>
        
        <PopularWidget groupData={groupData} widgetData={widgetData} />
        
       
      </div>
    </div>
  );
};

export default AllGroups;