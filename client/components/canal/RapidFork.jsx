import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import useTimeOut from '/client/utility/useTimeOutHook.js';

const RapidFork = ({ seriesId, serial, rapidData })=> {

  const [ lockState, lockSet ] = useState(true);

  const conUnlock = ()=> {
    if(Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect'])) {
      lockSet(false);
    }
  };
  useTimeOut( conUnlock, 2000 );
  
  function handleFork() {
    const rapId = rapidData.rapDo._id;
    Meteor.call('setRapidFork', seriesId, serial, rapId, (error)=>{
      error && console.log(error);
    });
  }
  
  if(rapidData.rapDid.includes(rapidData.rapDo._id) === false) { 
    return(
      <div id='srtcsc' className='vmargin centre'>
        <button
          type='button'
          form='srtcsc'
          className='forkButton'
          onClick={(e)=>handleFork(e)}
          disabled={lockState}
        ><i className='fas fa-bolt fa-fw'></i>
         <b>Extend {Pref.item}</b>
         <i>{rapidData.rapDo.rapid}<wbr /> {rapidData.rapDo.issueOrder}</i>
        </button>
      </div>
    );
  }
  
  return null;
};

export default RapidFork;