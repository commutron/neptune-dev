import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import { CalcSpin } from '/client/components/tinyUi/Spin';

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
  
  const toDay = (t, o=0)=> moment(t).addWorkingTime(Math.round(o), 'days').format('dddd MMMM Do YYYY');
  const toDur = (d)=> d < 0 ? ` ~ ${Math.abs(Math.round(d))} workdays ago` : ` ~ in ${Math.round(d)} workdays`;
  const label = (l)=> l ? <n-sm-i> (Actual)</n-sm-i> : <n-sm-i> (Estimation)</n-sm-i>;
  
  const flrRel = floorRelease ? floorRelease.time : false;
  const flgap = flrRel ? moment(flrRel).workingDiff(est[0], 'days', true) : 0;
  
  const flDelay = flrRel ? flgap : est[1] < 0 ? est[1] : 0;
  
  const tide = batchData.tide || [];
  const stTide = tide.length > 0 ? tide[0].startTime : false;
  const stgap = stTide ? moment(stTide).workingDiff(est[2], 'days', true) : 0;
  
  const stDelay = stTide ? stgap : est[3] < 0 ? est[3] : 0;
  
  const fitems = seriesData ? seriesData.items.filter( i => i.completed ) : [];
  const itemS = fitems.sort( (i1, i2)=>
    i1.completedAt < i2.completedAt ? -1 : i1.completedAt > i2.completedAt ? 1 : 0 );
  const fin = itemS.length > 0 ? itemS[0].completedAt : false; 
  
  const comp = batchData.completed ? batchData.completedAt : false;
  
  return(
    <div className='space'>
      <h3>Benchmarks</h3>
      
      <n-timeline>
        {!batchData.completed || flrRel ?
          <n-timeline-item>
            <n-timeline-info>
              {flrRel ? toDay(flrRel) : toDay(est[0]) + toDur(est[1])}
              {label(flrRel)}
            </n-timeline-info>
            <n-timeline-marker class={flrRel ? 'done' : ''} />
            <n-timeline-title>Release</n-timeline-title>
          </n-timeline-item>
        : null}
        
        {batchData.completed && tide.length === 0 ? null :
          <n-timeline-item>
            <n-timeline-info>
              {stTide ? toDay(stTide) : toDay(est[2], flDelay) + toDur(est[3]+flDelay)}
              {label(stTide)}
            </n-timeline-info>
            <n-timeline-marker class={stTide ? 'done' : ''} />
            <n-timeline-title>Production Start</n-timeline-title>
          </n-timeline-item>
        }
        
        {seriesData &&
          <n-timeline-item>
            <n-timeline-info>
              {fin ? toDay(fin) : toDay(est[4], stDelay) + toDur(est[5]+stDelay)}
              {label(fin)}
            </n-timeline-info>
            <n-timeline-marker class={fin ? 'done' : ''} />
            <n-timeline-title>First Finished Item</n-timeline-title>
          </n-timeline-item>
        }
        
        <n-timeline-item>
          <n-timeline-info>
            {comp ? toDay(comp) : 
             toDay(est[6], stDelay) + toDur(est[7]+stDelay)}
            {label(comp)}
          </n-timeline-info>
          <n-timeline-marker class={comp ? 'done' : ''} />
          <n-timeline-title>All Completed</n-timeline-title>
        </n-timeline-item>
      </n-timeline>
      
      {batchData.completed ? null :
      <p className='lightgray fade max600 nomargin'
      >DISCLAIMER:<br /> An estimated date is an extrapolation of the product's historical average turn around. 
      They are not outright predictions as they do not factor in workload or supply.
      Estimations should be read as context and inform realistic planning.
      </p>}
    </div>
  );
};

export default TimeNextChunk;