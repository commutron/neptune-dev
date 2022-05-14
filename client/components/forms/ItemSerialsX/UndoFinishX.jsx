import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const UndoFinishX = ({ 
  batchId, completedAtB, seriesId, serial, completedAtI, rapidData, rapids,
  noText 
})=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), 'BRKt3rm1n2t1ng8r2nch');
  const clear = !completedAtB && typeof completedAtI === 'object';
  const title = !access ? Pref.norole : !clear ? `Cannot undo finish while ${Pref.xBatch} is complete` :
  `Undo Finish and Reactivate ${Pref.item}`;
  
  return(
    <ModelSmall
      button='Undo Finish'
      title={title}
      color='orangeT'
      icon={'fa-backward'}
      lock={!access || !clear}
      noText={noText}
    >
      <UndoFinishForm
        batchId={batchId}
        seriesId={seriesId}
        serial={serial}
        completedAtI={completedAtI}
        rapidData={rapidData}
        rapids={rapids}
      />
    </ModelSmall>
  );
};

export default UndoFinishX;

const UndoFinishForm = ({ 
  batchId, seriesId, serial, completedAtI, rapidData, rapids,
  selfclose
})=> {
  
  const [ pinOpen, pinOpenSet ] = useState(false);
  
  const tempPinOpen = ()=> {

    const pinVal = this.temporgPINitem ? this.temporgPINitem.value : undefined;
    
    Meteor.call('checkPIN', pinVal, (err, reply)=>{
      err && console.log(err);
      if(reply === true) {
        pinOpenSet(true);
      }else{
        pinOpenSet(false);
      }
    });
  };
  
  const handleUndo = ()=> {
    Meteor.call('pullFinishX', batchId, seriesId, serial, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
        selfclose();
      }else{
        toast.error('Server Error');
      }
    });
  };
  
  const handleRapidUndo = (rapId)=> {
    Meteor.call('unfinishRapidFork', seriesId, serial, rapId, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
        selfclose();
      }else{
        toast.error('Server Error');
      }
    });
  };
  
  const howLong = moment().diff(moment(completedAtI), 'hours');
  const grace = howLong < Pref.completeGrace || Roles.userIsInRole(Meteor.userId(), 'run');
  
  const completedRapids = rapids.filter(r=> r.completed);
  
  if(rapids.length > 0) {
    return(
      <div>
        <p className='centreText bold'>This {Pref.item} has been {Pref.rapidExd}.</p>
        <p className='centreText bold'>The original {Pref.flow} can no longer be unfinished.</p>
      <br />
      {completedRapids.length > 0 ?
        <div>
          {completedRapids.map( (rentry, rindex)=>{
            const rapid = rapidData.find(x=> x._id === rentry.rapId);
            if(rapid.live === false) {
              return(
                <p key={rindex} className='centreText'
                  >{rapid.rapid} is closed.
                </p>
              );
            }
            return(
            <p key={rindex} className='centreText'>
              <button
                id='notDone'
                className='action orangeSolid'
                onClick={()=>handleRapidUndo(rentry.rapId)}
              >Undo {rapid.rapid} Finish</button>
            </p>
          )})}
        </div>
      : null } 
      </div>
    );
  }
  
  return(
    <div className='readlines'>
      <p className='centreText'>After the {Pref.xBatch} is complete, {Pref.items} are locked and cannot be changed.</p>
      
      <p className='centreText'>This {Pref.item} was finished <b>{moment(completedAtI).fromNow()}.</b></p>
      
      {!grace ? <p className='centreText'>This action requires "Run" permission.</p> :
                <p className='centreText'>This action requires "Complete" permission.</p>}
      
      {!grace ? 
        <p className='centreText'>
          <input
            id='temporgPINitem'
            autoComplete="false"
            className='noCopy miniIn12 interSelect centreText gap clearBlack'
            pattern='[\d\d\d\d]*'
            maxLength='4'
            minLength='4'
            placeholder='PIN'
            required 
          />
          <button
            onClick={(e)=>tempPinOpen(e)}
            className='smallAction blackHover'
            id='pindo'
          >Temporary Access</button>
        </p>
      : null}
      
      <p className='centre'>
        <button
          id='notDone'
          className='action orangeSolid'
          onClick={()=>handleUndo()}
          disabled={!grace && !pinOpen}
        >Undo Finish</button>
      </p>
    </div>
  );
};