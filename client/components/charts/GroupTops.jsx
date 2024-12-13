import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStatRing from '/client/components/charts/Dash/NumStatRing';

const GroupTops = ({ groupId, alias })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  const [ total, totalSet ] = useState(false);
  const [ avgNC, avgNCSet ] = useState(false);
  const [ avgPf, avgPfSet ] = useState(false);
  const [ trend, trendSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('groupTops', groupId, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re.ontime);
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
      
      <NumStatRing
        total={total !== false ? `${total}%` :
          <n-fa0><i className='fas fa-spinner fa-spin'></i></n-fa0>}
        nums={tickXY || []}
        name='On Time'
        colour={["rgb(46, 204, 113)", "rgb(241, 196, 15)"]}
        maxSize='chart10Shrink'
      />
      
      <NumStatRing
        total={avgPf !== false ? avgPf :
          <n-fa1><i className='fas fa-spinner fa-spin'></i></n-fa1>}
        nums={[{x:1,y:1}]}
        name='Performance'
        colour={['#000']}
        noGap={true}
        maxSize='chart10Shrink'
      />
      
      <NumStatRing
        total={avgNC !== false ? avgNC :
          <n-fa2><i className='fas fa-spinner fa-spin'></i></n-fa2>}
        nums={[{x:1,y:1}]}
        name='NonCon Rate'
        colour='redTri'
        noGap={true}
        maxSize='chart10Shrink'
      />
      
      <NumStatRing
        total={trendIcon}
        nums={[{x:1,y:1}]}
        name='Trending'
        title={`Metrics are trending ${trend || 'flat'}.\nTrend is a messure of the 3 other stats.`}
        colour={
          !trend || trend == 'flat' ? ['#000'] : 
          trend == 'down' ? 'redTri' : 'greenBi'}
        maxSize='chart10Shrink'
      />
      
    </div>
  );
};

export default GroupTops;