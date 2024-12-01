import React, { Fragment, useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const UndoFinish = ({ 
  batchId, seriesId, serial, completedAtI, rapidData, rapids,
  access
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
  
  const howLong = completedAtI ? moment().diff(moment(completedAtI), 'hours') : 0;
  
  const grace = howLong < Pref.completeGrace || Roles.userIsInRole(Meteor.userId(), 'run');
  
  const completedRapids = rapids.filter(r=> r.completed);
  
  return(
    <ModelNative
      dialogId={serial+'_undofin_form'}
      title={`Undo Finish and Reactivate ${Pref.item}`}
      icon='fa-solid fa-backward'
      colorT='orangeT'
      dark={false}>
      <Fragment>
      {rapids.length > 0 ?
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
    :
      <div className='readlines'>
        <p className='centreText'>After the {Pref.xBatch} is complete, {Pref.items} are locked and cannot be changed.</p>
        
        <p className='centreText'>This {Pref.item} was finished <b>{completedAtI ? moment(completedAtI).fromNow() : 'not yet'}.</b></p>
        
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
      }
      </Fragment>
    </ModelNative>
  );
};

export default UndoFinish;