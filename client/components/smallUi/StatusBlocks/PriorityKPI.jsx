import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import 'moment-timezone';

import { min2hr, avgOfArray } from '/client/utility/Convert.js';
import KpiStat from './KpiStat';

const PriorityKPIData = ({ 
  batchID, app, dbDay, mockDay, isDone, stOpen, isDebug
})=> {
  
  const thingMounted = useRef(true);
  const [ ptData, setPriority ] = useState(false);
  
  useEffect( ()=> {
    if(mockDay) {
      Meteor.call('priorityRank', batchID, false, mockDay, (error, reply)=>{
        error && console.log(error);
        if( reply ) { 
          if(thingMounted.current) { setPriority( reply ); }
          isDebug && console.log(ptData);
        }
      });
    }else{
      Meteor.call('priorityTrace', batchID, (error, reply)=>{
        error && console.log(error);
        if( reply ) { 
          if(thingMounted.current) { setPriority( reply ); }
          isDebug && console.log(ptData);
        }
      });
    }
  }, [batchID, dbDay, mockDay]);
  
  useEffect( ()=> {
    return () => { thingMounted.current = false };
  }, []);
  
  return( 
    <PriorityKPI 
      batchID={batchID} 
      ptData={ptData}
      isDone={isDone}
      stOpen={stOpen}
      app={app}
      isDebug={isDebug}
    /> 
  );
};

export default PriorityKPIData;


export const PriorityKPI = ({ 
  batchID, ptData, isDone, oRapid, stOpen, app, isDebug, core
})=> {
  
  const pt = ptData;
  const q2t = pt?.quote2tide || 0;
  const doneQuote = q2t > 0 ? `Remaining Quoted: ${min2hr(q2t)} hours` : `Over Quoted: ${Math.abs(min2hr(q2t))} hours`;
  
  const doneSty = [
    {
      color: 'var(--nephritis)',
      icon: 'fa-solid fa-star',
      name: 'Complete'
    },
    {
      color: 'var(--pumpkin)',
      icon: 'fa-solid fa-bolt',
      name: 'Extended'
    }
  ];
  
  if(isDone) {
    const dsty = oRapid ? doneSty[1] : doneSty[0];
    return(
      <KpiStat
        title='Priority Rank'
        icon={dsty.icon}
        name={dsty.name}
        color={dsty.color}
        core={core}
      />
    );
  }

  if( pt && pt.batchID === batchID ) {
    
    const e2t = pt.est2tide;
    const bffrTime = pt.estEnd2fillBuffer;
    const bffrRel = pt.bffrRel;
    // const overQuote = pt.overQuote;
    // isDebug && console.log({pt, batchID, bffrRel, bffrTime, e2t, overQuote});
    
    if(pt.completed) {
      const ptsty = pt.oRapid ? doneSty[1] : doneSty[0];
      return(
        <KpiStat
          title='Priority Rank'
          icon={ptsty.icon}
          name={ptsty.name}
          color={ptsty.color}
          core={core}
        />
      );
    }
    
    const exitsty = {
      color: 'unset',
      num: 'X',
      name: 'unset'
    };
    
    if(!pt.hold && ( bffrRel === undefined || bffrRel === null || bffrRel === false )) {
      return(
        <KpiStat
          title='Priority Rank'
          num={exitsty.num}
          name={exitsty.name}
          color={exitsty.color}
          core={core}
        />
      );
    }
    
    const e2i = pt.est2item || 0;
    const e2iTxt = `production curve est.: ${min2hr(e2i)} hours`;
    const e2tTxt = `past performance est.: ${min2hr(e2t)} hours`;
    
    const avgRmn = avgOfArray([q2t, e2t, e2i], true);
    const treTxt = `Best Estimate: ~${min2hr(Math.max(0,avgRmn))} hours`;
    
    const onTime = !pt.estSoonest ? null : new Date(pt.shipAim) > new Date(pt.estSoonest);
    const ontmTxt = onTime ? 'Predicted On Time' : onTime === false ? 'Predicted Late' : 'Prediction Unavailable';
    const soonTxt = `Earliest Complete: ~${moment(pt.estSoonest).format("ddd, MMM Do, h:mm a")}`;
    
    const startby = moment().addWorkingTime(bffrTime, 'minutes').format();
    
    const recondue = moment(startby).addWorkingTime(e2t, 'minutes').format();
    
    console.log({startby, recondue});
    
    const work = <dl className='readlines'>
      <dt className='bold'>{pt.lateLate ? 'Is Late' : ontmTxt}</dt>
      <dd>{soonTxt}</dd>
      <dd>{doneQuote}</dd>
      <dt className='topVpad bold'>Remaining Time</dt>
      <dd>{treTxt}</dd>
      <dd><small>{e2tTxt}</small></dd>
      <dd><small>{e2iTxt}</small></dd>
      {isDebug && <dd>{`q2t: ${q2t}\n\ne2t: ${e2t}\ne2i: ${e2i}\n\n${soonTxt}\n\nbuffer: ${bffrTime || 0} minutes\nbffrRel: ${pt.bffrRel}`}</dd>}
    </dl>;
    
    if(pt.hold) {
      return(
        <KpiStat
          title='Priority Rank'
          num="||"
          name='ON HOLD'
          color='var(--wetasphalt)'
          more={work}
          stOpen={stOpen}
          core={core}
        />
      );
    }
    
    const rankSty = [
      {
        color: 'var(--peterriver)',
        num: bffrRel,
        name: 'LOW'
      },
      {
        color: 'var(--sunflower)',
        num: bffrRel,
        name: 'MEDIUM'
      },
      {
        color: 'var(--carrot)',
        num: bffrRel,
        name: 'HIGH'
      },
      {
        color: 'var(--pumpkin)',
        num: 'U',
        name: 'URGENT'
      },
      {
        color: 'var(--pomegranate)',
        num: 'S!',
        name: 'SEVERE'
      }
    ];
    
    const pScl = !app.priorityScale ? { low: 66, high: 22, max: 0 } : app.priorityScale;
    // const overClass = overQuote ? 'moreEphasis' : '';
    
    const scsty = 
      bffrRel > pScl.low ? rankSty[0] :
      bffrRel > pScl.high ? rankSty[1] : 
      bffrRel > pScl.max ? rankSty[2] :
      bffrRel <= pScl.max ? pt.lateLate ? rankSty[4] : rankSty[3] :
      exitsty;
    
    return(
      <KpiStat
        title='Priority Rank'
        num={scsty.num}
        name={scsty.name}
        color={scsty.color}
        more={work}
        stOpen={stOpen}
        core={core}
      />
    );
  }
  
  return(
    <KpiStat
      title='Priority Rank'
      num='?'
      name='UNKNOWN'
      color='unset'
      core={core}
    />
  );
};