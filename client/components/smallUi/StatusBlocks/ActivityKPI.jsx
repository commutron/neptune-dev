import React, { useRef, useState, useEffect } from 'react';

import KpiStat from './KpiStat';

const ActivityKPIData = ({ batchID, isDebug })=> {

  const thingMounted = useRef(true);
  const [ acData, setPriority ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('tideActivityLevel', batchID, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        if(thingMounted.current) { setPriority( reply ); }
        isDebug && console.log(reply);
      }
    });
  }, [batchID]);
  
  useEffect( ()=> {
    return () => { thingMounted.current = false };
  }, []);
  
  return(
    <ActivityKPI 
      batchID={batchID} 
      acData={acData}
      isDebug={isDebug} />
  );
};

export default ActivityKPIData;


export const ActivityKPI = ({ batchID, acData, isDebug })=> {
  
  const ac = acData && acData.isActive;
  
  isDebug && console.log(batchID+':ac:'+JSON.stringify(ac));

  if( ac && acData.batchID === batchID ) {
    
    const mvSty = [
      {
        icon: 'fas fa-minus',
        name: 'No Activity',
        color: 'var(--silver)'
      },
      {
        icon: 'fas fa-shoe-prints',
        name: 'Past Activity',
        color: 'var(--emerald)'
      },
      {
        icon: 'fas fa-person',
        name: 'Active Today',
        color: 'var(--emerald)'
      },
      {
        icon: 'fas fa-walking',
        name: 'Active Now',
        color: 'var(--emerald)'
      },
      {
        icon: 'fas fa-running',
        name: 'Active Now',
        color: 'var(--emerald)'
      }
    ];
    
    const movesty = ac.isNow > 1 ? mvSty[4] : 
                   ac.isNow > 0 ? mvSty[3] : 
                   ac.hasHour || ac.hasDay ? mvSty[2] : 
                   !ac.hasNone ? mvSty[1] : mvSty[0];
                   
    const noun = (num)=> num === 1 ? 'person' : 'people';
    
    const nTxt = `Active Now: ${ac.isNow} ${noun(ac.isNow)}`;
    const hTxt = `In the last hour: ${ac.hasHour} ${noun(ac.hasHour)}`;
    const dTxt = `Sometime today: ${ac.hasDay} ${noun(ac.hasDay)}`;
    
    
    const work = <dl className='readlines'>
      <dt className='bold'>{nTxt}</dt>
      <dd className='topVpad'>{hTxt}</dd>
      <dd>{dTxt}</dd>
    </dl>;

    return(
      <KpiStat
        title='Activity Level'
        icon={movesty.icon}
        name={movesty.name}
        color={movesty.color}
        more={work}
      />
    );
  }
  
  return(
    <KpiStat
      title='Activity Unknown'
      num='?'
      name='Unknown'
      color='unset'
    />
  );
};