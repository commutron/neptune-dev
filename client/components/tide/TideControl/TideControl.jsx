import { Random } from 'meteor/random'
import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
import { MultiDivert } from '/client/components/tide/TideControl/TideMulti';

const TideControl = ({ 
  batchID, tideKey, engagedPro, engagedMlti,
  timeOpen, tideLockOut,
  taskState, subtState, stopOnly, lockTaskSet
})=> {
  
  const thingMounted = useRef(true);
  const [actionID, setActionID] = useState( Random.id() );
  const [lock, setLock] = useState(true);
  const [working, setWorking] = useState(false);
  
  const unlockAll = ()=> Meteor.setTimeout( ()=>{ 
    if(thingMounted.current) {
      setLock(false);
      setWorking(false);
      lockTaskSet && lockTaskSet(false);
    }
  },1500);
  
  useEffect(() => {
    setLock(true);
    unlockAll();
  }, [tideKey]);
  
  useEffect(() => {
    return () => {
      thingMounted.current = false;
      Meteor.clearTimeout(unlockAll);
    };
  }, []);
  
  const replyCallback = (error, reply)=> {
    if(error) {
      console.log(error);
      toast.error('Rejected by Server');
      unlockAll();
    }
    if(reply === true) {
      unlockAll();
      if(thingMounted.current) {
        setActionID(Random.id());
        document.getElementById('lookup').focus();
      }
    }
  };
  
  function handleStart() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);
    let newRndm = actionID;
    Meteor.setTimeout( ()=>{
      Meteor.apply('startTideTask', [ batchID, newRndm, taskState, subtState ],
      {wait: true, noRetry: false },
      (error, reply)=> replyCallback(error, reply) );
    }, 1000);
  }
  
  function handleSwitch() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);
    let newRndm = actionID;
    Meteor.setTimeout( ()=>{
      Meteor.apply('switchTideTask', [ tideKey, engagedPro, batchID, newRndm, taskState, subtState ],
      {wait: true, noRetry: false },
      (error, reply)=> replyCallback(error, reply) );
    }, 1000);
  }
  
  const disable = lock || tideLockOut || !taskState || subtState === false;
  
  if(engagedMlti) {
    return <MultiDivert lock={lock} />;
  }
  
  if(!tideKey && !timeOpen && !stopOnly) {
    return(
      <button
        title={`START ${Pref.xBatch}`}
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
  
  if(tideKey && !timeOpen && !stopOnly) {
    return(
      <button
        title={`Switch to ${Pref.xBatch}`}
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