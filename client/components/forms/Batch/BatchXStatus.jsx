import React, { Fragment } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';


const BatchXStatus = ({ batchData })=>	{
  
  const handleLive = (change)=> {
    Meteor.call('changeStatusX', batchData._id, change, (error)=>{
      error && console.log(error);
    });
  };
  
  function handleLock(e) {
    this.doLock.disabled = true;
    Meteor.call('enableLockX', batchData._id, (error)=>{
      error && console.log(error);
    });
  }
  function handleUnLock(e) {
    this.doUnLock.disabled = true;
    Meteor.call('disableLockX', batchData._id, (error)=>{
      error && console.log(error);
    });
  }
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
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
          <Fragment>
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
            {isAdmin && !batchData.lock &&
              <p className='cap middle'>
                <button
                  id='doLock'
                  title='Enable Lock'
                  className='miniAction noFade medBig'
                  onClick={(e)=>handleLock(e)}
                  disabled={!isRun}
                ><i><i className='fas fa-lock-open purpleT fa-2x fa-fw'></i></i>
                </button>   UnLocked
              </p>
            }
            {isRun && batchData.lock &&
              <p className='cap middle'>
                <button
                  id='doUnLock'
                  title='Disable Lock'
                  className='miniAction noFade medBig'
                  onClick={(e)=>handleUnLock(e)}
                  disabled={!isRun}
                ><i><i className='fas fa-lock purpleT fa-2x fa-fw'></i></i>
                </button>   Locked
              </p>
            }
          </Fragment>
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