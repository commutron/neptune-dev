import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

const InUseCheck = ({ flowtitle, preFillKey })=> {
  
  const [ warn, warnSet ] = useState(false);
  
  useEffect( ()=> {
    if(!preFillKey) {
      warnSet(false);
    }else{
      Meteor.call('activeFlowCheck', preFillKey, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
      });
    }
  }, [preFillKey]);

  return(
    <div className='centre centreText'>
      <p className='nomargin nospace cap'><span>{flowtitle}: </span>
      {!warn ? <em>Not In Use</em> :
        warn === 'liveRiver' ?
        <b>In use by an Active {Pref.xBatch} as the {Pref.buildFlow}</b>
      : warn === 'liveAlt' ?
        <b>In use by an Active {Pref.xBatch} as the {Pref.buildFlowAlt}</b>
      : warn === 'offRiver' ?
        <b>In use by an Inactive {Pref.xBatch} as the {Pref.buildFlow}</b>
      : warn === 'offAlt' ?
        <b>In use by an Inactive {Pref.xBatch} as the {Pref.buildFlowAlt}</b>
      :
        <b>In use by ~unknown~</b>}
      </p>
    </div>
  );
};

export default InUseCheck;