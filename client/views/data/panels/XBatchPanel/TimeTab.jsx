import React from 'react';

import ProgLayerBurndown, { ProgLayerBurndownExplain } 
  from '/client/components/charts/ProgLayerBurndown.jsx';
import TimeBudgetsChunk from '/client/views/data/panels/XBatchPanel/TimeBudgetsChunk';
import TimeExtendChunk from '/client/views/data/panels/XBatchPanel/TimeExtendChunk';

const TimeTab = ({
  batchData, seriesData, rapidsData,
  floorRelease, done, allDone, riverFlow,
  user, isDebug, app
})=> {
  
  const addedTimes = Array.from(rapidsData, r => r.timeBudget);
  const addTime = addedTimes.length > 0 ? addedTimes.reduce((x,y)=> x + y) : 0;
  
  console.log(addTime);
  
return(
  <div className='space3v'>
  
    <TimeBudgetsChunk
      tideWall={app.tideWall}
      b={batchData}
      isX={true}
      isDebug={isDebug} />
    
    {rapidsData.length > 0 &&
      <div className='autoFlex'>
        {rapidsData.map( (rapid, rindex)=>(
        <TimeExtendChunk
          key={rindex}
          b={batchData}
          rapid={rapid}
          isDebug={isDebug} 
        />
        ))}
      </div>
    }
    
    <div className='dropCeiling vmargin space'>
      <ProgLayerBurndown
        seriesId={seriesData._id}
        start={batchData.salesStart}
        floorRelease={floorRelease}
        end={batchData.completedAt}
        riverFlow={riverFlow || []}
        itemData={seriesData ? seriesData.items : []}
        title='Progress Burndown'
        isDebug={isDebug} />
            
      <ProgLayerBurndownExplain />
    </div>
            
  </div>
);
};

export default TimeTab;