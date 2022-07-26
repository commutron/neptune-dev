import React, { Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Tabs from '/client/components/smallUi/Tabs/Tabs';

import { TideBump } from '/client/components/riverX/TideWall';

import StepsProgressX from '/client/components/bigUi/StepsProgress/StepsProgressX';
import TagsModule, { HoldFlag } from '/client/components/bigUi/TagsModule';
import BlockForm from '/client/components/forms/BlockForm';
import BlockList from '/client/components/bigUi/BlockList';

const BatchCardX = ({
  batchData, bOpen, bClosed, rapidData,
  // user,
  app, brancheS, ancOptionS,
  // floorReleased, 
  srange, flowCounts, fallCounts,
  tideKey, timeOpen, engagedPro,
  expand, flowwater, fallwater
})=> {
  
  const rapDo = rapidData.rapDo ? [rapidData.rapDo] : [];
  const rapidMerge = [...rapDo,...rapidData.rapDids]
                      .sort((r1, r2)=> r1.createdAt > r2.createdAt ? 1 :
                                       r1.createdAt < r2.createdAt ? -1 : 0 );
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  
  const insertTideBump = 
          <TideBump
            bID={batchData._id}
            bOpen={bOpen}
            ancOptionS={ancOptionS}
            brancheS={brancheS}
            tideKey={tideKey}
            timeOpen={timeOpen}
            engagedPro={engagedPro}
          />;
            
  const insertMiniInfo = 
          <MiniInfo
            batchData={batchData}
            srange={srange}
            flowCounts={flowCounts}
            rapidMerge={rapidMerge}
            bClosed={bClosed}
            app={app}
            canRun={canRun}
          />;
            
  const insertProgress = 
          <div className='space1v'>
            <StepsProgressX
              b={batchData}
              flowCounts={flowCounts}
              fallCounts={fallCounts}
              rapidsData={rapidMerge}
              riverTitle=''
              brancheS={brancheS}
              truncate={true}
            />
          </div>;
  
  if( ( expand && !bOpen ) || 
      ( timeOpen && expand && !flowwater && !fallwater ) ) {
    return(
      <Fragment>   
        <div className='proPrimeSingle'>
     
          { timeOpen && bOpen && insertTideBump}
      
          {insertMiniInfo}
          
        </div>
      
        <div className='proPrimeSingle'>
        
          {insertProgress}
  
        </div>
      </Fragment>
    );
  }
  
  return(
    <div className='proPrimeSingle'>
      
      { timeOpen && bOpen && insertTideBump}
          
      <Tabs
        tabs={[
          <i className='fas fa-info-circle fa-fw' title='Info'></i>, 
          <i className='fas fa-tasks fa-fw' title='Progress'></i>,
        ]}
        names={false}
        wide={true}
        stick={false}
        hold={true}
        sessionTab='batchProPanelTabs'>
      
        {insertMiniInfo}
          
        {insertProgress}
        
      </Tabs>
          
    </div>
  );
};

export default BatchCardX;

const MiniInfo = ({ batchData, srange, flowCounts, rapidMerge, bClosed, app, canRun })=> (
  <div className='space1v cap'>
    
    {bClosed &&
      <h4 className='centreText letterSpaced'>
        <i className="far fa-lightbulb fa-4x grayT"></i>
        <br />Unfinished & Deactivated
      </h4>}
      
    {batchData.completed &&
      <div className='finishBanner'
        >{Pref.XBatch} Completed <n-num>{moment(batchData.completedAt).calendar()}</n-num>
      </div>}
      
    {rapidMerge.map( (r, ix)=>(
      <div key={ix} className='rapDidBanner'
        >{r.rapid} - {r.issueOrder}
        {r.live ? 
          r.rDone === 1 ?
            <Fragment><br />(Ready to Close)</Fragment> :
            <Fragment><br />(Open)</Fragment> : 
          <Fragment><br />Closed <n-num>{moment(r.closedAt).calendar()}</n-num></Fragment>
        }
      </div>))}
    
    <p>{Pref.salesOrder}: <n-num>{batchData.salesOrder}</n-num></p>
    
    <p>Total Quantity: <n-num>{batchData.quantity}</n-num></p>
    
    {srange && flowCounts.liveItems !== batchData.quantity ? 
      <p>Serialized Items: <n-num>{flowCounts.liveItems}</n-num></p>
    : null}
    
    {srange && <p>Serials: <n-num>{srange}</n-num></p>}
    
    {flowCounts.scrapCount > 0 &&
      <p>Scrapped Items: <n-num className='redT'>{flowCounts.scrapCount}</n-num></p>}
      
    <hr />
    <TagsModule
      action={Pref.xBatch}
      id={batchData._id}
      tags={batchData.tags}
      tagOps={app.tagOption}
      truncate={true}
      canRun={canRun} />
    {batchData.hold &&
      <HoldFlag
        id={batchData._id}
        canRun={canRun}
      />
    }
    <BlockForm
      id={batchData._id}
      edit={false}
      doneLock={batchData.completed}
      noText={true}
      lgIcon={true}
      canRun={canRun} />
    <BlockList 
      id={batchData._id} 
      data={batchData.blocks}
      doneLock={batchData.completed} 
      truncate={true}
      canRun={canRun} />
  </div>
);