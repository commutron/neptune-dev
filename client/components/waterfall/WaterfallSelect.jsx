import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Waterfall from './Waterfall.jsx';

const WaterfallSelect = ({ batchData, app })=> {
  
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

  let allTotal = [];
    
  Session.set('nowStep', '');
  Session.set('nowWanchor', '');
  return (
    <div className='waterfallSelector'>
      {batchData.waterfall.length === 0 ?
        <div className='wide space orangeBorder'>
          <p>No {Pref.counter}s are assigned</p>
        </div>
      :
      batchData.waterfall.map( (entry)=>{
        let total = entry.counts.length > 0 ?
          Array.from(entry.counts, x => x.tick).reduce((x,y)=> x + y) :
        0;
        const clear = total >= batchData.quantity;
        allTotal.push(clear);
        const type = app.countOption.find( x => x.key === entry.wfKey ).type;
        //let bannerColor = 'blue';
        let borderColor = 'borderBlue';
        let fadeColor = 'Blue';
        //// Style the Stone Accordingly \\\\
      	if(type === 'inspect'){
      	  //bannerColor = 'green';
      		borderColor = 'borderGreen';
      		fadeColor = 'Green';
        }else if(type === 'checkpoint'){
          //bannerColor = 'white';
      		borderColor = 'borderWhite';
      		fadeColor = 'White';
        }else if(type === 'test'){
          //bannerColor = 'teal';
      		borderColor = 'borderTeal';
      		fadeColor = 'Teal';
        }else if(type === 'finish'){
          //bannerColor = 'purple';
      		borderColor = 'borderPurple';
      		fadeColor = 'Purple';
        }else{
          null }
        const bannerColor = fadeColor.toLowerCase();
        return(
          <details key={entry.wfKey} className='waterfallWrap'>
            <summary className={'waterfallTitle ' + bannerColor}>{entry.gate}</summary>
            <Waterfall
              id={batchData._id}
              fall={entry}
              total={total}
              quantity={batchData.quantity}
              lock={batchData.completed === true}
              app={app}
              borderColor={borderColor}
              fadeColor={fadeColor} />
          </details>
      )})}
      {allTotal.every( x => x === true ) &&
        <div className='centre vspace purpleBorder'>
          {batchData.completed === false ?
            <div className='centre'>
              <p className='centreText'>
                <i>All assigned processes are complete</i>
              </p>
              <button
                className='action clearPurple'
                onClick={()=>finishBatchX()}
                disabled={!Roles.userIsInRole(Meteor.userId(), 'finish')}
              >Complete {Pref.xBatch}</button>
            </div>
          :
            <div className='centre'>
              <h2 className='actionBox centreText green'>
                Completed: {moment(batchData.completedAt).calendar()}
              </h2>
              {moment().diff(moment(batchData.completedAt), 'minutes') < 60 ?
                <div className='centre'>
                  <button
                    className='action clearWhite'
                    onClick={()=>undoFinishBatchX(false)}
                    disabled={!Roles.userIsInRole(Meteor.userId(), 'finish')}
                  >Reactivate</button>
                </div>
              :
              <div className='centre'>
                <p className='centreText'>
                  <i>This {Pref.xBatch} was completed more than an hour ago</i>
                </p>
                <button
                  className='action clearWhite'
                  onClick={()=>undoFinishBatchX(true)}
                  disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
                >Reactivate Anyway</button>
              </div>}
            </div>
          }
        </div>}
    </div>
  );
};
  
export default WaterfallSelect;