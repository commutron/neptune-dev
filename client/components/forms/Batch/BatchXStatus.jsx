import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';


const BatchXStatus = ({ batchData })=>	{
  
  const handleLive = (change)=> {
    Meteor.call('changeStatusX', batchData._id, change, (error)=>{
      error && console.log(error);
    });
  };
  
  const isRun = Roles.userIsInRole(Meteor.userId(), 'run');
  
  if(batchData.waterfall.length === 0) {
    return(
      <BatchXComplete batchData={batchData} />
    );
  }
  
  if(batchData.completed) {
    return(
      <div>
        <BatchXComplete batchData={batchData} />
        
        {!batchData.live ?
          <p className='cap middle'>
            <button
              id='isDone'
              title='Turn ON'
              className='miniAction noFade medBig'
              onClick={()=>handleLive(true)}
              disabled={!isRun}
            ><i><i className='far fa-lightbulb grayT fa-2x fa-fw'></i></i>
            </button>   {Pref.xBatch} is {Pref.notlive}
          </p>
        :
          <p className='cap middle'>
            <button
              id='isDone'
              title='Turn OFF'
              className='miniAction noFade medBig'
              onClick={()=>handleLive(false)}
              disabled={!isRun}
            ><b><i className='fas fa-lightbulb trueyellowT fa-2x fa-fw'></i></b>
            </button>   {Pref.xBatch} is {Pref.live}
          </p>
        }
      </div>
    );
  }
  
  return( null );
};

export default BatchXStatus;