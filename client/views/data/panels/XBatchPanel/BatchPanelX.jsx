import React from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
//import ProgressCounter from '/client/utility/ProgressCounter.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
//import UserName from '/client/components/tinyUi/UserName.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import WaterfallTimeline from '/client/components/bigUi/WaterfallTimeline.jsx';

import XBatchTimeline from '/client/components/bigUi/BatchFeed/XBatchTimeline.jsx';

import InfoTab from './InfoTab';
import TimeTab from './TimeTab';

//import RiverSatus from '../../../components/smallUi/RiverStatus.jsx';
//import FirstsOverview from '/client/components/bigUi/FirstsOverview.jsx';
//import FirstsTimeline from '/client/components/bigUi/FirstsTimeline.jsx';
//import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
//import ProgBurndown from '/client/components/charts/ProgBurndown.jsx';
//import NonConOverview from '../../../components/charts/NonConOverview.jsx';
//import NonConRate from '../../../components/charts/NonConRate.jsx';
//import { HasNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
//import { NonConPer } from '../../../components/bigUi/NonConMiniTops.jsx';
//import { MostNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
//import NonConPie from '../../../components/charts/NonConPie.jsx';
//import RMATable from '../../../components/tables/RMATable.jsx';


const BatchPanelX = ({ 
  batchData, widgetData, variantData, groupData,
  user, app, isDebug, isNigh
})=> {

  const a = app;
  const b = batchData;
  // const w = widgetData;
  // const g = groupData;
  const branchesSort = app.branches.sort((b1, b2)=> {
    return b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 });
     
  // const v = variantData;
  
  //const flow = w.flows.find( x => x.flowKey === b.river );
  //const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
  
  //const riverTitle = flow ? flow.title : 'not found';
  //const riverFlow = flow ? flow.flow : [];
  //const progCounts = ProgressCounter(riverFlow, riverAltFlow, b, true);
  
  const done = b.completed === true && b.live === false; // no more boards if batch is finished
  
  
  return(
    <div className='section' key={b.batch}>
      
      <Tabs
        tabs={
          [
            'Info',
            'Progress',
            'Time',
            'Events'
          ]
        }
        wide={true}
        stick={false}
        hold={true}
        sessionTab='batchExPanelTabs'>
        
        <InfoTab
          a={app}
          user={user}
          b={b}
          done={done}
        />
      
        
        <div className='oneTwoThreeContainer space'>
          <div className='oneThirdContent min200'>
            
          </div>
        
          <div className='twoThirdsContent'>
            {/*<FirstsOverview
            doneFirsts={filter.fList}
            flow={riverFlow}
            flowAlt={riverAltFlow} />*/}
          </div>
          
          <div className='threeThirdsContent wide'>
            <WaterfallTimeline
              waterfalls={b.waterfall}
              quantity={b.quantity}
              app={a} />
          </div>
        </div>
        
        <TimeTab 
          a={app}
          b={b}
          user={user}
          isDebug={isDebug}
          totalUnits={b.quantity}
          done={done}
          allDone={done}
          riverFlow={false} />
          
        <div className='space3v'>
          <XBatchTimeline
            id={b._id}
            batchData={b}
            releaseList={b.releases || []}
            verifyList={[]}//filter.verifyList}
            eventList={b.events || []}
            alterList={b.altered || []}
            quoteList={b.quoteTimeBudget || []}
            doneBatch={done}
            brancheS={branchesSort} />
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