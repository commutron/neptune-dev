import { Random } from 'meteor/random'
import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideSwitch = ({ 
  batchID, tideKey, 
  tideFloodGate, tideLockOut,
  taskState, lockTaskSet
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
    }, 2000);
  }
  
  if(tideKey && !tideFloodGate) {
    return(
      <button
        title={`Switch to ${Pref.batch}`}
        className={`tideFlip ${working ? 'flipWork' : ''}`}
        onClick={()=>handleSwitch()}
        disabled={lock || tideLockOut}
      ><i><i className="fas fa-exchange-alt tideIcon tideIndicate"></i></i>
      </button>
    );
  }
  
  return(
    <button className='tideLock' disabled={true}>
      <b><i className="fas fa-ban tideIcon tideIndicate"></i></b>
    </button>
  );
};

export default TideSwitch;