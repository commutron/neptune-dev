import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const BatchFinish = ({ batchId, finished, allFinished, live })=>	{
  
  const handleFinish = ()=> {
    Meteor.call('finishBatch', batchId, false, (error)=>{
      error && console.log(error);
    });
  };
  const handleUndoFinish = ()=> {
    Meteor.call('undoFinishBatch', batchId, false, (error)=>{
      error && console.log(error);
    });
  };
  const auth = Roles.userIsInRole(Meteor.userId(), 'finish') && !finished;
  
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
  
  if(finished && Roles.userIsInRole(Meteor.userId(), 'admin') ) {
    return(
      <div>
        <p className='cap'>
          <i className='fa fa-check-circle greenT fa-2x'></i> {Pref.batch} is Finished
        </p>
        <p>
        <button
          id='isDone'
          className='action greenHover'
          onClick={()=>handleUndoFinish()}
        >Clear Finish Date and Reopen</button>
        </p>
      </div>
    );
  }
  
  if(finished) {
    return(
      <div>
        <p className='cap'>
          <i className='fa fa-check-circle greenT fa-2x'></i> {Pref.batch} is Finished
        </p>
      </div>
    );
  }
  
  return( null );
  
  
};

export default BatchFinish;