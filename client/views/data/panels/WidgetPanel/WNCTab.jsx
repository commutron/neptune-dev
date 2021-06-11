import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';

import NonConMultiBatchBar from '/client/components/charts/NonCon/NonConMultiBatchBar';
import AvgStat from '/client/components/tinyUi/AvgStat';

const WNCTab = ({ 
  widgetData, batchIDs, batches, 
  app
})=> {
  
  const mounted = useRef(true);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const [ rate, rateSet ] = useState([0,'flat']);
  
  useEffect( ()=>{
    Meteor.call('nonConBatchTrend', widgetData._id, (err, reply)=>{
      err && console.log(err);
      reply && mounted.current ? 
        rateSet(reply) : null;
    });
  }, []);
  
  return(
    <div className='space'>
      
      <div className='rowWrapR'>
        <AvgStat num={rate[0]} trend={rate[1]} type='NC Rate' flip={true} />
      </div>
      
      <NonConMultiBatchBar batches={batches} />
        
    </div>
  );
};

export default WNCTab;