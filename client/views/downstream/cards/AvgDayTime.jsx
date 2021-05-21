import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import 'moment-timezone';
import Pref from '/client/global/pref.js';

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
    <div className='centre max250 centreText'>
      <h3>Average Daily Production Time</h3>
      <AvgStat num={stat.avgTime[0]} trend={stat.avgTime[1]} type='minutes' />
      <hr />
      <h3>Average Daily Completed {Pref.items}</h3>
      <AvgStat num={stat.avgItem[0]} trend={stat.avgItem[1]} type={Pref.items} />
    </div>
  );
};

export default AvgDay;

const AvgStat = ({ num, trend, type })=> (
  <span title={trend} className='beside bigger'>
    <n-num class='centre'>{num}<n-sm>{type}</n-sm></n-num>
    {trend === 'up' ?
    <n-fa1><i className='fas fa-long-arrow-alt-up greenT'></i></n-fa1> :
    trend === 'down' ?
    <n-fa2><i className='fas fa-long-arrow-alt-down redT'></i></n-fa2> :
    <n-fa3><i className='fas fa-caret-right darkgrayT'></i></n-fa3>
    }
  </span>
);