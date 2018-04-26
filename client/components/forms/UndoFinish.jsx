import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

const UndoFinish = ({ id, serial, finishedAt, noText })=>	{
  
  const handleUndo = ()=> {
    if(moment(finishedAt).isSame(moment(), 'hour')) {
      Meteor.call('pullFinish', id, serial, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          Bert.alert(Alert.success);
        }else{
          Bert.alert(Alert.warning);
        }
      });
    }else{
      Bert.alert(Alert.warning);
    }
  };
  
  const timeElapsed = finishedAt !== false ? moment().diff(moment(finishedAt), 'minutes') : 0;
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'finish') && 
               finishedAt !== false && timeElapsed < 60;
  const timeLeft = timeElapsed > 60 ? 0 : 60 - timeElapsed;
  
  return(
    <Model
      button='Undo Finish'
      title='Undo Finish'
      color='yellowT'
      icon='fa-backward'
      lock={!auth}
      noText={noText}>
      <fieldset className='centre centreTrue space clean' disabled={!auth}>
        <div>
          <p className='centreText'>After One Hour items are locked and cannot be changed</p>
          <br />
          <p className='centreText'>
            <i>There are <b>{timeLeft}</b> minutes left to re-activate this {Pref.item}</i>
          </p>
          <br />
          <p className='centre'>
            <button
              id='notDone'
              className='action blueHover'
              onClick={()=>handleUndo()}
            >Undo Finish</button>
          </p>
        </div>
      </fieldset>
    </Model>
  );
};
 export default UndoFinish;