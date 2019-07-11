import React, { useState /*, useEffect*/ } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideControl = ({ batch, tKey })=> {
  
  const [lock, setLock] = useState(false);
  // useEffect(() => {
  //   console.log({lock});
  // });
  
  const tide = batch.tide;
  const currentLive = tide ?
    tide.find( x => x.tKey === tKey && x.who === Meteor.userId() )
    : false;
  
  function handleStart() {
    setLock(true);
    Meteor.call('startTideTask', batch._id, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }else{
        setLock(false);
      }
    });
  }
  function handleStop() {
    setLock(true);
    Meteor.call('stopTideTask', batch._id, tKey, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }else{
        setLock(false);
      }
    });
  }

  if(tKey) {
    if(!currentLive) {
      return null;
    }else{
      return(
        <button
          title={`STOP ${Pref.batch}`}
          className='tideOut'
          onClick={()=>handleStop()}
          disabled={lock}
        ><b><i className="far fa-stop-circle tideIcon"></i></b>
        <br />STOP</button>
    )}
  }else{
    return(
      <button
        title={`START ${Pref.batch}`}
        className='tideIn'
        onClick={()=>handleStart()}
        disabled={lock}
      ><i><i className="far fa-play-circle tideIcon"></i></i>
      <br />START</button>
    );
  }
};

export default TideControl;