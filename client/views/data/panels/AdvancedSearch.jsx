import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';

const AdvancedSearch = ({ groupData, widgetData, batchData, xBatchData, app }) => {
  
  const total = batchData.length;
  const xTotal = xBatchData.length;
  const active = batchData.filter( x => x.active === true ).length;
  const xActive = xBatchData.filter( x => x.active === true ).length;
  const process = batchData.filter( x => x.finishedAt === false ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  const verAdd = Array.from(widgetData, x => x.versions.length).reduce((x, y) => x + y);

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
            num={active + xActive}
            name={'Active ' + Pref.batch + 's'}
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
        
        <p><i className='biggest'>~</i></p>
        
        <div className='balance'>
          <label className='listSortInput'>
            <input
              type='search'
              id='advSearch'
              placeholder='coming soon'
              disabled={true}/>
            <br />Advanced Search
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;