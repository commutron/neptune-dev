import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import BatchesListWide from '../lists/BatchesListWide.jsx';

const AllBatches = ({ groupData, widgetData, allWidget, batchData, allBatch, allXBatch, app }) => {
  
  const total = batchData.length;
  const active = batchData.filter( x => x.finishedAt === false ).length;
  
  return(
    <div className='overscroll'>
      <div className='centre'>
        
        <div className='centreRow'>
          <NumBox
            num={total}
            name={'Total ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={active}
            name={'Active ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={total - active}
            name={'Finished ' + Pref.batch + 's'}
            color='greenT' />
        </div>
          
        <i className='biggest'>~</i>
      </div>
        
        <BatchesListWide
          batchData={[...allBatch, ...allXBatch]}
          widgetData={allWidget}
          groupData={groupData}
          app={app} />

        
    </div>
  );
};

export default AllBatches;
              
              
              
              