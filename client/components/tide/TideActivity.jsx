import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
import moment from 'moment';
import 'moment-timezone';

const TideActivityData = ({ batchID, app })=> {

  const thingMounted = useRef(true);
  const [ acData, setPriority ] = useState(false);
  
  useEffect( ()=> {
    const clientTZ = moment.tz.guess();
    Meteor.call('tideActivityLevel', batchID, clientTZ, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        if(thingMounted.current) { setPriority( reply ); }
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(reply);
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
      app={app} />
  );
};

export default TideActivityData;

///////////////////////////////////////////////////////////////////////////////

export const TideActivitySquare = ({ batchID, acData, app })=> {
  
  const ac = acData && acData.isActive;
  
  //const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
   
  if( ac && acData.batchID === batchID ) {
    
    const moving = ac.isNow > 1 ? 'run' : 
                   ac.isNow > 0 ? 'walk' : 
                   !ac.hasNone ? 'still' : false;
    
    const movedClass = ac.hasHour > 0 ? 'greenT' : 
                       ac.hasDay > 0 ? 'greenT fadeMore' :
                       'grayT fadeMore';
    
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({ac});
    
    const iconState = !moving ?
      <strong><i className='fas fa-minus fa-2x fa-fw grayT fade'></i></strong>
      : moving === 'still' ?
      <em className={movedClass}><i className='fas fa-shoe-prints fa-2x fa-fw'></i></em>
      : moving === 'walk' ?
      <b><i className='fas fa-walking greenT fa-2x fa-fw'></i></b>
      :
      <i><i className='fas fa-running greenT fa-2x fa-fw'></i></i>;
      
    const noun = (num)=> num === 1 ? 'person' : 'people';
    
    const nTxt = `Active Now: ${ac.isNow} ${noun(ac.isNow)}`;
    const joiner = `Other Activity:`;
    const hTxt = `   in the last hour: ${ac.hasHour} ${noun(ac.hasHour)}`;
    const dTxt = `   sometime today: ${ac.hasDay} ${noun(ac.hasDay)}`;
    
    const title = `${nTxt}\n${joiner}\n${hTxt}\n${dTxt}`;

    return(
      <div title={title}>
        <div className='infoSquareOuter noCopy'>
          {iconState}
          <br />
          <i className='label infoSquareLabel'>Activity</i>
        </div>
      </div>
    );
  }
  
  return(
    <div title='activity unknown'>
      <div className='infoSquareOuter noCopy'>
        <i className='medBig'>?</i>
        <br />
        <i className='label infoSquareLabel'></i>
      </div>
    </div>
  );
};