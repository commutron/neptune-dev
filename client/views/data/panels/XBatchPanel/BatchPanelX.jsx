import React, { Fragment } from 'react';
import CreateTag from '/client/components/tinyUi/CreateTag';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import XBatchTimeline from '/client/components/bigUi/BatchFeed/XBatchTimeline';

import InfoTab from './InfoTab';
import TimeTab from './TimeTab';
import CountTab from './CountTab';
import ProblemTab from './ProblemTab';
import RapidExtendTab from './RapidExtendTab';

/// INTERGRATE
import ActionLink from '/client/components/tinyUi/ActionLink';
import BatchXEdit from '/client/components/forms/Batch/BatchXEdit';
import BatchXIncomplete from '/client/components/forms/Batch/BatchXIncomplete';
import RemoveXBatch from '/client/components/forms/Batch/RemoveXBatch';
import SeriesForm from '/client/components/forms/ItemSerialsX/SeriesForm';
import ItemSerialsWrapX from '/client/components/forms/ItemSerialsX/ItemSerialsWrapX';
import UnitSetAll from '/client/components/forms/ItemSerialsX/UnitSetAll';
import CounterAssign from '/client/components/bigUi/ArrayBuilder/CounterAssign';
// \\\\\

import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

import BatchExport from '/client/views/paper/BatchExport';

const BatchPanelX = ({ 
  batchData, seriesData, rapidsData, widgetData, variantData, groupData, 
  flowData, fallData,
  user, app, allVariants, brancheS, isDebug
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
      
    <Fragment>
          <BatchXEdit
            batchData={batchData}
            seriesData={seriesData}
            allVariants={allVariants}
            lock={batchData.completed ? Pref.isDone :
                 !batchData.live ? Pref.notlive : false}
          />
          
          {seriesData ?
            <ItemSerialsWrapX
              bID={batchData._id}
              quantity={batchData.quantity}
              seriesId={seriesData._id}
              itemsQ={!seriesData ? 0 : seriesData.items.length}
              unit={variantData.runUnits}
              app={app}
              lock={batchData.completed ? Pref.isDone :
                   !batchData.live ? Pref.notlive :
                   !seriesData ? `No ${Pref.series}` : false} 
            />
          :
            <SeriesForm
              batchData={batchData}
              lock={!batchData.live || batchData.completed}
            />
          }
          
          {seriesData && variantData.runUnits > 1 ?
            <UnitSetAll
        	    seriesId={seriesData._id}
        	    block={batchData.lock}
        	    bdone={batchData.completed}
        	    sqty={seriesData.items.length}
        	    vqty={variantData.runUnits}
        	  />
          : null }
          
          <CounterAssign
            id={batchData._id}
            waterfall={batchData.waterfall}
            app={app}
            lock={batchData.completed ? Pref.isDone :
                 !batchData.live ? Pref.notlive : false} />
          
          <span>
            <ActionLink
              address={'/print/generallabel/' + 
                        batchData.batch + 
                        '?group=' + groupData.alias +
                        '&widget=' + widgetData.widget + 
                        '&ver=' + variantData.variant + 
                        ( variantData.radioactive ? '💥' : ''  ) +
                        '&desc=' + widgetData.describe +
                        '&sales=' + (batchData.salesOrder || '') +
                        '&quant=' + batchData.quantity }
              title='Print Label'
              icon='fas fa-print'
              color='blackT' />
          </span>
          
          <BatchXIncomplete
            batchData={batchData}
            seriesData={seriesData}
            app={app}
            lock={batchData.completed ? Pref.isDone :
                 !batchData.live ? Pref.notlive : false} />
          
          <RemoveXBatch
            batchData={batchData}
            seriesData={seriesData}
            check={batchData.createdAt.toISOString()}
            lock={batchData.completed ? Pref.isDone :
                 !batchData.live ? Pref.notlive : false} />
          
      </Fragment>
        
      <div className='floattaskbar light'>
        
        <PopoverButton 
          targetid='batchviewpop'
          attach='vv'
          text='Print Label'
          icon='fa-solid fa-print gapR' />
        
        <span className='flexSpace' />
        
        <BatchExport
          group={groupData.group}
          widget={widgetData.widget}
          variant={variantData.variant}
          batchData={batchData}
          seriesData={seriesData}
          rapidsData={rapidsData}
          brancheS={brancheS}
          extraClass='medSm'
        />
        
        <PopoverButton 
          targetid='testpop'
          attach='actions'
          text='Actions'
          icon='fa-solid fa-star gapR'
        />
        <PopoverMenu targetid='testpop' extraClass='rightedge' attach='actions'>
    			<div>Edit Work Order</div>
    			<div>Add Items</div>
    			<div>Unit Set All</div>
    			<div>Counters</div>
    			<div>Series</div>
    			<div>Force Finish</div>
    			<div>Delete</div>
    			<div>Add Event</div>
    			<div>Time Budget</div>
    			<div>Alter Ship Date</div>
    			<div>ON Hold</div>
    			<div>Add Series</div>
    			<div>remove series</div>
        </PopoverMenu>
        
        
      </div>
      
      <Tabs
        tabs={ tabbar }
        wide={true}
        stick={false}
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
      
      <CreateTag
        when={b.createdAt}
        who={b.createdWho}
        whenNew={b.updatedAt}
        whoNew={b.updatedWho}
        dbKey={b._id}
      />
    </div>
  );
};
  
export default BatchPanelX;