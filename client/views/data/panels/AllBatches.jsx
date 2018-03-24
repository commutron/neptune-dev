import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import BestWorstBatch from '/client/components/bigUi/BestWorstBatch.jsx';

const AllBatches = ({ groupData, widgetData, batchData, app }) => {
  
  const total = batchData.length;
  const active = batchData.filter( x => x.finishedAt === false ).length;
  
  return(
    <div className=''>
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
        
        <BestWorstBatch
          groupData={groupData}
          widgetData={widgetData} 
          app={app} />

        
    </div>
  );
};

export default AllBatches;
              
              
              
              