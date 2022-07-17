import React from 'react';
import CreateTag from '/client/components/tinyUi/CreateTag';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import XBatchTimeline from '/client/components/bigUi/BatchFeed/XBatchTimeline';

import InfoTab from './InfoTab';
import TimeTab from './TimeTab';
import CountTab from './CountTab';
import ProblemTab from './ProblemTab';
import RapidExtendTab from './RapidExtendTab';

import BatchExport from '/client/views/paper/BatchExport';

const BatchPanelX = ({ 
  batchData, seriesData, rapidsData, widgetData, variantData, groupData, 
  flowData, fallData,
  user, app, brancheS, isDebug
})=> {
  
  const b = batchData;

  const floorRelease = b.releases.find( x => x.type === 'floorRelease');
  const released = floorRelease ? true : false;
  const hasFall = b.waterfall.length > 0;
  const done = b.completed === true && b.live === false;
  
  let tabbar = [
    'Info',
    'Time',
    'Counters',
    `Problems`,
    'Events',
    rapidsData.length > 0 ? 'Extended' : 'Extend'
  ];
          
  return(
    <div className='section' key={b.batch}>
      
      <Tabs
        tabs={ tabbar }
        wide={true}
        stick={true}
        hold={true}
        sessionTab='batchExPanelTabs'>
        
        <InfoTab
          user={user}
          b={batchData}
          hasSeries={!seriesData ? false : true}
          widgetData={widgetData}
          radioactive={variantData.radioactive}
          riverTitle={flowData.riverTitle}
          srange={flowData.srange}
          flowCounts={flowData.flowCounts}
          fallCounts={fallData}
          rapidsData={rapidsData}
          released={released}
          done={done}
          allFlow={flowData.flowCounts.allFlow}
          allFall={fallData.allFall}
          nowater={!hasFall && !seriesData}
          app={app}
          brancheS={brancheS}
          isDebug={isDebug}
        />
        
        <TimeTab 
          batchData={batchData}
          seriesData={seriesData}
          rapidsData={rapidsData}
          widgetData={widgetData}
          user={user}
          isDebug={isDebug}
          totalUnits={b.quantity}
          floorRelease={floorRelease}
          done={done}
          allDone={flowData.allFlow}
          riverFlow={flowData.riverFlow}
          app={app}
          brancheS={brancheS} 
        />
        
        <CountTab
          batchData={batchData}
          fallData={fallData}
          rapidsData={rapidsData}
          app={app}
        />
        
        <ProblemTab
          batch={batchData.batch}
          seriesData={seriesData}
          ncTypesCombo={flowData.ncTypesComboFlat}
          brancheS={brancheS}
          app={app}
          isDebug={isDebug} />
          
        <div className='space3v'>
          <XBatchTimeline
            batchData={b}
            seriesId={seriesData._id}
            releaseList={b.releases || []}
            verifyList={flowData.flowCounts.firstsFlat}
            eventList={b.events || []}
            alterList={b.altered || []}
            quoteList={b.quoteTimeBudget || []}
            doneBatch={done}
            brancheS={brancheS} />
        </div>
        
        <RapidExtendTab
          batchData={batchData}
          seriesData={seriesData}
          rapidsData={rapidsData}
          widgetData={widgetData}
          vassembly={variantData.assembly}
          urlString={
            '?group=' + groupData.alias +
            '&widget=' + widgetData.widget + 
            '&ver=' + variantData.variant +
            ( variantData.radioactive ? '☢' : ''  ) +
            '&desc=' + widgetData.describe
          }
          released={released}
          done={done}
          nowater={!hasFall && !seriesData}
          app={app}
          user={user}
          brancheS={brancheS}
          ncTypesCombo={flowData.ncTypesComboFlat}
          isDebug={isDebug}
        />
        
      </Tabs>
      
      <div className='rowWrap'>
        <CreateTag
          when={b.createdAt}
          who={b.createdWho}
          whenNew={b.updatedAt}
          whoNew={b.updatedWho}
          dbKey={b._id}
        />
        <span className='flexSpace' />
        <BatchExport
          group={groupData.group}
          widget={widgetData.widget}
          variant={variantData.variant}
          batchData={batchData}
          seriesData={seriesData}
          rapidsData={rapidsData}
          brancheS={brancheS}
        />
      </div>
    </div>
  );
};
  
export default BatchPanelX;