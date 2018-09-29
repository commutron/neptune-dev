import { Meteor } from 'meteor/meteor';
import React from 'react';
//import Pref from '/client/global/pref.js';
import GroupsListWide from '../lists/GroupsListWide.jsx';

const AllGroups = ({ groupData, widgetData, batchData, batchDataX, app }) => {
  
  return(
    <div className='overscroll'>
      <div className='centre'>
        
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