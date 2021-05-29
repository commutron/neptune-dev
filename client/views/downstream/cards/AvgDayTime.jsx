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
    <div className='centre max250 centreText cap'>
      <h3>average daily production time</h3>
      <AvgStat num={stat.avgTime[0]} trend={stat.avgTime[1]} type='minutes' />
      <hr />
      <h3>average daily completed {Pref.items}</h3>
      <AvgStat num={stat.avgItem[0]} trend={stat.avgItem[1]} type={Pref.items} />
      <hr />
      <h3>average time logged from 0% to 50% {Pref.items} completed</h3>
      <AvgStat num={stat.avgShar[0]+'%'} trend={false} type='' />
    </div>
  );
};

export default AvgDay;

const AvgStat = ({ num, trend, type })=> (
  <span title={trend || ''} className='beside bigger'>
    <n-num class='centre'>{num}<n-sm>{type}</n-sm></n-num>
    {!trend ? null :
    trend === 'up' ?
    <n-fa1><i className='fas fa-long-arrow-alt-up greenT'></i></n-fa1> :
    trend === 'down' ?
    <n-fa2><i className='fas fa-long-arrow-alt-down redT'></i></n-fa2> :
    <n-fa3><i className='fas fa-caret-right darkgrayT'></i></n-fa3>
    }
  </span>
);