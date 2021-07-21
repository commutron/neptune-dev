import React, { useState, useEffect, useRef } from "react";
import NumStatRing from '/client/components/charts/Dash/NumStatRing';

const GroupTops = ({ groupId, app })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  const [ total, totalSet ] = useState(false);
  const [ avgNC, avgNCSet ] = useState(false);
  const [ avgPf, avgPfSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('groupTops', groupId, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re.ontimesplit);
          totalSet(re.ontimesplit.find(z=>z.x=='on time').y);
          avgNCSet(re.avgNCrate);
          avgPfSet(re.avgPf);
        }
      }
    });
  }, []);
  
  return(
    <div className='balancer'>
      
      <NumStatRing
        total={total !== false ? `${total}%` :
          <n-fa0><i className='fas fa-spinner fa-spin'></i></n-fa0>}
        nums={tickXY || []}
        name="Items on time"
        title='items on time'
        colour={["rgb(46, 204, 113)", "rgb(241, 196, 15)"]}
      />
      
      <NumStatRing
        total={avgPf !== false ? avgPf :
          <n-fa1><i className='fas fa-spinner fa-spin'></i></n-fa1>}
        nums={[{x:1,y:1}]}
        name='Average Performance'
        title='Avg Perf.'
        colour={['#000']}
        noGap={true}
      />
      
      <NumStatRing
        total={avgNC !== false ? avgNC :
          <n-fa2><i className='fas fa-spinner fa-spin'></i></n-fa2>}
        nums={[{x:1,y:1}]}
        name='Average NonCon Rate'
        title='Avg NC Rate'
        colour='redTri'
        noGap={true}
      />
      
    </div>
  );
};

export default GroupTops;