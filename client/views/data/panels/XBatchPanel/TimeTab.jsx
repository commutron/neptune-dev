import React from 'react';
//import Pref from '/client/global/pref.js';

import ProgLayerBurndown, { ProgLayerBurndownExplain } 
  from '/client/components/charts/ProgLayerBurndown.jsx';
import TimeBudgetsChunk from '/client/views/data/panels/BatchPanel/TimeBudgetsChunk';
import TimeBlocksRaw from '/client/views/data/panels/BatchPanel/TimeBlocksRaw';

const TimeTab = ({
  batchData, seriesData, totalUnits,
  floorRelease, done, allDone, riverFlow,
  user, isDebug, app
})=> {
  
  // const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
  // const pSup = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  
  return(
    <div className='space3v'>
    
      <TimeBudgetsChunk
        a={app}
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

      <div className='vmargin space'>
        <TimeBlocksRaw 
          batch={batchData.batch}
          tide={batchData.tide}
          lockOut={batchData.lock}
          isDebug={isDebug} />
      </div>
              
    </div>  
  );
};

export default TimeTab;