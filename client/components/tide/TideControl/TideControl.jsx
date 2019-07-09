import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

        
const TideControl = ({ batchId, tKey, lock })=> {
  
  console.log({ batchId, tKey, lock });
  
  function handleStart() {
    Meteor.call('startTideTask', batchId, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }
    });
  }
  function handleStop() {
    Meteor.call('stopTideTask', batchId, tKey, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }
    });
  }

  if(tKey) {
    return(
      <button
        title="STOP"
        className='action'
        onClick={()=>handleStop()}
        disabled={lock}
      ><i className="fas fa-history fa-lg fa-fw"></i>STOP</button>
  )}
  
  return(
    <button
      title="START"
      className='action'
      onClick={()=>handleStart()}
      disabled={lock}
    ><i className="fas fa-history fa-lg fa-fw"></i>START</button>
  );
};

export default TideControl;