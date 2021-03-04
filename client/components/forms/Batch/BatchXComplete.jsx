import React, { useState, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import '/client/components/riverX/waterfall/style';

const BatchXComplete = ({ batchData, allFlow, allFall, nowater, canRun })=> {
  
  const [ reopenState, reopenSet ] = useState(false);
  
  function finishBatchX() {
    const batchID = batchData._id;
    Meteor.call('finishBatchX', batchID, (error)=>{
      error && console.log(error);
    });
  }
  function undoFinishBatchX(late, pinInput) {
    const batchID = batchData._id;
    const override = late ? pinInput : false;
    if(batchData.completed === true) {
      Meteor.call('undoFinishBatchX', batchID, override, (error, reply)=>{
        error && console.log(error);
        reply ? null : toast.error('Cannot Perform Function');
      });
    }
  }
  
  const canFin = Roles.userIsInRole(Meteor.userId(), "BRKt3rm1n2t1ng8r2nch");

  return(
    <div className='endBox borderPurple'>
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
              disabled={!canFin}
            >Complete {Pref.xBatch}</button>
          </Fragment>
        : null
      :
        <Fragment>
          <h3 className='centreText'>
            Completed: {moment(batchData.completedAt).calendar()}
          </h3>
          {moment().diff(moment(batchData.completedAt), 'minutes') < 60 ?
            <div className='centre'>
              <p>
                <i>This {Pref.xBatch} was completed less than an hour ago</i>
              </p>
              <button
                className='action clearPurple'
                onClick={()=>undoFinishBatchX(false)}
                disabled={!canFin}
              >Cancel Complete</button>
            </div>
          :
          canFin && !batchData.lock ?
            !reopenState ?
              <div>
                <button
                  className='action clearPurple'
                  onClick={()=>reopenSet(true)}
                  disabled={!canRun}
                >Reopen</button>
              </div>
            :
              <div title="Must enter organization PIN to reopen">
                <input
                  id='orgPIN'
                  autoComplete="false"
                  className='miniIn12 interSelect centreText'
                  pattern='[\d\d\d\d]*'
                  maxLength='4'
                  minLength='4'
                  placeholder='PIN'
                  required />
                  <br />
                <button
                  className='action clearPurple'
                  onClick={(e)=>undoFinishBatchX(true, this.orgPIN.value)}
                >Yes, Reopen</button>
              </div>
            
          : null
          }
        </Fragment>
      }
    </div>
  );
};
  
export default BatchXComplete;