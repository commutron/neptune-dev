import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
//import ProgressCounter from '/client/utility/ProgressCounter.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
//import UserName from '/client/components/tinyUi/UserName.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';
import WaterfallTimeline from '/client/components/bigUi/WaterfallTimeline.jsx';

import XBatchTimeline from '/client/components/bigUi/BatchFeed/XBatchTimeline.jsx';

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
  user, app
})=> {

  const a = app;
  const b = batchData;
  // const w = widgetData;
  // const g = groupData;
  const branchesSort = app.branches.sort((b1, b2)=> {
    return b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 });
     
  
  const end = !b.completed ? moment() : moment(b.completedAt);
  const timeElapse = moment.duration(end.diff(b.salesStart)).asWeeks().toFixed(1);
  
  const timeasweeks = timeElapse.split('.');
  const timeweeks = timeasweeks[0];
  const timedays = moment.duration(timeasweeks[1] * 0.1, 'weeks').asDays().toFixed(0);
  const elapseNice = timeweeks + ' week' + 
                      (timeweeks == 1 ? ', ' : 's, ') + 
                        timedays + ' day' +
                          (timedays == 1 ? '' : 's');
               
  const cmplt = b.completedAt ? end.format("MMMM Do, YYYY") : null;
  
  // const v = variantData;
  
  //const flow = w.flows.find( x => x.flowKey === b.river );
  //const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
  
  //const riverTitle = flow ? flow.title : 'not found';
  //const riverFlow = flow ? flow.flow : [];

  const done = b.completed === true && b.live === false; // no more boards if batch is finished
  
  let released = b.releases.find( x => x.type === 'floorRelease');
  
  //const progCounts = ProgressCounter(riverFlow, riverAltFlow, b, true);
  
  return(
    <div className='section' key={b.batch}>
        
      <div className='titleSection'>
        <span>
          { b.live ? 
            <i className='fas fa-sync blueT' title='in progress'></i>
            :
            <i className='fa fa-check-circle greenT' title='finished'></i>
          }
        </span>
      </div>
      
      <br />
      
      <Tabs
        tabs={
          [
            'Info',
            'Progress',
            'Timeline'
          ]
        }
        wide={true}
        stick={false}
        hold={true}
        sessionTab='batchExPanelTabs'>
        
        <div className='oneTwoThreeContainer space'>
          <div className='oneThirdContent min200'>
            <WatchButton 
              list={user.watchlist}
              type='batch'
              keyword={b.batch} />
            <TagsModule
              action='xBatch'
              id={b._id}
              tags={b.tags}
              tagOps={a.tagOption} />
            <fieldset className='noteCard'>
              <legend>Time Range</legend>
              <p className='capFL'>{Pref.salesOrder}: {b.salesOrder || 'not available'}</p>
              <p className='capFL'>{Pref.start}: {moment(b.salesStart).format("MMMM Do, YYYY")}</p>
              <p className='capFL'>{Pref.end}: {moment(b.salesEnd).format("MMMM Do, YYYY")}</p>
              {cmplt !== null && <p>Completed: {cmplt}</p>}
              <p>{cmplt !== null ? 'Total Time:' : 'Elapsed:'} {elapseNice}</p>
            </fieldset>
            {!released &&
              <ReleaseAction 
                id={b._id} 
                rType='floorRelease'
                actionText='release'
                contextText='to the floor'
                isX={true} />
            }
          </div>
          <div className='twoThirdsContent'>
            <NoteLine 
              action='xBatch'
              id={b._id}
              entry={b.notes} />
            <BlockList id={b._id} data={b.blocks} xBatch={true} lock={done} expand={true} />
          </div>
        </div>
      
        
        <div className='oneTwoThreeContainer space'>
          <div className='oneThirdContent min200'>
            {/*
            <FirstsOverview
              doneFirsts={filter.fList}
              flow={riverFlow}
              flowAlt={riverAltFlow} />*/}
          </div>
        
          <div className='twoThirdsContent'>
            
          </div>
          
          <div className='threeThirdsContent wide'>
            <WaterfallTimeline
              waterfalls={b.waterfall}
              quantity={b.quantity}
              app={a} />
          </div>
        </div>
        
        <div className='space3v'>
          <XBatchTimeline
            id={b._id}
            batchData={b}
            releaseList={b.releases || []}
            verifyList={[]}//filter.verifyList}
            eventList={b.events || []}
            alterList={b.altered || []}
            quoteList={[]}//b.quoteTimeBudget || []}
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