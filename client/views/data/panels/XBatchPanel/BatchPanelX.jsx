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
  batchData, seriesData, widgetData, variantData, groupData, flowData,
  user, app, isDebug, isNigh
})=> {
  
  const b = batchData;
  // const w = widgetData;
  // const g = groupData;
  const brancheS = app.branches.sort((b1, b2)=> 
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  
  // const v = variantData;
  
  //const flow = w.flows.find( x => x.flowKey === b.river );
  
  //const riverTitle = flow ? flow.title : 'not found';
  //const riverFlow = flow ? flow.flow : [];
  const progCounts = flowData.progCounts;
  
  const done = b.completed === true && b.live === false;
  const allDone = !seriesData ? true : seriesData.items.every( x => x.completed );
    
  
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
          app={app}
          user={user}
          b={batchData}
          riverTitle={flowData.riverTitle}
          progCounts={progCounts}
          done={done}
          brancheS={brancheS}
          isDebug={isDebug}
        />
      
        
        <div className='oneTwoThreeContainer space'>
          <div className='oneThirdContent min200'>
            
          </div>
        
          <div className='twoThirdsContent'>
            <WaterfallTimeline
              wfCounts={progCounts.wtrflProg}
              waterfall={b.waterfall}
              quantity={b.quantity}
              app={app} />
          </div>
          
          <div className='threeThirdsContent wide'>
            
          </div>
        </div>
        
        <TimeTab 
          a={app}
          b={b}
          user={user}
          isDebug={isDebug}
          totalUnits={b.quantity}
          done={done}
          allDone={allDone}
          riverFlow={flowData.riverFlow} />
        
        <ProblemTab
          batchData={batchData}
          seriesData={seriesData}
          riverFlow={flowData.riverFlow}
          ncTypesCombo={flowData.ncTypesComboFlat}
          brancheS={brancheS}
          app={app}
          isDebug={isDebug} />
          
        <div className='space3v'>
          <XBatchTimeline
            id={b._id}
            batchData={b}
            releaseList={b.releases || []}
            verifyList={progCounts.firstsFlat}
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