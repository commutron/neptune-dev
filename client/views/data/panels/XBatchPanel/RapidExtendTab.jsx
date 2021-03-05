import React from 'react';
import moment from 'moment';

import RapidExtendCard from './RapidExtendCard';



const RapidExtendTab = ({ 
  batchData, seriesData, rapidsData, 
  widgetData, urlString,
  released, done, nowater,
  app, user, brancheS, isDebug
})=> {
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
  return(
    <div className='cardify'>
      {rapidsData.map( (r, ix)=>(
        
        <RapidExtendCard 
          key={r._id+'rEx'+ix}
          batchData={batchData}
          widgetData={widgetData}
          urlString={urlString}
          rapid={r}
          cal={calFunc}
        />
      ))}
    
    </div>
  );
};

export default RapidExtendTab;