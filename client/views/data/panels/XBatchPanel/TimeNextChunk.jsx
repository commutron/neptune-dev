import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

const TimeNextChunk = ({
  batchData, widgetData,
  floorRelease, done, app
})=> {
  
  const [ est, estSet] = useState(null);

  useEffect( ()=>{
    Meteor.call('estBatchTurnAround', batchData._id, widgetData._id, (err, re)=>{
      err && console.log(err);
      estSet(re);
      // [ relEst, relDif, wrkEst, wrkDif, finEst, finDif ]
    });
  }, []);
  
  if(est === null) {
    return <CalcSpin />;
  }
  
  if(est === 'na') {
    return(
      <p>no est</p>
    );
  }
  
  const toDay = (t)=> moment(t).format('ddd MMMM Do YYYY');
  
  const flrRel = floorRelease ? floorRelease.time : false;
  
  const stTide = batchData.tide.length > 0  ? batchData.tide[0].startTime : false;
  
  const finfin = batchData.completed ? batchData.completedAt : false;
  
  
  return(
    <div>
      <p>Release: {flrRel && toDay(flrRel)} / {toDay(est[0])} / in {est[1]} days</p>
      
      <p>Start Tide: {stTide && toDay(stTide)} / {toDay(est[2])} / in {est[3]} days</p>
      
      <p>Complete: {finfin && toDay(finfin)} / {toDay(est[4])} / in {est[5]} days</p>
    
              
    </div>
  );
};

export default TimeNextChunk;