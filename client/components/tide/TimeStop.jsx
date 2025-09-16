import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/public/pref.js';
import { toast } from 'react-toastify';
import './TideControl/style.css';
import { MultiRunning } from '/client/components/tide/TideControl/TideMulti';

const TimeStop = ({ tIdKey, timeOpen, etPro, etMlt, lockTaskSet })=> {
  
  const thingMounted = useRef(true);
  const [lock, setLock] = useState(true);
  
  const unlockAll = ()=> Meteor.setTimeout( ()=>{ 
    if(thingMounted.current) {
      setLock(false);
      lockTaskSet && lockTaskSet(false);
    }
  },1500);
  
  useEffect(() => {
    setLock(true);
    unlockAll();
  }, [tIdKey]);
  
  useEffect(() => {
    return () => {
      thingMounted.current = false;
      Meteor.clearTimeout(unlockAll);
    };
  }, []);
  
  const replyCallback = (err, re)=> {
    if(err) {
      console.log(err);
      toast.error('Rejected by Server');
      unlockAll();
    }
    if(re === true) {
      unlockAll();
      if(thingMounted.current) {
        document.getElementById('lookup').focus();
      }
    }
  };
      
  function handleStop() {
    setLock(true);
    
    if(etPro) {
      Meteor.apply('stopTideTask', [ tIdKey ], 
        {wait: true},
        (err, re)=> replyCallback(err, re) );
    }else {
      Meteor.apply('stopTimeSpan', [ tIdKey ], 
        {wait: true},
        (err, re)=> replyCallback(err, re) );
    }
  }
  
  if(etMlt && timeOpen) {
    return <MultiRunning lock={lock} />;
  }
  
  if(tIdKey && timeOpen) {
    return(
      <button
        aria-label='STOP Time'
        className='tideOut tideOutTip'
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