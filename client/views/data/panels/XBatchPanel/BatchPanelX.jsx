import React, { Fragment } from 'react';
import Pref from '/public/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import XBatchTimeline from '/client/components/bigUi/BatchFeed/XBatchTimeline';

import InfoTab from './InfoTab';
import TimeTab from './TimeTab';
import CountTab from './CountTab';
import ProblemTab from './ProblemTab';
import RapidExtendTab from './RapidExtendTab';

import BatchEdit from '/client/components/forms/Batch/Child/BatchEdit';
import SeriesForm, { SeriesDelete } from '/client/components/forms/ItemSerialsX/Parent/SeriesForm';
import ItemSerialsWrap from '/client/components/forms/ItemSerialsX/ItemSerialsWrap';
import UnitSetAll from '/client/components/forms/ItemSerialsX/Parent/UnitSetAll';
import CounterAssign from '/client/components/bigUi/ArrayBuilder/CounterAssign';
import BatchIncomplete from '/client/components/forms/Batch/Child/BatchIncomplete';
import EventCustom from '/client/components/forms/Batch/Child/EventCustom';

import RemoveBatch from '/client/components/forms/Batch/Child/RemoveBatch';

import { PopoverButton, PopoverMenu, PopoverAction, MatchButton } from '/client/layouts/Models/Popover';

