import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './TideControl/style.css';
        
const TimeStop = ({ tIdKey, timeOpen, etPro, lockTaskSet })=> {
  
  const thingMounted = useRef(true);
  const [lock, setLock] = useState(true);
  
  const timer = ()=> Meteor.setTimeout( ()=>{ 
    if(thingMounted.current) {
      setLock(false);
      lockTaskSet && lockTaskSet(false);
    }
  },1500);
  
  useEffect(() => {
    setLock(true);
    timer();
  }, [tIdKey]);
  
  useEffect(() => {
    return () => {
      thingMounted.current = false;
      Meteor.clearTimeout(timer);
    };
  }, []);
  
  const replyCallback = (err, re)=> {
    if(err) {
      console.log(err);
      toast.error('Rejected by Server');
    }
    if(re === true) {
      if(thingMounted.current) {
        timer();
        document.getElementById('lookup').focus();
      }
    }
  };
      
  function handleStop() {
    setLock(true);
    
    if(etPro) {
      Meteor.apply('stopTideTask', [ tIdKey ], 
        {wait: true, noRetry: true},
        (err, re)=> replyCallback(err, re) );
    }else{
      Meteor.apply('stopTimeSpan', [ tIdKey ], 
        {wait: true, noRetry: true},
        (err, re)=> replyCallback(err, re) );
    }
  }
  
  if(tIdKey && timeOpen) {
    return(
      <button
        aria-label='STOP Time'
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

export default TimeStop;