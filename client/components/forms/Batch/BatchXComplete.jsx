import React, { useState, useLayoutEffect, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import '/client/components/riverX/waterfall/style';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const BatchXComplete = ({ batchData, allFlow, allFall, nowater, quantity, canRun })=> {
  
  const [ reopenState, reopenSet ] = useState(false);
  
  function finishBatchX() {
    const batchID = batchData._id;
    Meteor.call('finishBatchX', batchID, (error)=>{
      error && console.log(error);
    });
  }
  
  const [ datetime, datetimeSet ] = useState( moment().format() );
  
  useLayoutEffect( ()=>{
    if(batchData.completed) {
      datetimeSet(moment(batchData.completedAt).format());
    }
  },[batchData]);
  
  function backdateFinish() {
    const batchID = batchData._id;
    const setback = moment(datetime).format();
    Meteor.call('fixCompleteTime', batchID, setback, (err)=>{
      err && console.log(err);
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
  
  const canBackDate = batchData.completed && 
    !batchData.lock && Roles.userIsInRole(Meteor.userId(), 'edit');
  
  const datesearch = canBackDate ?
    Math.max(...[
      batchData.createdAt,
      ...Array.from(batchData.waterfall || [], w => 
          w.counts[w.counts.length-1].time ),
      ...Array.from(batchData.events || [], e => {
          if(e.title === 'End of Process' || e.title === 'Start of Process' ){ return e.time } })
    ].filter(f=>f)) : null;

  return(
    <div className='endBox borderPurple'>
      {batchData.completed === false ?
        quantity > 0 &&
        nowater || (allFlow && allFall) ?
          <Fragment>
            <p className='centreText'>
              {nowater ?
                <i>No assigned processes</i> :
                <i>All assigned processes are complete</i> }
            </p>
            <button
              className='action purpleSolid'
              onClick={()=>finishBatchX()}
              disabled={!canFin}
            >Complete {Pref.xBatch}</button>
          </Fragment>
        : null
      :
        <Fragment>
          <h3 className='centreText margin5'>Completed</h3>
          <Flatpickr
            id='backDateTime'
            value={datetime}
            className='minWide transparent margin5 blackblackT'
            onChange={(e)=> datetimeSet( this.backDateTime.value )}
            options={{
              defaultDate: datetime,
              minDate: !datesearch ? null : moment(datesearch).startOf('minute').format(),
              maxDate: moment(batchData.completedAt).endOf('minute').format(),
              minuteIncrement: 1,
              enableTime: true,
              time_24hr: false,
              altInput: true,
              altFormat: "Y-m-d G:i K",
            }}
            disabled={!canBackDate}
            required
          />
          {moment().diff(moment(batchData.completedAt), 'minutes') < 60 ?
            <div className='centre'>
              <p>
                <i>This {Pref.xBatch} was completed less than an hour ago</i>
              </p>
              <button
                className='action purpleSolid'
                onClick={()=>undoFinishBatchX(false)}
                disabled={!canFin}
              >Cancel Complete</button>
            </div>
          :
          canFin && !batchData.lock ?
            !reopenState ?
              <div>
                <button
                  className='action purpleSolid'
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
                  className='action purpleSolid'
                  onClick={(e)=>undoFinishBatchX(true, this.orgPIN.value)}
                >Yes, Reopen</button>
              </div>
            
          : null
          }
          {canBackDate && !moment(batchData.completedAt).isSame(datetime, 'minute') ?
            <div className='vmarginhalf blueBorder'>
              <p>
                <button
                  onClick={(e)=>backdateFinish(e)}
                  className='smallAction blueHover'
                >Save Backdate</button>
              </p>
            </div>
          : null}
      
        </Fragment>
      }
    </div>
  );
};
  
export default BatchXComplete;