import BatchOneSheet from '/client/views/paper/BatchOneSheet';
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
  
  const openAction = (dialogId)=> document.getElementById(dialogId)?.showModal();
  
  function toggleHold() {
    if(!b.hold) {
      Meteor.call('setHold', b._id, (err)=>{
        err && console.log(err);
      });
    }else{
      Meteor.call('unsetHold', b._id, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  const debugTrace = (kyd)=> {
      const method = kyd === 'rebuid' ? 'rebuildOneTrace' :
                     kyd === 'move' ? 'updateOneMovement' :
                     kyd === 'noise' ? 'updateOneNoise' : null;
    if(isDebug && method) {
      Meteor.apply(method, [batchData._id], {wait: true},
      (error)=> {
        error && console.log(error);
      });
      document.getElementById('poweractions')?.hidePopover();
    }
  };
  
  const isOpen = !b.completed && b.live;
  
  const accessR = Roles.userIsInRole(Meteor.userId(), 'run');
  const accessE = Roles.userIsInRole(Meteor.userId(), 'edit');
  const accessQ = Roles.userIsInRole(Meteor.userId(), 'qa');
  
  const canEdt = (isOpen || isDebug) && (accessE || accessR); 
  const canSrs = isOpen && (!seriesData || seriesData.items.length < 1) && accessR;
  const canCnt = isOpen && accessR;
  const canUnt = seriesData && variantData.runUnits > 1 && (accessE || accessQ);
  const canItm = isOpen && seriesData && Roles.userIsInRole(Meteor.userId(), ['create', 'kitting']);
  const canImp = isOpen && accessQ;
  const canEvt = accessE || accessR;
  const canRmv = isOpen && Roles.userIsInRole(Meteor.userId(), 'remove');
                 
  return(
    <div className='section' key={b.batch}>
      
      <Fragment>
        <BatchEdit
          batchData={batchData}
          seriesData={seriesData}
          allVariants={allVariants}
          canEdit={accessE}
          access={canEdt}
        />
        
        {!seriesData ?
          <SeriesForm
            batchData={batchData}
            access={canSrs}
          />
        :
          <SeriesDelete
            batchId={batchData._id}
            seriesId={seriesData._id}
            srs={seriesData}
          />
        }
        <ItemSerialsWrap
          bID={batchData._id}
          quantity={batchData.quantity}
          seriesId={seriesData._id}
          itemsQ={!seriesData ? 0 : seriesData.items.length}
          unit={variantData.runUnits}
          app={app}
          isDebug={isDebug}
          access={canItm}
        />
        <UnitSetAll
    	    bID={b._id}
    	    seriesId={seriesData._id}
    	    block={batchData.lock}
    	    sqty={seriesData?.items?.length}
    	    vqty={variantData.runUnits}
    	    access={canUnt}
    	  />
        <CounterAssign
          bID={b._id}
          waterfall={batchData.waterfall}
          app={app}
          access={canCnt}
        />
        <EventCustom 
          batchId={b._id}
        />
        <BatchIncomplete
          batchData={batchData}
          seriesData={seriesData}
          access={canImp}
        />
        <RemoveBatch
          batchData={batchData}
          seriesData={seriesData}
          check={batchData.createdAt.toISOString()}
          access={canRmv}
        />
      </Fragment>
        
      <div className='floattaskbar stick'>
        
        <PopoverButton 
          targetid='editspop'
          attach='edits'
          text='Edits'
          icon='fa-solid fa-file-pen gapR'
        />
        <PopoverMenu targetid='editspop' attach='edits'>
          <PopoverAction 
            doFunc={()=>openAction(b._id+'_batch_form')}
            text={'Edit ' + Pref.xBatch}
            icon='fa-solid fa-cubes'
            lock={!canEdt}
          />
          {!seriesData ?
          <PopoverAction 
            doFunc={()=>openAction(b._id+'_series_form')}
            text={`Add ${Pref.series}`}
            icon='fa-solid fa-layer-group'
            lock={!canSrs}
          />
          :
          <PopoverAction 
            doFunc={()=>openAction(b._id+'_seriesdelete_form')}
            text={`Remove Empty ${Pref.series}`}
            icon='fa-solid fa-layer-group'
            lock={!canSrs}
          />
          }
          <PopoverAction 
            doFunc={()=>openAction(b._id+'_units_form')}
            text={`Set ${Pref.unit}s`}
            icon='fa-solid fa-table-cells'
            lock={!canUnt}
          />
    			
    			{/*}
    			<div>Time Budget</div>
    			<div>Alter Ship Date</div>
    			*/}
    			
    			<PopoverAction 
            doFunc={()=>openAction(b._id+'_delete_form')}
            text={`Delete ${Pref.xBatch}`}
            icon='fa-solid fa-minus-circle'
            lock={!canRmv}
          />
        </PopoverMenu>
         
        <PopoverButton 
          targetid='poweractions'
          attach='actions'
          text='Actions'
          icon='fa-solid fa-star gapR'
        />
        <PopoverMenu targetid='poweractions' attach='actions'>
          <PopoverAction 
            doFunc={()=>toggleHold()}
            text={b.hold ? 'Remove Hold' : 'Apply Hold'}
            icon='fa-solid fa-pause'
            lock={!accessR}
          />
          <PopoverAction 
            doFunc={()=>openAction(b._id+'_event_form')}
            text='Add Custom Event'
            icon='fa-solid fa-location-pin'
            lock={!canEvt}
          />
          <PopoverAction 
            doFunc={()=>openAction(b._id+'_incomplete_form')}
            text='Force Finish'
            icon='fa-solid fa-flag-checkered'
            lock={!canImp}
          />
            
          {isDebug ?
          <Fragment>
            <MatchButton 
              title='Manual Update TraceDB - Rebuild Functions'
              text='Rebuild Trace'
              icon='fa-solid fa-trowel-bricks'
              doFunc={()=>debugTrace('rebuild')}
            />
            <MatchButton 
              title='Manual Update TraceDB - Movement Functions'
              text='Update Move Trace' 
              icon='fa-solid fa-arrows-spin'
              doFunc={()=>debugTrace('move')}
            />
            <MatchButton 
              title='Manual Update TraceDB - Noise Functions'
              text='Update Noise Trace' 
              icon='fa-solid fa-volume-high'
              doFunc={()=>debugTrace('noise')}
            />
          </Fragment>
        : null}
        </PopoverMenu>
        
        <MatchButton 
          text={`${Pref.itemSerial} numbers`}
          icon={'fa-solid fa-qrcode'}
          doFunc={()=>openAction(b._id+'_items_form')}
          lock={!canItm}
        />
        <MatchButton 
          text={`${Pref.counter}s`}
          icon='fa-solid fa-stopwatch'
          doFunc={()=>openAction(b._id+'_counter_form')}
          lock={!canCnt}
        />
        
        <span className='flexSpace' />
        
        <MatchButton 
          title='Print Label'
          text='Print Label' 
          icon='fa-solid fa-pager'
          doFunc={()=>FlowRouter.go('/print/generallabel/' + 
                    batchData.batch + 
                    '?group=' + groupData.alias +
                    '&widget=' + widgetData.widget + 
                    '&ver=' + variantData.variant + 
                    ( variantData.radioactive ? '💥' : ''  ) +
                    '&desc=' + widgetData.describe +
                    '&sales=' + (batchData.salesOrder || '') +
                    '&quant=' + batchData.quantity)}
        />
        
        <BatchOneSheet
          group={groupData.alias}
          widget={widgetData.widget}
          desc={widgetData.describe}
          variantData={variantData}
          batchData={batchData}
          riverTitle={flowData.riverTitle}
          rootURL={app.instruct}
          extraClass='popbutton'
        />
        
        <BatchExport
          group={groupData.group}
          widget={widgetData.widget}
          variant={variantData.variant}
          batchData={batchData}
          seriesData={seriesData}
          rapidsData={rapidsData}
          brancheS={brancheS}
          extraClass='popbutton'
        />
        
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