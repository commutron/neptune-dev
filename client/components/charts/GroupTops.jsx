import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';

const GroupTops = ({ groupId, alias })=> {
  
  const thingMounted = useRef(true);
  
  const [ total, totalSet ] = useState(false);
  const [ avgNC, avgNCSet ] = useState(false);
  const [ avgPf, avgPfSet ] = useState(false);
  const [ trend, trendSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('groupTops', groupId, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          totalSet(re.ontime.find(z=>z.x=='on time').y);
          avgNCSet(re.avgNC);
          avgPfSet(re.avgPf);
          trendSet(re.trend);
        }
      }
    });
  }, []);
  
  const title = `
    Averages of ${alias.toUpperCase()} ${Pref.xBatchs}\ngoing back ${Pref.avgSpan} days to ${moment().subtract(Pref.avgSpan, 'days').format('MMMM D YYYY')}
    `;
  
  const trendIcon =  trend === false ?
    <n-fa0><i className='fas fa-spinner fa-spin'></i></n-fa0> :
    trend === 'up' ?
      <n-fa1><i className='fas fa-arrow-up greenT'></i></n-fa1> :
    trend === 'down' ?
      <n-fa2><i className='fas fa-arrow-down redT'></i></n-fa2> :
    <n-fa3><i className='fas fa-minus'></i></n-fa3>;
        
  return(
    <div className='centreRow vmarginhalf' title={title}>
      
      <NumStatBox
        number={total !== false ? `${total}%` : <n-fa0><i className='fas fa-spinner fa-spin'></i></n-fa0>}
        name='On Time'
        title=""
        borderColour="rgb(46, 204, 113)"
      />
      
      <NumStatBox
        number={avgPf !== false ? avgPf : <n-fa1><i className='fas fa-spinner fa-spin'></i></n-fa1>}
        name='Performance'
        title=""
        borderColour="var(--amethyst)"
      />
      
      <NumStatBox
        number={avgNC !== false ? avgNC : <n-fa2><i className='fas fa-spinner fa-spin'></i></n-fa2>}
        name='NonCon Rate'
        title=""
        borderColour="var(--alizarin)"
      />
      
      <NumStatBox
        number={trendIcon}
        name='Trending'
        title={`Metrics are trending ${trend || 'flat'}.\nTrend is a messure of the 3 other stats.`}
        borderColour={
          !trend || trend == 'flat' ? 'black' : 
          trend == 'down' ? 'var(--alizarin)' : 'var(--emerald)'}
      />
      
    </div>
  );
};

export default GroupTops;