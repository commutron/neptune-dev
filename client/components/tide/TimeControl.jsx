import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './TideControl/style.css';
import { MultiDivert } from '/client/components/tide/TideControl/TideMulti';

const TimeControl = ({ 
  timeId, timeOpen,
  type, link, project,
  engagedPro, engagedMlti,
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
    }, 500);
  }
  
  function handleSwitch() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);
    Meteor.setTimeout( ()=>{
      Meteor.apply('switchTimeSpan', [ timeId, engagedPro, type, link, project, taskState, subtState ],
      {wait: true, noRetry: true},
      (error, re)=> replyCallback(error, re) );
    }, 500);
  }
  
  const disable = lock || timeLockOut || !taskState || subtState === false;
  
  if(engagedMlti) {
    return <MultiDivert lock={lock} />;
  }
  
  if(!timeLockOut && !timeId && !timeOpen) {
    return(
      <button
        title='START'
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
  
  if(!timeLockOut && timeId && !timeOpen) {
    return(
      <button
        title={`Switch to ${Pref.maintain}`}
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
      <i className='big centreText'>Not Available</i>
    </div>
  );
};

export default TimeControl;