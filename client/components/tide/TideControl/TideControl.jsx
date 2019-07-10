import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import './style.css';
        
const TideControl = ({ batch, tKey })=> {
  
  const tide = batch.tide;
  const currentLive = tide ?
    tide.find( x => x.tKey === tKey && x.who === Meteor.userId() )
    : false;
  
  //console.log({ tKey, currentLive });
  
  function handleStart() {
    Meteor.call('startTideTask', batch._id, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
      }
    });
  }
  function handleStop() {
    Meteor.call('stopTideTask', batch._id, tKey, (error)=> {
      if(error) {
        console.log(error);
        toast.error('Rejected by Server');
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
          disabled={false}
        ><b><i className="far fa-stop-circle tideIcon"></i></b>
        <br />STOP</button>
    )}
  }else{
    return(
      <button
        title={`START ${Pref.batch}`}
        className='tideIn'
        onClick={()=>handleStart()}
        disabled={false}
      ><i><i className="far fa-play-circle tideIcon"></i></i>
      <br />START</button>
    );
  }
};

export default TideControl;