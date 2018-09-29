import { Meteor } from 'meteor/meteor';
import React from 'react';
//import Pref from '/client/global/pref.js';
import BatchesListWide from '../lists/BatchesListWide.jsx';

const AllBatches = ({ groupData, widgetData, allWidget, batchData, allBatch, allXBatch, app }) => {
  
  return(
    <div className='overscroll'>
      <div className='centre'>
        
        <BatchesListWide
          batchData={[...allBatch, ...allXBatch]}
          widgetData={allWidget}
          groupData={groupData}
          app={app} />
          
      </div>

    </div>
  );
};

export default AllBatches;
              
              
              
              