import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const UndoFinish = ({ id, finishedAtB, serial, finishedAtI, timelock, noText })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'BRKt3rm1n2t1ng8r2nch') && 
    finishedAtB === false && finishedAtI !== false;
  
  const icon = finishedAtB === false ? 'fa-backward' : 'fa-lock';
  
  return(
    <ModelMedium
      button='Undo Finish'
      title={'Undo Finish and Reactivate ' + Pref.item}
      color='yellowT'
      icon={icon}
      lock={!auth}
      noText={noText}>
      <UndoFinishForm
        id={id}
        finishedAtB={finishedAtB}
        serial={serial}
        finishedAtI={finishedAtI} />
    </ModelMedium>
  );
};

const UndoFinishForm = ({ id, finishedAtB, serial, finishedAtI, selfclose })=> {
  
  const handleUndo = ()=> {
    Meteor.call('pullFinish', id, serial, (error, reply)=>{
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

export default UndoFinish;