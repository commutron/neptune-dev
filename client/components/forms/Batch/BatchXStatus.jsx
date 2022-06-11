import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';

import BatchXComplete from '/client/components/forms/Batch/BatchXComplete';
import ModelInline from '/client/components/smallUi/ModelInline';

const BatchXStatus = ({ batchData, allFlow, allFall, nowater, rapid })=>	{
  
  const handleLive = (change)=> {
    Meteor.call('changeStatusX', batchData._id, change, (error)=>{
      error && console.log(error);
    });
  };
  
  function handleUnLock(e) {
    this.doUnLock.disabled = true;
    Meteor.call('disableLockX', batchData._id, (err, re)=>{
      err && console.log(err);
      re ? null : toast.warning('Can Not Lock');
    });
  }
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  
  return(
    <div className='cap'>
    
      <ModelInline 
        title={batchData.live ? `${Pref.xBatch} is ${Pref.live}` : `${Pref.xBatch} is ${Pref.notlive}`}
        color={batchData.live ? 'blue' : 'black'}
        border={batchData.live ? 'borderBlue' : 'borderBlack'}
        icon='fa-solid fa-lightbulb'
      >
      {!batchData.live ?
        <Fragment>
          <p>Turning On will make the {Pref.xBatch} available in Production, Upstream, Overview & Downstream</p>
          <button
            id='isDoneOn'
            title={canRun ? 'Turn ON' : Pref.norole}
            className='action blueSolid'
            onClick={()=>handleLive(true)}
            disabled={!canRun}
          >Turn On</button>
        </Fragment>
        :
        <Fragment>
          <p>Turning Off will make the {Pref.xBatch} temporarily unavailable in Production, Upstream, Overview & Downstream</p>
          <button
            id='isDoneOff'
            title={canRun ? 'Turn OFF' : Pref.norole}
            className='action blackSolid'
            onClick={()=>handleLive(false)}
            disabled={!canRun}
          >Turn Off</button>
        </Fragment>
        }
      
      </ModelInline>
      
      {!batchData.live && batchData.lock ?
        canRun ?
          <ModelInline 
            title={`${Pref.xBatch} is Locked`}
            color='purple'
            border='borderPurple'
            icon='fa-solid fa-lock'
          >
          <Fragment>
            <p>Locked {Pref.xBatches} prevent changes and speed up statistics. {Pref.xBatches} lock one year after completion</p>
            <button
              id='doUnLock'
              title={canRun ? 'Unlock' : Pref.norole}
              className='action purpleSolid'
              onClick={(e)=>handleUnLock(e)}
              disabled={!canRun}
            >Unlock</button>
          </Fragment>
        </ModelInline>
        : 
        <p>
          <n-fa2><i className='fas fa-lock purpleT fa-lg fa-fw gapR'></i></n-fa2>Locked
        </p>
      : null }
      
      
      {!rapid && 
       ( nowater || (allFlow && allFall) || batchData.completed ) ?
        <BatchXComplete 
          batchData={batchData}
          allFlow={allFlow}
          allFall={allFall}
          nowater={nowater}
          quantity={batchData.quantity}
          canRun={canRun} />
      :null}
    </div>
  );
};

export default BatchXStatus;