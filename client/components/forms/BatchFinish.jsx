import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const BatchFinish = ({ batchId, alreadyDone })=>	{
  
  const handleFinish = ()=> {
    Meteor.call('finishBatch', batchId, false, (error)=>{
      error && console.log(error);
    });
  };
  const auth = Roles.userIsInRole(Meteor.userId(), 'finish') && !alreadyDone;
  
  return(
    <ModelMedium
      button='Finish'
      title={'Finish ' + Pref.batch}
      color='whiteT'
      icon='fa-flag-checkered fa-2x'
      lock={!auth}
      noText={false}>
      <div>
        <p className='centreText'>All the {Pref.items} are finished</p>
        <p className='centreText'>Would you like to finish the {Pref.batch}?</p>
        <p className='centre'>
          <button
            id='isDone'
            className='action greenHover'
            onClick={()=>handleFinish()}
          >Finish {Pref.batch}</button>
        </p>
      </div>
    </ModelMedium>
  );
};

export default BatchFinish;