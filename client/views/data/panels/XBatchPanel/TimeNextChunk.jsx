import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

const TimeNextChunk = ({
  batchData, seriesData, widgetData,
  floorRelease, done, app
})=> {
  
  const [ est, estSet] = useState(false);

  useEffect( ()=>{
    Meteor.call('estBatchTurnAround', batchData._id, widgetData._id, (err, re)=>{
      err && console.log(err);
      re && estSet(re);
      // [ relEst, relDif, wrkEst, wrkDif, finEst, finDif, cmpEst, cmpDif]
    });
  }, []);
  
  if(est === false) {
    return <CalcSpin />;
  }
  
  if(est === 'na') {
    return(
      <p>no est</p>
    );
  }
  
  const toDay = (t)=> moment(t).format('dddd MMMM Do YYYY');
  const toDur = (d)=> d > 0 ? ` (in ${d} workdays)` : ` (${Math.abs(d)} workdays ago)`;
  
  const flrRel = floorRelease ? floorRelease.time : false;
  
  const stTide = batchData.tide.length > 0  ? batchData.tide[0].startTime : false;
  
  const fitems = seriesData ? seriesData.items.filter( i => i.completed ) : [];
  const itemS = fitems.sort( (i1, i2)=>
    i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0 );
  const fin = itemS.length > 0 ? itemS[0].completedAt : false; 
   
  const comp = batchData.completed ? batchData.completedAt : false;
  
  return(
    <div className='space'>
      <h3>Estimated Benchmarks</h3>
      
      <p>
        Release: {toDay(est[0])}
        <n-sm>{flrRel ? ` (Real: ${toDay(flrRel)})` : toDur(est[1])}</n-sm>
      </p>
      
      <p>
        Production Start: {toDay(est[2])}
        <n-sm>{stTide ? ` (Real: ${toDay(stTide)})` : toDur(est[3])}</n-sm>
      </p>
      
      <p>
        First Completed Item: {toDay(est[4])}
        <n-sm>{fin ? ` (Real: ${toDay(fin)})` : toDur(est[5])}</n-sm>
      </p>
      
      <p>
        All Completed: {toDay(est[6])}
        <n-sm>{comp ? ` (Real: ${toDay(comp)})` : toDur(est[7])}</n-sm>
      </p>
      
    </div>
  );
};

export default TimeNextChunk;