import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { min2hr } from '/client/utility/Convert.js';


const RapidExtendTab = ({ 
  batchData, seriesData, rapidsData, widgetData,
  flowData, fallData,
  released, done, nowater,
  app, user, brancheS, isDebug
})=> {
  
  function handleRemove(idVal) {
    Meteor.call('deleteExtendRapid', idVal, (error, re)=>{
      error && console.log(error);
      re ? toast.success('success') : toast.error('unsuccessful');
    });
  }
  
  
  return(
    <div className='cardify'>
      {rapidsData.map( (e, ix)=>(
        <div key={e._id}>
          <p>{e.rapid}</p>
          
          
          
          <div>
            <h3><i className="fas fa-trash fa-lg gap redT"></i>
              Delete Rapid
            </h3>
            <button
              onClick={()=>handleRemove(e._id)}
              className='action clearRed'
            >Delete</button>
          </div>
      
      
        </div>
      ))}
    
    
    </div>
  );
};

export default RapidExtendTab;