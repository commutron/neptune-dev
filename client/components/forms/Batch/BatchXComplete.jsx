import React, { useState, useLayoutEffect, useEffect, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import '/client/components/riverX/waterfall/style';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import ModelInline from '/client/layouts/Models/ModelInline';

const BatchXComplete = ({ batchData, allFlow, allFall, nowater, quantity, canRun })=> {
  
  function finishBatchX() {
    const batchID = batchData._id;
    Meteor.call('finishBatchX', batchID, (error)=>{
      error && console.log(error);
    });
  }
  
  const [ datetime, datetimeSet ] = useState( moment().format() );
  const [ canBackDate, canBackDateSet ] = useState( false );
  const [ datesearch, datesearchSet ] = useState( null );
  
  useLayoutEffect( ()=>{
    if(batchData.completed) {
      datetimeSet(moment(batchData.completedAt).format());
    }
    if(batchData.completed && !batchData.lock && Roles.userIsInRole(Meteor.userId(), 'edit')) {
      canBackDateSet(true);
    }
  },[batchData]);
  
  useEffect( ()=>{
    if(canBackDate) {
      
      let countDates = [];
      if(canBackDate) {
        for(let w of batchData.waterfall || []) {
          if(w.counts.length > 0) {
            countDates.push(w.counts[w.counts.length-1].time);
          }
        }
      }
      
      let eventDates = [];
      if(canBackDate) {
        for(let e of batchData.events || []) {
          if(e.title === 'End of Process' || e.title === 'Start of Process') {
            eventDates.push(e.time);
          }
        }
      }
      
      const latestDate = Math.max( ...[ batchData.createdAt, countDates, eventDates ].flat().filter(f=>f) );
      datesearchSet( !latestDate ? null : moment(latestDate).startOf('minute').format() );
    }
  },[canBackDate]);
  
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
            >Complete<br />{Pref.xBatch}</button>
          </Fragment>
        : null
      :
        <Fragment>
          <h3 className='centreText margin5'>Completed</h3>
          <CompleteTimePicker
            datetime={datetime}
            datesearch={datesearch}
            completedAt={batchData.completedAt}
            canBackDate={canBackDate}
            datetimeSet={(e)=>datetimeSet(e)}
          />
          {canBackDate && !moment(batchData.completedAt).isSame(datetime, 'minute') ?
            <div className='vmarginhalf border3 borderBlue'>
              <p>
                <button
                  onClick={(e)=>backdateFinish(e)}
                  className='action blueSolid'
                >Save Backdate</button>
              </p>
            </div>
          : null}
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
            <ModelInline 
              title={`Reopen ${Pref.xBatch}`}
              color='purple'
              border='borderPurple'
              icon='fa-solid fa-repeat'
              lock={!canRun || !canBackDate}
            >
              <div title="Must enter organization PIN to reopen">
                <input
                  id='orgPINunlock'
                  autoComplete="false"
                  className='miniIn12 interSelect centreText'
                  pattern='[\d\d\d\d]*'
                  maxLength='4'
                  minLength='4'
                  placeholder='PIN'
                  required
                /><br />
                <button
                  className='action purpleSolid'
                  onClick={(e)=>undoFinishBatchX(true, this.orgPINunlock.value)}
                >Yes, Reopen</button>
              </div>
            </ModelInline>
          : null
          }
      
        </Fragment>
      }
    </div>
  );
};
  
export default BatchXComplete;

const CompleteTimePicker = ({ datetime, datesearch, completedAt, canBackDate, datetimeSet })=> {
  
  if(!canBackDate) {
    return(
      <p style={{fontSize:'var(--tx0)'}} className='bottomLine line15x margin5 blackblackT'>{moment(datetime).format('YYYY-MM-DD hh:mm A')}</p>
    );
  }
  return(
    <Flatpickr
      id='backDateTime'
      value={datetime}
      className='minWide transparent margin5 blackblackT'
      onChange={(e)=> datetimeSet( this.backDateTime.value )}
      options={{
        defaultDate: datetime,
        minDate: datesearch,
        maxDate: moment(completedAt).endOf('minute').format(),
        minuteIncrement: 1,
        enableTime: true,
        time_24hr: false,
        altInput: true,
        altFormat: "Y-m-d G:i K",
      }}
      disabled={!canBackDate}
      required
    />
)};