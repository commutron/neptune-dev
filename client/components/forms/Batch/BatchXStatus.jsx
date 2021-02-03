import React, { Fragment } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';


const BatchXStatus = ({ batchData, allFlow, allFall, nowater })=>	{
  
  const handleLive = (change)=> {
    Meteor.call('changeStatusX', batchData._id, change, (error)=>{
      error && console.log(error);
    });
  };
  
  function handleLock(e) { // Manual Locking
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
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  
  return(
    <div className='cap'>
      {nowater || (allFlow && allFall) &&
        <BatchXComplete 
          batchData={batchData}
          allFlow={allFlow}
          allFall={allFall}
          nowater={nowater}
          canRun={canRun} />
      }
        
      {!batchData.live ?
        <Fragment>
          <p>
            <button
              id='isDone'
              title='Turn ON'
              className='miniAction noFade medBig'
              onClick={()=>handleLive(true)}
              disabled={!canRun}
            ><i><i className='far fa-lightbulb grayT fa-lg fa-fw'></i></i>
            </button>   {Pref.xBatch} is {Pref.notlive}
          </p>
          {isAdmin && !batchData.lock && // Manual Locking
            <p>
              <button
                id='doLock'
                title='Enable Lock'
                className='miniAction noFade medBig'
                onClick={(e)=>handleLock(e)}
                disabled={!canRun}
              ><i><i className='fas fa-lock-open purpleT fa-lg fa-fw'></i></i>
              </button>   UnLocked
            </p>
          }
          {canRun && batchData.lock &&
            <p>
              <button
                id='doUnLock'
                title='Disable Lock'
                className='miniAction noFade medBig'
                onClick={(e)=>handleUnLock(e)}
                disabled={!canRun}
              ><i><i className='fas fa-lock purpleT fa-lg fa-fw'></i></i>
              </button>   Locked
            </p>
          }
        </Fragment>
      : isAdmin || batchData.completed ?
        <p>
          <button
            id='isDone'
            title='Turn OFF'
            className='miniAction noFade medBig'
            onClick={()=>handleLive(false)}
            disabled={!canRun}
          ><b><i className='fas fa-lightbulb trueyellowT fa-lg fa-fw'></i></b>
          </button>   {Pref.xBatch} is {Pref.live}
        </p>
        : null
      }
    </div>
  );
};

export default BatchXStatus;