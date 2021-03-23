import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const UndoFinishX = ({ 
  batchId, finishedAtB, seriesId, serial, finishedAtI, 
  noText 
})=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'BRKt3rm1n2t1ng8r2nch') && 
                !finishedAtB && typeof finishedAtI === 'object';
  
  const icon = !finishedAtB ? 'fa-backward' : 'fa-lock';
  
  return(
    <ModelSmall
      button='Undo Finish'
      title={'Undo Finish and Reactivate ' + Pref.item}
      color='orangeT'
      icon={icon}
      lock={!auth}
      noText={noText}
    >
      <UndoFinishForm
        batchId={batchId}
        finishedAtB={finishedAtB}
        seriesId={seriesId}
        serial={serial}
        finishedAtI={finishedAtI} 
      />
    </ModelSmall>
  );
};

export default UndoFinishX;

const UndoFinishForm = ({ batchId, finishedAtB, seriesId, serial, finishedAtI, selfclose })=> {
  
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
  
  const howLong = moment().diff(moment(finishedAtI), 'hours');
  const grace = howLong < 24 || Roles.userIsInRole(Meteor.userId(), 'run');
    
  return(
    <div>
      {!grace ? <p className='centreText'>This action requires "Run" permission</p> :
                <p className='centreText'>This action requires "Complete" permission</p>}
      <p className='centreText'>After the {Pref.batch} is finished, {Pref.items} are locked and cannot be changed</p>
      <br />
      <p className='centreText'>This {Pref.item} was finished <b>{moment(finishedAtI).fromNow()}</b></p>
      
      <p className='centre'>
        <button
          id='notDone'
          className='action blueHover'
          onClick={()=>handleUndo()}
          disabled={!grace}
        >Undo Finish</button>
      </p>
    </div>
  );
};