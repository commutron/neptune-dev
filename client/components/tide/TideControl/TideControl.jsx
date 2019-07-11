import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideControl = ({ batchID, tideKey, currentLive })=> {
  
  const [lock, setLock] = useState(false);
  
  function handleStart() {
    setLock(true);
    Meteor.call('startTideTask', batchID, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }else{
        setLock(false);
      }
    });
  }
  function handleStop() {
    setLock(true);
    Meteor.call('stopTideTask', batchID, tideKey, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }else{
        setLock(false);
      }
    });
  }

  if(tideKey) {
    if(!currentLive) {
      return null;
    }else{
      return(
        <button
          title={`STOP ${Pref.batch}`}
          className='tideOut'
          onClick={()=>handleStop()}
          disabled={lock}
        ><b><i className="far fa-stop-circle tideIcon"></i></b>
        <br />STOP</button>
    )}
  }else{
    return(
      <button
        title={`START ${Pref.batch}`}
        className='tideIn'
        onClick={()=>handleStart()}
        disabled={lock}
      ><i><i className="far fa-play-circle tideIcon"></i></i>
      <br />START</button>
    );
  }
};

export default TideControl;