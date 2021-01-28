import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import { TideBump } from '/client/components/riverX/TideWall';

import StepsProgressX from '/client/components/bigUi/StepsProgress/StepsProgressX';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';

const BatchCardX = ({
  batchData, bOpen, //seriesData, itemData
  user, app, brancheS, plainBrancheS, ancOptionS,
  floorReleased, flowCounts, fallCounts,
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
            flowCounts={flowCounts}
            app={app} />;
            
  const insertProgress = 
          <div className='space1v'>
            <StepsProgressX
              quantity={batchData.quantity}
              flowCounts={flowCounts}
              fallCounts={fallCounts}
              riverTitle=''
              brancheS={brancheS}
              truncate={true}
            />
          </div>;
  
  if( expand && ( !flowwater && !fallwater ) ) {
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
        sessionTab='batchExPanelTabs'>
      
        {insertMiniInfo}
          
        {insertProgress}
        
      </Tabs>
          
    </div>
  );
};

export default BatchCardX;

const MiniInfo = ({ batchData, flowCounts, app })=> (
  <div className='space1v cap'>
    
    <p>{Pref.salesOrder}: <b>{batchData.salesOrder}</b></p>
    
    <p>Total Quantity: <b className='numfont'>{batchData.quantity}</b></p>
    
    <p>Serialized Items: <b className='numfont'>{flowCounts.liveItems}</b></p>
    {flowCounts.scrapCount > 0 &&
      <p>Scrapped Items: <b className='numfont redT'>{flowCounts.scrapCount}</b></p>}
      
    <hr />
    <TagsModule
      action='xBatch'
      id={batchData._id}
      tags={batchData.tags}
      tagOps={app.tagOption} />
    <NoteLine 
      action='xBatch'
      id={batchData._id}
      entry={batchData.notes} />
    <BlockList 
      id={batchData._id} 
      data={batchData.blocks}
      xbatch={true} 
      lock={batchData.completed} 
      expand={false} />
  </div>
);