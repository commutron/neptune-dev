import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './TideControl/style.css';
        
const TimeControl = ({ 
  timeId, timeOpen,
  type, link, project,
  timeLockOut,
  taskState, subtState,
  lockTaskSet
})=> {
  
  const thingMounted = useRef(true);
  const [lock, setLock] = useState(true);
  const [working, setWorking] = useState(false);
  
  const timer = ()=> Meteor.setTimeout( ()=>{ 
    if(thingMounted.current) {
      setLock(false);
      setWorking(false);
      lockTaskSet && lockTaskSet(false);
    }
  },1500);
  
  useEffect(() => {
    setLock(true);
    timer();
  }, [timeId]);
  
  useEffect(() => {
    return () => {
      thingMounted.current = false;
      Meteor.clearTimeout(timer);
    };
  }, []);
  
  const replyCallback = (error, re)=> {
    if(error) {
      console.log(error);
      toast.error('Rejected by Server');
    }
    if(re === true) {
      if(thingMounted.current) {
        timer();
        document.getElementById('lookup').focus();
      }
    }
  };
  
  function handleStart() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);

    Meteor.setTimeout( ()=>{
      Meteor.apply('startTimeSpan', [ type, link, project, taskState, subtState ],
      {wait: true, noRetry: true},
      (error, re)=> replyCallback(error, re) );
    }, 1500);
  }
  
  function handleStop() {
    setLock(true);
    setWorking(true);
    Meteor.apply('stopTimeSpan', [ timeId ], {wait: true, noRetry: true},
    (error, re)=> replyCallback(error, re) );
  }
  
  function handleSwitch() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);
    Meteor.setTimeout( ()=>{
      Meteor.apply('switchTimeSpan', [ timeId, type, link, project, taskState, subtState ],
      {wait: true, noRetry: true},
      (error, re)=> replyCallback(error, re) );
    }, 1500);
  }

  if(timeId && timeOpen) {
    return(
      <button
        aria-label={`STOP ${Pref.batch}`}
        className='tideOut'
        onClick={()=>handleStop()}
        disabled={lock}
      >
      <em>
        <span className='fa-stack tideIcon'>
          <i className="fas fa-circle-notch fa-stack-2x fa-spin tideIndicate"></i>
          <i className="fas fa-stop fa-stack-1x" data-fa-transform="shrink-1"></i>
        </span> 
      </em>
      </button>
    );
  }
  
  const disable = lock || timeLockOut || !taskState || subtState === false;
  
  if(!timeId && !timeOpen) {
    return(
      <button
        title={`START ${Pref.batch}`}
        className={`tideIn ${working ? 'startWork' : ''}`}
        onClick={()=>handleStart()}
        disabled={disable}
      >
      <b>
        <span className='fa-stack tideIcon'>
          <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
          <i className="fas fa-play fa-stack-1x" data-fa-transform="shrink-1 right-2"></i>
        </span>
      </b>START</button>
    );
  }
  
  if(timeId && !timeOpen) {
    return(
      <button
        title={`Switch to ${Pref.batch}`}
        className={`tideFlip ${working ? 'flipWork' : ''}`}
        onClick={()=>handleSwitch()}
        disabled={disable}
      >
      <i>
        <span className='fa-stack tideIcon'>
          <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
          <i className="fas fa-exchange-alt fa-stack-1x" data-fa-transform="shrink-1"></i>
        </span> 
      </i>SWITCH</button>
    );
  }
  
  return(
    <div className='tideLock'>
      <i>
        <span className='fa-stack tideIcon'>
          <i className="fas fa-ban fa-stack-2x tideIndicate"></i>
          <i className="fas fa-play fa-stack-1x" data-fa-transform="shrink-1 right-2"></i>
        </span>
      </i>
    </div>
  );
};

export default TimeControl;