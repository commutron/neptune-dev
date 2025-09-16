import { Random } from 'meteor/random'
import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './style.css';
        
const TideSwitch = ({ 
  batchID, tideKey, 
  timeOpen, tideLockOut,
  taskState, qtSubState, lockTaskSet
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
  
  function handleSwitch() {
    setLock(true);
    setWorking(true);
    lockTaskSet && lockTaskSet(true);
    let newRndm = actionID;
    const newSubT = qtSubState?.[1] || false;
    const newQtK = qtSubState?.[0] || null;
    Meteor.setTimeout( ()=>{
      Meteor.apply('switchTideTask', [ tideKey, true, batchID, newRndm, taskState, newSubT, newQtK ],
      {wait: true},
      (error, reply)=> {
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
      });
    }, 1500);
  }
  
  if(tideKey && !timeOpen) {
    
    const disable = lock || tideLockOut || !taskState || !qtSubState;
  
    return(
      <button
        title={`Switch Task`}
        className={`tideFlip ${working ? 'flipWork' : ''}`}
        onClick={()=>handleSwitch()}
        disabled={disable}
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