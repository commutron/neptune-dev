import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';

import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';


const BatchXStatus = ({ batchData, allFlow, allFall, nowater, rapid })=>	{
  
  const handleLive = (change)=> {
    Meteor.call('changeStatusX', batchData._id, change, (error)=>{
      error && console.log(error);
    });
  };
  
  /*function handleLock(e) { // Manual Locking
    this.doLock.disabled = true;
    Meteor.call('enableLockX', batchData._id, (err, re)=>{
      err && console.log(err);
      re ? null : toast.warning('Can Not Lock');
    });
  }*/
  function handleUnLock(e) {
    this.doUnLock.disabled = true;
    Meteor.call('disableLockX', batchData._id, (err, re)=>{
      err && console.log(err);
      re ? null : toast.warning('Can Not Lock');
    });
  }
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  
  return(
    <div className='cap'>
      {!rapid && 
       batchData.quantity > 0 &&
       ( nowater || (allFlow && allFall) || batchData.completed ) ?
        <BatchXComplete 
          batchData={batchData}
          allFlow={allFlow}
          allFall={allFall}
          nowater={nowater}
          canRun={canRun} />
      :null}
        
      {!batchData.live ?
        <Fragment>
          <p>
            <button
              id='isDone'
              title={canRun ? 'Turn ON' : Pref.norole}
              className='miniAction noFade medBig'
              onClick={()=>handleLive(true)}
              disabled={!canRun}
            ><n-fa1><i className='fas fa-power-off grayT fa-lg fa-fw'></i></n-fa1>
            </button>   {Pref.xBatch} is {Pref.notlive}
          </p>
          {/*isAdmin && !batchData.lock && // Manual Locking
            <p>
              <button
                id='doLock'
                title={canRun ? 'Enable Lock' : Pref.norole}
                className='miniAction noFade medBig'
                onClick={(e)=>handleLock(e)}
                disabled={!canRun}
              ><n-fa4><i className='fas fa-lock-open purpleT fa-lg fa-fw'></i></n-fa4>
              </button>   UnLocked
            </p>
          */}
          {canRun && batchData.lock &&
            <p>
              <button
                id='doUnLock'
                title={canRun ? 'Disable Lock' : Pref.norole}
                className='miniAction noFade medBig'
                onClick={(e)=>handleUnLock(e)}
                disabled={!canRun}
              ><n-fa2><i className='fas fa-lock purpleT fa-lg fa-fw'></i></n-fa2>
              </button>   Locked
            </p>
          }
        </Fragment>
      : isAdmin || batchData.completed ?
        <p>
          <button
            id='isDone'
            title={canRun ? 'Turn OFF' : Pref.norole}
            className='miniAction noFade medBig'
            onClick={()=>handleLive(false)}
            disabled={!canRun}
          ><n-fa3><i className='fas fa-lightbulb trueyellowT fa-lg fa-fw'></i></n-fa3>
          </button>   {Pref.xBatch} is {Pref.live}
        </p>
        : null
      }
    </div>
  );
};

export default BatchXStatus;