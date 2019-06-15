import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';

const ExploreLanding = ({ groupData, widgetData, batchData, xBatchData, app }) => {
  
  const total = batchData.length;
  const xTotal = xBatchData.length;
  const live = batchData.filter( x => x.live === true ).length;
  const xlive = xBatchData.filter( x => x.live === true ).length;
  const process = batchData.filter( x => x.finishedAt === false ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  const verAdd = Array.from(widgetData, x => x.versions.length).reduce((x, y) => x + y, 0);

  return(
    <div className=''>
      <div className='centre wide'>
        
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
          <NumBox
            num={total + xTotal}
            name={'Total ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={live + xlive}
            name={'live ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={process + xProcess}
            name={'In Process ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={(total + xTotal) - (process + xProcess)}
            name={'Finished ' + Pref.batch + 's'}
            color='greenT' />
        </div>
        
      </div>
    </div>
  );
};

export default ExploreLanding;