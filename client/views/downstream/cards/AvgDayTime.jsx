import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import 'moment-timezone';
import Pref from '/client/global/pref.js';
import AvgStat from '/client/components/tinyUi/AvgStat';

const AvgDay = ({ traceDT, app, isNightly })=> {
 
  const [ stat, statSet ] = useState(false);
    
  useEffect( ()=> {
    Meteor.call('getAvgDayCache', (err, re)=>{
      err && console.log(err);
      statSet(re);
    });
  }, []);

  if(!stat) {
    return null;
  }
  
  return(
    <div className='centre max250 centreText cap'>
      <h3>average daily production time</h3>
      <AvgStat num={stat.avgTime[0]} trend={stat.avgTime[1]} type='minutes' />
      <hr />
      <h3>average daily completed {Pref.items}</h3>
      <AvgStat num={stat.avgItem[0]} trend={stat.avgItem[1]} type={Pref.items} />
    </div>
  );
};

export default AvgDay;