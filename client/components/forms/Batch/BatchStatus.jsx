import React, { Fragment } from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import ModelMedium from '/client/components/smallUi/ModelMedium.jsx';

const BatchStatus = ({ batchId, finished, finishedAt, allFinished, live, bLock })=>	{
  
  const handleFinish = ()=> {
    Meteor.call('finishBatch', batchId, false, (error)=>{
      error && console.log(error);
    });
  };
  const handleUndoFinish = ()=> {
    Meteor.call('undoFinishBatch', batchId, finishedAt, (error)=>{
      error && console.log(error);
    });
  };
  
  const handleLive = (change)=> {
    Meteor.call('changeStatus', batchId, change, (error)=>{
      error && console.log(error);
    });
  };
  
  /*function handleLock(e) { // Manual Locking
    this.doLock.disabled = true;
    Meteor.call('enableLock', batchId, (error)=>{
      error && console.log(error);
    });
  }*/
  function handleUnLock(e) {
    this.doUnLock.disabled = true;
    Meteor.call('disableLock', batchId, (error)=>{
      error && console.log(error);
    });
  }
  
  //const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isRun = Roles.userIsInRole(Meteor.userId(), 'run');
  const auth = isRun && !finished;
  
  if(!finished && allFinished) {
    return(
      <ModelMedium
        button='Finish'
        title={'Finish ' + Pref.batch}
        color='whiteT'
        icon='fa-flag-checkered fa-2x'
        lock={!auth}
        noText={false}>
        <div>
          <p className='centreText'>All the {Pref.items} are finished</p>
          <p className='centreText'>Would you like to finish the {Pref.batch}?</p>
          <p className='centre'>
            <button
              id='isDone'
              className='action greenHover'
              onClick={()=>handleFinish()}
            >Finish {Pref.batch}</button>
          </p>
        </div>
      </ModelMedium>
    );
  }
  
  if(finished) {
    return(
      <div>
        <p className='cap middle'>
          <button
            id='isDone'
            title={`Clear Finish Date\n & Reopen`}
            className='miniAction noFade medBig'
            onClick={()=>handleUndoFinish()}
            disabled={bLock || !isRun}
          ><i className='fas fa-check-circle greenT fa-2x fa-fw'></i>
          </button>   {Pref.batch} is Finished
        </p>
        {!live ?
          <Fragment>
          <p className='cap middle'>
            <button
              id='isNotLive'
              title='Turn ON'
              className='miniAction noFade medBig'
              onClick={()=>handleLive(true)}
              disabled={bLock || !isRun}
            ><i><i className='far fa-lightbulb grayT fa-2x fa-fw'></i></i>
            </button>   {Pref.batch} is {Pref.notlive}
          </p>
            {/*isAdmin && !bLock && // Manual Locking
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
            */}
            {isRun && bLock &&
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
              disabled={bLock || !isRun}
            ><b><i className='fas fa-lightbulb trueyellowT fa-2x fa-fw'></i></b>
            </button>   {Pref.batch} is {Pref.live}
          </p>
        }
      </div>
    );
  }
  
  return( null );
  
  
};

export default BatchStatus;