import React from 'react';

import ProgLayerBurndown, { ProgLayerBurndownExplain } 
  from '/client/components/charts/ProgLayerBurndown.jsx';
import TimeBudgetsChunk from '/client/views/data/panels/XBatchPanel/TimeBudgetsChunk';

const TimeTab = ({
  batchData, seriesData, totalUnits,
  floorRelease, done, allDone, riverFlow,
  user, isDebug, app
})=> (
  <div className='space3v'>
  
    <TimeBudgetsChunk
      tideWall={app.tideWall}
      b={batchData}
      isX={true}
      totalUnits={totalUnits}
      isDebug={isDebug} />
    
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

export default TimeTab;