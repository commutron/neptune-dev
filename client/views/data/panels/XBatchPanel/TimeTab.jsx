import React, { useState } from 'react';

import TabsLite from '/client/components/smallUi/Tabs/TabsLite';
import ProgLayerBurndown from '/client/components/charts/BatchBurn/ProgLayerBurndown';
import PeopleScatter from '/client/components/charts/BatchBurn/PeopleScatter';
import TimeBudgetsChunk from '/client/views/data/panels/XBatchPanel/TimeBudgetsChunk';
import TimeExtendChunk from '/client/views/data/panels/XBatchPanel/TimeExtendChunk';
import TimeNextChunk from './TimeNextChunk';

const TimeTab = ({
  batchData, seriesData, rapidsData, widgetData,
  floorRelease, done, allDone, riverFlow,
  user, isDebug, app
})=> {
  
  const [ conversion, conversionSet] = useState('hours');
  const [ plus, plusSet ] = useState(true);
  
  const addedTimes = Array.from(rapidsData, r => r.timeBudget);
  const addTime = addedTimes.length > 0 ? addedTimes.reduce((x,y)=> x + y) : 0;

  
  return(
    <div className='space3v'>
    
      <TimeBudgetsChunk
        tideWall={app.tideWall}
        b={batchData}
        isX={true}
        addTime={addTime}
        conversion={conversion}
        conversionSet={conversionSet}
        plus={plus}
        plusSet={plusSet}
        isDebug={isDebug} />
      
      {conversion !== 'raw' && rapidsData.length > 0 ?
        <div className='autoFlex'>
          {rapidsData.map( (rapid, rindex)=>(
          <TimeExtendChunk
            key={rindex}
            b={batchData}
            rapid={rapid}
            conversion={conversion}
            conversionSet={conversionSet}
            isDebug={isDebug} 
          />
          ))}
        </div>
      : null}
    
      <div className='dropCeiling vmargin space'>
        <TabsLite 
          tabs={ [ 
            <i className="fas fa-chart-line fa-lg fa-fw"></i>,
            <i className="fas fa-chess-board fa-lg fa-fw"></i>,
            
          ] }
          names={[ 
            'Progress Burndown', 'People Distribution'
          ]}>
            
        <ProgLayerBurndown
          batchId={batchData._id}
          seriesId={seriesData._id}
          start={batchData.salesStart}
          floorRelease={floorRelease}
          end={batchData.completedAt}
          riverFlow={riverFlow || []}
          itemData={seriesData ? seriesData.items : []}
          title='Progress Burndown'
          isDebug={isDebug}
        />
        
        <PeopleScatter 
          tide={batchData.tide}
          isDebug={isDebug} 
          app={app} 
        />

        </TabsLite>
      </div>
      
      <TimeNextChunk
        batchData={batchData}
        seriesData={seriesData}
        widgetData={widgetData}
        floorRelease={floorRelease}
        done={done}
        app={app} />
              
    </div>
  );
};

export default TimeTab;