import React, { useRef, useState, useEffect } from 'react';

const TideActivityData = ({ batchID, isDebug })=> {

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
    <TideActivitySquare 
      batchID={batchID} 
      acData={acData}
      isDebug={isDebug} />
  );
};

export default TideActivityData;


export const TideActivitySquare = ({ batchID, acData })=> {
  
  const ac = acData && acData.isActive;

  if( ac && acData.batchID === batchID ) {
    
    const moving = ac.isNow > 1 ? 'run' : 
                   ac.isNow > 0 ? 'walk' : 
                   !ac.hasNone ? 'still' : false;
    
    const movedClass = ac.hasHour > 0 ? 'greenT' : 
                       ac.hasDay > 0 ? 'greenT fadeMore' :
                       'grayT fadeMore';
    
    const iconState = !moving ?
      <n-fa0><i className='fas fa-minus fa-2x fa-fw grayT fade'></i></n-fa0>
      : moving === 'still' ?
      <n-fa1><i className={`fas fa-shoe-prints ${movedClass} fa-2x fa-fw`}></i></n-fa1>
      : moving === 'walk' ?
      <n-fa2><i className='fas fa-walking greenT fa-2x fa-fw'></i></n-fa2>
      :
      <n-fa3><i className='fas fa-running greenT fa-2x fa-fw'></i></n-fa3>;
      
    const noun = (num)=> num === 1 ? 'person' : 'people';
    
    const nTxt = `Active Now: ${ac.isNow} ${noun(ac.isNow)}`;
    const joiner = `Other Activity:`;
    const hTxt = `   in the last hour: ${ac.hasHour} ${noun(ac.hasHour)}`;
    const dTxt = `   sometime today: ${ac.hasDay} ${noun(ac.hasDay)}`;
    
    const title = `${nTxt}\n${joiner}\n${hTxt}\n${dTxt}`;

    return(
      <div className='infoSquareOuter noCopy center' title={title}>
        {iconState}
      </div>
    );
  }
  
  return(
    <div className='infoSquareOuter noCopy' title='activity unknown'>
      <i className='medBig'>?</i>
    </div>
  );
};