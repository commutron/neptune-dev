import React, { Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import { TideBump } from '/client/components/riverX/TideWall';

import StepsProgressX from '/client/components/bigUi/StepsProgress/StepsProgressX';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';
// import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockForm from '/client/components/forms/BlockForm.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';

const BatchCardX = ({
  batchData, bOpen, bClosed, rapidData, //seriesData, itemData
  user, app, brancheS, plainBrancheS, ancOptionS,
  floorReleased, srange, flowCounts, fallCounts,
  tideKey, tideFloodGate, 
  expand, flowwater, fallwater
})=> {
  
  const insertTideBump = 
          <TideBump
            bID={batchData._id}
            bOpen={bOpen}
            ancOptionS={ancOptionS}
            plainBrancheS={plainBrancheS}
            tideKey={tideKey}
            tideFloodGate={tideFloodGate} />;
            
  const insertMiniInfo = 
          <MiniInfo
            batchData={batchData}
            srange={srange}
            flowCounts={flowCounts}
            bClosed={bClosed}
            app={app} />;
            
  const insertProgress = 
          <div className='space1v'>
            <StepsProgressX
              b={batchData}
              flowCounts={flowCounts}
              fallCounts={fallCounts}
              riverTitle=''
              brancheS={brancheS}
              truncate={true}
            />
          </div>;
  
  if( ( expand && !bOpen ) || 
      ( tideFloodGate && expand && !flowwater && !fallwater ) ) {
    return(
      <Fragment>   
        <div className='proPrimeSingle'>
     
          {tideFloodGate && bOpen && insertTideBump}
      
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
      
      {tideFloodGate && bOpen && insertTideBump}
          
      <Tabs
        tabs={[
          <i className='fas fa-info-circle fa-fw' data-fa-transform='down-2' title='Info'></i>, 
          <i className='fas fa-tasks fa-fw' data-fa-transform='down-2' title='Progress'></i>,
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

const MiniInfo = ({ batchData, srange, flowCounts, bClosed, app })=> (
  <div className='space1v cap'>
    
    {bClosed &&
      <h4 className='centreText letterSpaced'>
        <i className="far fa-lightbulb fa-4x grayT"></i>
        <br />Unfinished & Deactivated
      </h4>}
      
    {batchData.completed &&
      <h4 className='centreText nomargin'
        >{Pref.XBatch} Completed {moment(batchData.completedAt).calendar()}
      </h4>}
    
    <p>{Pref.salesOrder}: <b>{batchData.salesOrder}</b></p>
    
    <p>Total Quantity: <b className='numfont'>{batchData.quantity}</b></p>
    
    {srange && flowCounts.liveItems !== batchData.quantity ? 
      <p>Serialized Items: <b className='numfont'>{flowCounts.liveItems}</b></p>
    : null}
    
    {srange && <p>Serials: <b className='numFont'>{srange}</b></p>}
    
    {flowCounts.scrapCount > 0 &&
      <p>Scrapped Items: <b className='numfont redT'>{flowCounts.scrapCount}</b></p>}
      
    <hr />
    <TagsModule
      action={Pref.xBatch}
      id={batchData._id}
      tags={batchData.tags}
      tagOps={app.tagOption}
      truncate={true} />
    {/*<NoteLine 
      action={Pref.xBatch}
      id={batchData._id}
      entry={batchData.notes} />*/}
    <BlockForm
      id={batchData._id}
      edit={false}
      doneLock={batchData.completed}
      noText={true}
      lgIcon={true} />
    <BlockList 
      id={batchData._id} 
      data={batchData.blocks}
      doneLock={batchData.completed} 
      truncate={true} />
  </div>
);