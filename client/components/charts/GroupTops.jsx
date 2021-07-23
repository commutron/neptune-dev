import React, { useState, useEffect, useRef } from "react";
import NumStatRing from '/client/components/charts/Dash/NumStatRing';

const GroupTops = ({ groupId, app })=> {
  
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
  
  const trendIcon =  trend === false ?
    <n-fa0><i className='fas fa-spinner fa-spin'></i></n-fa0> :
    trend === 'up' ?
      <n-fa1><i className='fas fa-arrow-up greenT'></i></n-fa1> :
    trend === 'down' ?
      <n-fa2><i className='fas fa-arrow-down redT'></i></n-fa2> :
    <n-fa3><i className='fas fa-minus'></i></n-fa3>;
        
  return(
    <div className='balancer'>
      
      <NumStatRing
        total={total !== false ? `${total}%` :
          <n-fa0><i className='fas fa-spinner fa-spin'></i></n-fa0>}
        nums={tickXY || []}
        title="Average On Time"
        name='On Time'
        colour={["rgb(46, 204, 113)", "rgb(241, 196, 15)"]}
        maxSize='chart10Shrink'
      />
      
      <NumStatRing
        total={avgPf !== false ? avgPf :
          <n-fa1><i className='fas fa-spinner fa-spin'></i></n-fa1>}
        nums={[{x:1,y:1}]}
        title='Average Performance'
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
        title='Average NonConformance Rate'
        colour='redTri'
        noGap={true}
        maxSize='chart10Shrink'
      />
      
      <NumStatRing
        total={trendIcon}
        nums={[{x:1,y:1}]}
        name='Trending'
        title={`Metrics are trending ${trend || 'flat'}`}
        colour={
          !trend || trend == 'flat' ? ['#000'] : 
          trend == 'down' ? 'redTri' : 'greenBi'}
        maxSize='chart10Shrink'
      />
      
    </div>
  );
};

export default GroupTops;