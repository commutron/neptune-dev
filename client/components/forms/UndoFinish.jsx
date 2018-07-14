import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const UndoFinish = ({ id, serial, finishedAt, timelock, noText })=>	{
  
  const handleUndo = ()=> {
    const override = timelock ? prompt("Enter PIN to override", "") : false;
    Meteor.call('pullFinish', id, serial, override, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
        Meteor.call('pushUndoFinish', id, serial, (error)=>{
          error && console.log(error);
        });
      }else{
        Bert.alert(Alert.warning);
      }
    });
  };
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'finish') && finishedAt !== false;
  
  return(
    <ModelMedium
      button='Undo Finish'
      title={'Undo Finish and Reactivate ' + Pref.item}
      color='yellowT'
      icon='fa-backward'
      lock={!auth}
      noText={noText}>
      <div>
        <p className='centreText'>After one hour, reactivating an {Pref.item} requires an override</p>
        <p className='centreText'>After the {Pref.batch} is finished, {Pref.items} are locked and cannot be changed</p>
        <p className='centreText'>
          <i>This {Pref.item} was finished <b>{moment(finishedAt).fromNow()}</b></i>
        </p>
        <p className='centre'>
          <button
            id='notDone'
            className='action blueHover'
            onClick={()=>handleUndo()}
          >Undo Finish</button>
        </p>
      </div>
    </ModelMedium>
  );
};

export default UndoFinish;