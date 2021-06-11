import React from 'react';

const AvgStat = ({ num, trend, type, flip })=> (
  <span title={trend || ''} className='beside bigger'>
    <n-num class='centre'>{num}<n-sm class='grayT cap'>{type}</n-sm></n-num>
    {!trend ? null :
      trend === 'up' ?
        <n-fa1>
          <i className={`fas fa-long-arrow-alt-up ${flip ? 'redT' : 'greenT'}`}></i>
        </n-fa1>
      :
      trend === 'down' ?
        <n-fa2>
          <i className={`fas fa-long-arrow-alt-down ${flip ? 'greenT' : 'redT'}`}></i>
        </n-fa2> 
      :
        <n-fa3><i className='fas fa-caret-right darkgrayT'></i></n-fa3>
    }
  </span>
);

export default AvgStat;