import React from 'react';
//import Pref from '/client/global/pref.js';

// import ProgLayerBurndown, { ProgLayerBurndownExplain } 
//   from '/client/components/charts/ProgLayerBurndown.jsx';
import TimeBudgetsChunk from '/client/views/data/panels/BatchPanel/TimeBudgetsChunk';
import TimeBlocksRaw from '/client/views/data/panels/BatchPanel/TimeBlocksRaw';

const TimeTab = ({
  a, b,
  user, isDebug,
  totalUnits,
  done, allDone,
  riverFlow
})=>	{
  
  // const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
  // const pSup = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  
  return(
    <div className='space3v'>
    
      <TimeBudgetsChunk
        a={a}
        b={b}
        isX={true}
        totalUnits={totalUnits}
        isDebug={isDebug} />
      
      {/*
      <div className='dropCeiling vmargin space'>
        <ProgLayerBurndown
          id={b._id}
          start={b.start}
          floorRelease={b.floorRelease}
          end={b.finishedAt}
          flowData={riverFlow || []}
          itemData={b.items.filter( x => x.alt === 'no' || x.alt === false )}
          title='Progress Burndown' />
                
        {b.riverAlt !== false &&  
          <ProgLayerBurndown
            id={b._id}
            start={b.start}
            floorRelease={b.floorRelease}
            end={b.finishedAt}
            flowData={riverAltFlow || []}
            itemData={b.items.filter( x => x.alt === 'yes' )}
            title='Alt Progress Burndown' />}
              
        <ProgLayerBurndownExplain />
      </div>
      */}
      <div className='vmargin space'>
        <TimeBlocksRaw 
          batch={b.batch}
          tide={b.tide}
          lockOut={b.lock}
          isDebug={isDebug} />
      </div>
              
    </div>  
  );
};

export default TimeTab;