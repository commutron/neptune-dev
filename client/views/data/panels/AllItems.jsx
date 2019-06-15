import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import SerialLookup from '/client/components/bigUi/SerialLookup/SerialLookup.jsx';

const AllItems = ({ groupData, widgetData, batchData, xBatchData, app }) => {
  
  
  return(
    <div className=''>
      <div className='centre wide'>
        
        <SerialLookup app={app} />
        
      </div>
    </div>
  );
};

export default AllItems;