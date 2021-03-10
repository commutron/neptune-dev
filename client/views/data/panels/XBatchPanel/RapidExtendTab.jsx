import React from 'react';
import moment from 'moment';

import RapidExtendCard from './RapidExtendCard';



const RapidExtendTab = ({ 
  batchData, seriesData, rapidsData, 
  widgetData, vassembly, urlString,
  released, done, nowater,
  app, user, brancheS, isDebug
})=> {
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
  const setItems = !seriesData ? 0 : seriesData.items.filter( 
                        i => i.altPath.find( r => r.rapId !== false) ).length;
  
  return(
    <div className='cardify'>
      {rapidsData.map( (r, ix)=>(
        
        <RapidExtendCard 
          key={r._id+'rEx'+ix}
          batchData={batchData}
          hasSeries={seriesData ? true : false}
          rSetItems={setItems}
          widgetData={widgetData}
          vassembly={vassembly}
          urlString={urlString}
          rapid={r}
          app={app}
          user={user}
          cal={calFunc}
        />
      ))}
    
    </div>
  );
};

export default RapidExtendTab;