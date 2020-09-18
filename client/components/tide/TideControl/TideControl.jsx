import { Random } from 'meteor/random'
import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideControl = ({ 
  batchID, tideKey, 
  tideFloodGate, tideLockOut,
  taskState, stopOnly, lockTaskSet
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
  },3000);
  
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
      Meteor.call('startTideTask', batchID, null, newRndm, taskState, (error, reply)=> {
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
    }, 3000);
  }
  function handleStop() {
    setLock(true);
    setWorking(true);
    Meteor.call('stopTideTask', tideKey, (error, reply)=> {
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
      Meteor.call('switchTideTask', tideKey, batchID, newRndm, taskState, (error, reply)=> {
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
    }, 3000);
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
        <span className='fa-stack fa-fw tideIcon'>
          <i className="fas fa-circle-notch fa-stack-2x fa-spin tideIndicate"></i>
          <i className="fas fa-stop fa-stack-1x" data-fa-transform="shrink-1"></i>
        </span> 
      </em>
      {/*<br />STOP */}
      </button>
    );
  }
  
  if(!tideKey && !tideFloodGate && !stopOnly) {
    return(
      <button
        title={`START ${Pref.batch}`}
        className={`tideIn ${working ? 'startWork' : ''}`}
        onClick={()=>handleStart()}
        disabled={lock || tideLockOut}
      >
      <b>
        <span className='fa-stack fa-fw tideIcon'>
          <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
          <i className="fas fa-play fa-stack-1x" data-fa-transform="shrink-1 right-2"></i>
        </span>
      </b>
      <br />START</button>
    );
  }
  
  if(tideKey && !tideFloodGate && !stopOnly) {
    return(
      <button
        title={`Switch to ${Pref.batch}`}
        className={`tideFlip ${working ? 'flipWork' : ''}`}
        onClick={()=>handleSwitch()}
        disabled={lock || tideLockOut}
      >
      <i>
        <span className='fa-stack fa-fw tideIcon'>
          <i className="far fa-circle fa-stack-2x tideIndicate"></i>
          <i className="fas fa-exchange-alt fa-stack-1x" data-fa-transform="shrink-1"></i>
        </span> 
      </i>
      <br />SWITCH</button>
    );
  }
  
  return(
    <button className='tideLock' disabled={true}>
      <b>
        <span className='fa-stack fa-fw tideIcon'>
          <i className="fas fa-ban fa-stack-2x tideIndicate"></i>
          <i className="fas fa-play fa-stack-1x" data-fa-transform="shrink-1 right-2"></i>
        </span>
      </b>
      {/*<br />LOCKED */}
    </button>
  );
};

export default TideControl;