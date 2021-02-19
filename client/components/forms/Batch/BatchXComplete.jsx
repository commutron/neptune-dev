import React, { Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import '/client/components/riverX/waterfall/style';

const BatchXComplete = ({ batchData, allFlow, allFall, nowater, canRun })=> {
  
  function finishBatchX() {
    const batchID = batchData._id;
    Meteor.call('finishBatchX', batchID, (error)=>{
      error && console.log(error);
    });
  }
  function undoFinishBatchX(late) {
    const batchID = batchData._id;
    const override = late ? prompt("Enter PIN to override", "") : false;
    if(batchData.completed === true) {
      Meteor.call('undoFinishBatchX', batchID, override, (error, reply)=>{
        error && console.log(error);
        reply ? null : toast.error('Server Error');
      });
    }
  }

  return(
    <div className='centre vmarginhalf space1v purpleBorder'>
      {batchData.completed === false ?
        nowater || (allFlow && allFall) ?
          <Fragment>
            <p className='centreText'>
              {nowater ?
                <i>No assigned processes</i> :
                <i>All assigned processes are complete</i> }
            </p>
            <button
              className='action clearPurple'
              onClick={()=>finishBatchX()}
              disabled={!Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch")}
            >Complete {Pref.xBatch}</button>
          </Fragment>
        : null
      :
        <Fragment>
          <h2 className='green'>
            Completed: {moment(batchData.completedAt).calendar()}
          </h2>
          {moment().diff(moment(batchData.completedAt), 'minutes') < 60 ?
            <div className='centre'>
              <button
                className='action clearPurple'
                onClick={()=>undoFinishBatchX(false)}
                disabled={!Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch")}
              >Cancel Complete</button>
            </div>
          :
          <div>
            <p>
              <i>This {Pref.xBatch} was completed more than an hour ago</i>
            </p>
            <button
              className='action clearPurple'
              onClick={()=>undoFinishBatchX(true)}
              disabled={!canRun}
            >Cancel Complete</button>
          </div>}
        </Fragment>
      }
    </div>
  );
};
  
export default BatchXComplete;