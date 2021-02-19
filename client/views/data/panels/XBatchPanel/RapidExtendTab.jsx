import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert.js';


const RapidExtendTab = ({ 
  batchData, seriesData, rapidsData, widgetData,
  flowData, fallData,
  released, done, nowater,
  app, user, brancheS, isDebug
})=> {
  
  return(
    <div className='cardify'>
      {rapidsData.map( (e, ix)=>(
        <div key={e._id}>
          <p>{e.rapid}</p>
          
        </div>
      ))}
    
    
    </div>
  );
};

export default RapidExtendTab;