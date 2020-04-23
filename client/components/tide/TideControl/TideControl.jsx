import { Random } from 'meteor/random'
import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideControl = ({ batchID, tideKey, tideFloodGate, tideLockOut })=> {
  
  const thingMounted = useRef(true);
  const [actionID, setActionID] = useState( Random.id() );
  const [lock, setLock] = useState(false);
  
  // useEffect(() => {
  //   const timer = Meteor.setTimeout( ()=>{ setLock(false); },5000);
  //   return () => { 
  //     Meteor.clearTimeout(timer);
  //     thingMounted.current = false;
  //   };
  // }, [actionID]);
  
  const timer = ()=> Meteor.setTimeout( ()=>{ 
    if(thingMounted.current) {
      setLock(false); 
    }
  },5000);
  
  useEffect(() => {
    return () => {
      thingMounted.current = false;
      Meteor.clearTimeout(timer);
    };
  }, []);
  
  function handleStart() {
    setLock(true);
    let newRndm = actionID;
    Meteor.call('startTideTask', batchID, null, newRndm, (error, reply)=> {
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
  function handleStop() {
    setLock(true);
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
    let newRndm = actionID;
    Meteor.call('switchTideTask', tideKey, batchID, newRndm, (error, reply)=> {
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

  if(tideKey) {
    if(!tideFloodGate) {
      return(
        <button
          title={`Switch to ${Pref.batch}`}
          className='tideFlip'
          onClick={()=>handleSwitch()}
          disabled={lock || tideLockOut}
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