import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
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
    return <p>no est</p>;
  }
  
  const toDay = (t, o = 0)=> moment(t).addWorkingTime(o, 'days').format('dddd MMMM Do YYYY');
  const toDur = (d)=> d > 0 ? ` (in ${d} workdays)` : ` (${Math.abs(d)} workdays ago)`;
  
  const flrRel = floorRelease ? floorRelease.time : false;
  
  const flgap = flrRel ? moment(flrRel).workingDiff(est[0], 'days') : 0;
      
  const stTide = batchData.tide.length > 0  ? batchData.tide[0].startTime : false;
  const stgap = stTide ? moment(stTide).workingDiff(est[2], 'days') : 0;
  
  const fitems = seriesData ? seriesData.items.filter( i => i.completed ) : [];
  const itemS = fitems.sort( (i1, i2)=>
    i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0 );
  const fin = itemS.length > 0 ? itemS[0].completedAt : false; 
  const fngap = fin ? moment(fin).workingDiff(est[4], 'days') : 0;
  
  const comp = batchData.completed ? batchData.completedAt : false;
  
  return(
    <div className='space'>
      <h3>Approximate Benchmarks</h3>
      
      <n-timeline>
        <n-timeline-item>
          <n-timeline-info title={`${toDay(est[0])}`}>
            {flrRel ? toDay(flrRel) : `${toDay(est[0])} (${toDur(est[1])})`}
          </n-timeline-info>
          <n-timeline-marker class={flrRel ? 'done' : ''} />
          <n-timeline-title>Release</n-timeline-title>
        </n-timeline-item>
        
        <n-timeline-item>
          <n-timeline-info title={`${toDay(est[2])} ${flgap}`}>
            {stTide ? toDay(stTide) : `${toDay(est[2])} (${toDur(est[3])})`}
          </n-timeline-info>
          <n-timeline-marker class={stTide ? 'done' : ''} />
          <n-timeline-title>Production Start</n-timeline-title>
        </n-timeline-item>
        
        {seriesData &&
          <n-timeline-item>
            <n-timeline-info title={`${toDay(est[4])} ${flgap+stgap}`}>
              {fin ? toDay(fin) : `${toDay(est[4])} (${toDur(est[5])})`}
            </n-timeline-info>
            <n-timeline-marker class={fin ? 'done' : ''} />
            <n-timeline-title>First Completed Item</n-timeline-title>
          </n-timeline-item>
        }
        
        <n-timeline-item>
          <n-timeline-info title={`${toDay(est[6])} ${flgap+stgap+fngap}`}>
            {comp ? toDay(comp) : `${toDay(est[6])} (${toDur(est[7])})`}
          </n-timeline-info>
          <n-timeline-marker class={comp ? 'done' : ''} />
          <n-timeline-title>All Completed</n-timeline-title>
        </n-timeline-item>
      </n-timeline>
    </div>
  );
};

export default TimeNextChunk;