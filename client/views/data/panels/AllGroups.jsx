import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import GroupsListWide from '../lists/GroupsListWide.jsx';

const AllGroups = ({ groupData, widgetData, batchData, batchDataX, app }) => {
  
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
        
        <GroupsListWide
          groupData={groupData}
          batchData={batchData}
          batchDataX={batchDataX}
          widgetData={widgetData} />
       
      </div>
      
          
    </div>
  );
};

export default AllGroups;