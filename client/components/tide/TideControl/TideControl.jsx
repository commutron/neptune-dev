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
        >
        <em>
          <span className="fa-stack fa-fw tideIcon">
            <i className="fas fa-circle-notch fa-stack-2x fa-spin tideIndicate"></i>
            <i className="fas fa-stop fa-stack-1x" data-fa-transform="shrink-1"></i>
          </span> 
        </em>
        <br />STOP</button>
    )}
  }else{
    return(
      <button
        title={`START ${Pref.batch}`}
        className='tideIn'
        onClick={()=>handleStart()}
        disabled={lock}
      >
      <b>
        <span className="fa-stack fa-fw tideIcon">
          <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
          <i className="fas fa-play fa-stack-1x" data-fa-transform="shrink-1 right-2"></i>
        </span>
      </b>
      <br />START</button>
    );
  }
};

export default TideControl;