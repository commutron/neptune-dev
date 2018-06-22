import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import Waterfall from './Waterfall.jsx';

const WaterfallSelect = ({ batchData, app })=> {
    
  Session.set('nowStep', '');
  Session.set('nowWanchor', '');
  return (
    <div className='waterfallSelector'>
      {batchData.waterfall.map( (entry)=>{
        return(
          <details key={entry.wfKey}>
            <summary>{entry.gate}</summary>
            <Waterfall
              id={batchData._id}
              fall={entry}
              quantity={batchData.quantity}
              app={app} />
          </details>
      )})}
    </div>
  );
};
  
export default WaterfallSelect;