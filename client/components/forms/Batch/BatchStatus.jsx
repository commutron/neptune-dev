import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import ModelMedium from '/client/components/smallUi/ModelMedium.jsx';

const BatchStatus = ({ batchId, finished, finishedAt, allFinished, live })=>	{
  
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
            disabled={!isRun}
          ><i className='fas fa-check-circle greenT fa-2x fa-fw'></i>
          </button>   {Pref.batch} is Finished
        </p>
        {!live ?
          <p className='cap middle'>
            <button
              id='isDone'
              title='Turn ON'
              className='miniAction noFade medBig'
              onClick={()=>handleLive(true)}
              disabled={!isRun}
            ><i><i className='far fa-lightbulb grayT fa-2x fa-fw'></i></i>
            </button>   {Pref.batch} is {Pref.notlive}
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
            </button>   {Pref.batch} is {Pref.live}
          </p>
        }
      </div>
    );
  }
  
  return( null );
  
  
};

export default BatchStatus;