import { Meteor } from 'meteor/meteor';
import React from 'react';
//import Pref from '/client/global/pref.js';
import BatchesListWide from '../lists/BatchesListWide.jsx';

const AllBatches = ({ groupData, widgetData, allWidget, batchData, allBatch, allXBatch, app }) => {
  
  return(
    <section className='overscroll'>
      <div className='centre'>
        
        <BatchesListWide
          batchData={[...allBatch, ...allXBatch]}
          widgetData={allWidget}
          groupData={groupData}
          app={app} />
          
      </div>

    </section>
  );
};

export default AllBatches;
              
              
              
              