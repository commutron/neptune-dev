import { Random } from 'meteor/random'
import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideControl = ({ 
  batchID, tideKey, 
  tideFloodGate, tideLockOut,
  taskState, subtState, stopOnly, lockTaskSet
})=> {
  
  const thingMounted = useRef(true);
  const [actionID, setActionID] = useState( Random.id() );
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
  }, [tideKey]);
  
  useEffect(() => {
    return () => {
      thingMounted.current = false;
      Meteor.clearTimeout(timer);
    };
  }, []);
  
  function handleStart() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);
    let newRndm = actionID;
    Meteor.setTimeout( ()=>{
      Meteor.apply('startTideTask', [ batchID, newRndm, taskState, subtState ],
      {wait: true, noRetry: true},
      (error, reply)=> {
        if(error) {
          console.log(error);
          toast.error('Rejected by Server');
        }
        if(reply === true) {
          if(thingMounted.current) {
            setActionID(Random.id());
            timer();
            document.getElementById('lookup').focus();
          }
        }
      });
    }, 1500);
  }
  function handleStop() {
    setLock(true);
    setWorking(true);
    Meteor.apply('stopTideTask', [ tideKey ], {wait: true, noRetry: true},
    (error, reply)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }
      if(reply === true) {
        if(thingMounted.current) {
          setActionID(Random.id());
          timer();
          document.getElementById('lookup').focus();
        }
      }
    });
  }
  
  function handleSwitch() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);
    let newRndm = actionID;
    Meteor.setTimeout( ()=>{
      Meteor.apply('switchTideTask', [ tideKey, batchID, newRndm, taskState, subtState ],
      {wait: true, noRetry: true},
      (error, reply)=> {
        if(error) {
          console.log(error);
          toast.error('Rejected by Server');
        }
        if(reply === true) {
          if(thingMounted.current) {
            setActionID(Random.id());
            timer();
            document.getElementById('lookup').focus();
          }
        }
      });
    }, 1500);
  }

  if(tideKey && tideFloodGate) {
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
  
  const disable = lock || tideLockOut || !taskState || subtState === false;
  
  if(!tideKey && !tideFloodGate && !stopOnly) {
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
  
  if(tideKey && !tideFloodGate && !stopOnly) {
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
    <button className='tideLock' disabled={true}>
      <i>
        <span className='fa-stack tideIcon'>
          <i className="fas fa-ban fa-stack-2x tideIndicate"></i>
          <i className="fas fa-play fa-stack-1x" data-fa-transform="shrink-1 right-2"></i>
        </span>
      </i>
    </button>
  );
};

export default TideControl;