import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideControl = ({ batchID, tideKey, currentLive, tideLockOut })=> {
  
  const [lock, setLock] = useState(false);
  
  function timerUnlock() {
	  return Meteor.setTimeout( ()=>{
      setLock(false);
    },5000);
  }
  
  useEffect(() => {
    return () => { Meteor.clearInterval(timerUnlock); };
  }, []);
  
  function handleStart() {
    setLock(true);
    Meteor.call('startTideTask', batchID, (error, reply)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }
      if(reply) {
        timerUnlock();
        document.getElementById('lookup').focus();
      }
    });
  }
  function handleStop() {
    setLock(true);
    Meteor.call('stopTideTask', batchID, tideKey, (error, reply)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }
      if(reply) {
        timerUnlock();
        document.getElementById('lookup').focus();
      }
    });
  }
  
  function handleSwitch() {
    setLock(true);
    Meteor.call('switchTideTask', tideKey, batchID, (error, reply)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }
      if(reply) {
        timerUnlock();
        document.getElementById('lookup').focus();
      }
    });
  }

  if(tideKey) {
    if(!currentLive) {
      return(
        <button
          title={`Switch to ${Pref.batch}`}
          className='tideFlip'
          onClick={()=>handleSwitch()}
        >
        <i>
          <span className="fa-stack fa-fw tideIcon">
            <i className="far fa-circle fa-stack-2x tideIndicate"></i>
            <i className="fas fa-exchange-alt fa-stack-1x" data-fa-transform="shrink-1"></i>
          </span> 
        </i>
        <br />SWITCH</button>
      );
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
        disabled={lock || tideLockOut}
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