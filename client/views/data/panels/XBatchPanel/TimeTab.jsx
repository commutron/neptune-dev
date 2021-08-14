import React, { useState } from 'react';

import TabsLite from '/client/components/smallUi/Tabs/TabsLite';
import ProgLayerBurndown from '/client/components/charts/BatchBurn/ProgLayerBurndown';
import PeopleScatter from '/client/components/charts/BatchBurn/PeopleScatter';
import ItemsOnTime from '/client/components/charts/BatchBurn/ItemsOnTime';
import TimeBudgetsChunk from './time/TimeBudgetsChunk';
import TimeExtendChunk from './time/TimeExtendChunk';
import TimeNextChunk from './time/TimeNextChunk';

import TimeCycleChunk from './time/TimeCycleChunk';

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
    
      <div className='dropCeiling vmargin space cardSelf'>
        <TabsLite 
          tabs={ [ 
            <i className="fas fa-running fa-lg fa-fw"></i>,
            <i className="fas fa-chart-area fa-lg fa-fw"></i>,
            <i className="fas fa-flag-checkered fa-fw"></i>
          ] }
          names={[ 
            'People Distribution','Progress Burndown','Items Completed On Time'
          ]}>
        
        <PeopleScatter 
          tide={batchData.tide}
          period='day'
          xlabel='MMM D YYYY'
          isDebug={isDebug} 
          app={app}
        />
        
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
        
        <ItemsOnTime 
          items={seriesData ? seriesData.items : []}
          salesEnd={batchData.salesEnd}
          isDebug={isDebug}
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
        
        
      <TimeCycleChunk
        batchData={batchData}
        seriesData={seriesData}
        
      />
      
    </div>
  );
};

export default TimeTab;