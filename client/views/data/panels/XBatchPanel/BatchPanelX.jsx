import React from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
//import UserName from '/client/components/tinyUi/UserName.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import WaterfallTimeline from '/client/components/bigUi/WaterfallTimeline.jsx';

import XBatchTimeline from '/client/components/bigUi/BatchFeed/XBatchTimeline.jsx';

import InfoTab from './InfoTab';
import TimeTab from './TimeTab';
import ProblemTab from './ProblemTab';

//import RMATable from '../../../components/tables/RMATable.jsx';


const BatchPanelX = ({ 
  batchData, seriesData, widgetData, variantData, groupData, 
  flowData, fallData,
  user, app, isDebug, isNigh
})=> {
  
  const b = batchData;

  const brancheS = app.branches.sort((b1, b2)=> 
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  
  const floorRelease = b.releases.find( x => x.type === 'floorRelease');
  const released = floorRelease ? true : false;
  const hasFall = b.waterfall.length > 0;
  const done = b.completed === true && b.live === false;
   
  return(
    <div className='section' key={b.batch}>
      
      <Tabs
        tabs={
          [
            'Info',
            'Waterfall',
            'Time',
            `Problems`,
            'Events',
            // 'Returns'
          ]
        }
        wide={true}
        stick={false}
        hold={true}
        sessionTab='batchExPanelTabs'>
        
        <InfoTab
          user={user}
          b={batchData}
          riverTitle={flowData.riverTitle}
          flowCounts={flowData.flowCounts}
          fallCounts={fallData}
          released={released}
          done={done}
          allFlow={flowData.flowCounts.allFlow}
          allFall={fallData.allFall}
          nowater={!hasFall && !seriesData}
          app={app}
          brancheS={brancheS}
          isDebug={isDebug}
        />
      
        <div className='oneTwoThreeContainer space'>
          <div className='oneThirdContent min200'>
            
          </div>
        
          <div className='twoThirdsContent'>
            <WaterfallTimeline
              wfCounts={fallData.fallProg}
              waterfall={b.waterfall}
              quantity={b.quantity}
              app={app} />
          </div>
          
          <div className='threeThirdsContent wide'>
            
          </div>
        </div>
        
        <TimeTab 
          batchData={batchData}
          seriesData={seriesData}
          user={user}
          isDebug={isDebug}
          totalUnits={b.quantity}
          floorRelease={floorRelease}
          done={done}
          allDone={flowData.allFlow}
          riverFlow={flowData.riverFlow}
          app={app} />
        
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
        
      </Tabs>
      
      <CreateTag
        when={b.createdAt}
        who={b.createdWho}
        whenNew={b.updatedAt}
        whoNew={b.updatedWho}
        dbKey={b._id} />
    </div>
  );
};
  
export default BatchPanelX;