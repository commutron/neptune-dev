import React, { Fragment } from 'react';

import './style.css';

import ActionLink from '/client/components/tinyUi/ActionLink.jsx';

import BatchEdit from '/client/components/forms/Batch/BatchEdit';
import RemoveBatch from '/client/components/forms/Batch/RemoveBatch';
import BatchXEdit from '/client/components/forms/Batch/BatchXEdit';
import BatchXIncomplete from '/client/components/forms/Batch/BatchXIncomplete';
import RemoveXBatch from '/client/components/forms/Batch/RemoveXBatch';

import SeriesForm from '/client/components/forms/ItemSerialsX/SeriesForm';
import ItemSerialsWrapX from '/client/components/forms/ItemSerialsX/ItemSerialsWrapX';

import UnitSetX from '/client/components/forms/ItemSerialsX/UnitSetX';
import PanelBreakX from '/client/components/forms/ItemSerialsX/PanelBreakX';
import UndoFinishX from '/client/components/forms/ItemSerialsX/UndoFinishX';
import ItemIncompleteX from '/client/components/forms/ItemSerialsX/ItemIncompleteX';
import ScrapItemX from '/client/components/forms/ItemSerialsX/ScrapItemX';
import RemoveItem from '/client/components/forms/ItemSerialsX/RemoveItem';

import ItemSerialsWrap from '/client/components/forms/ItemSerials/ItemSerialsWrap';
import RiverSelect from '/client/components/forms/RiverSelect.jsx';
import CounterAssign from '/client/components/bigUi/ArrayBuilder/CounterAssign.jsx';
import NCEscape from '/client/components/forms/NCEscape.jsx';
import RMAForm from '/client/components/forms/RMAForm.jsx';

import UnitSet from '/client/components/forms/UnitSet.jsx';
import PanelBreak from '/client/components/forms/PanelBreak.jsx';
import UndoFinish from '/client/components/forms/UndoFinish.jsx';
import ItemIncompleteForm from '/client/components/forms/ItemIncompleteForm.jsx';
import ScrapForm from '/client/components/forms/ScrapForm.jsx';

import Remove from '/client/components/forms/Remove.jsx';

const ActionBar = ({
  batchData, seriesData, itemData, 
  groupData, widgetData, 
  variantData, allVariants,
  app, user,
  action, noText,
  ncTypesCombo
})=> (
  
  <Fragment>
    { 
  	action === 'xitem' ?
  	  <Fragment> 
    	  <UnitSetX
    	    seriesId={seriesData._id}
    	    item={itemData} />
    	  <PanelBreakX
          batchId={batchData._id}
          seriesId={seriesData._id}
          batchNum={batchData.batch}
    	    item={itemData} />
        <UndoFinishX
    	    batchId={batchData._id}
    	    finishedAtB={batchData.completedAt}
    	    seriesId={seriesData._id}
    	    serial={itemData.serial}
    	    finishedAtI={itemData.completedAt} />
        <ItemIncompleteX
          seriesId={seriesData._id}
          item={itemData}
          app={app} />
        <ScrapItemX
          seriesId={seriesData._id}
          item={itemData}
          ancillary={app.ancillaryOption} />
        <RemoveItem
          batchId={batchData._id}
          batch={batchData.batch}
          seriesId={seriesData._id}
          serial={itemData.serial}
          check={itemData.createdAt.toISOString()}
          lockOut={batchData.completed || itemData.completed} />
      </Fragment>
		:
		action === 'item' ?
  	  <Fragment> 
    	  <UnitSet
    	    id={batchData._id}
    	    item={itemData} />
    	  <PanelBreak
          id={batchData._id}
          batch={batchData.batch}
    	    item={itemData} />
        <UndoFinish
    	    id={batchData._id}
    	    finishedAtB={batchData.finishedAt}
    	    serial={itemData.serial}
    	    finishedAtI={itemData.finishedAt} />
        <ItemIncompleteForm
          id={batchData._id}
          item={itemData}
          app={app} />
        <ScrapForm
          id={batchData._id}
          item={itemData}
          anc={app.ancillaryOption} />
        <Remove
          action='item'
          title={itemData.serial}
          check={itemData.createdAt.toISOString()}
          entry={batchData}
          lockOut={batchData.finishedAt !== false} />
      </Fragment>
		:
    action === 'batch' ?
      <Fragment>
        <BatchEdit
          batchId={batchData._id}
          batchNow={batchData.batch}
          versionKey={variantData.versionKey}
          salesOrder={batchData.salesOrder || ''}
          start={batchData.start}
          end={batchData.end}
          quoteTimeBudget={batchData.quoteTimeBudget}
          allVariants={allVariants}
          lock={!variantData || !batchData.live} />
        <ItemSerialsWrap
          id={batchData._id}
          items={batchData.items}
          more={batchData.finishedAt === false}
          unit={variantData.runUnits}
          app={app} />
        <RiverSelect
          id={batchData._id}
          widget={widgetData}
          river={batchData.river}
          riverAlt={batchData.riverAlt}
          lock={batchData.finishedAt !== false} />
        <ActionLink
          address={'/print/generallabel/' + 
                    batchData.batch + 
                    '?group=' + groupData.alias +
                    '&widget=' + widgetData.widget + 
                    '&ver=' + variantData.variant +
                    '&desc=' + widgetData.describe +
                    '&sales=' + '' +
                    '&quant=' + batchData.items.length }
          title='Print Label'
          icon='fas fa-print'
          color='whiteT' />
        <RMAForm
          id={batchData._id}
          editObj={false}
          trackOptions={app.trackOption}
          end={app.lastTrack}
          app={app}
          user={user}
          ncTypesCombo={ncTypesCombo || []}
          lockOut={batchData.lock} />
        <NCEscape
          id={batchData._id}
          user={user}
          nons={app.nonConOption}
          ncTypesCombo={ncTypesCombo || []}
          lockOut={batchData.lock} />
        <RemoveBatch
          title={batchData.batch}
          check={batchData.createdAt.toISOString()}
          entry={batchData}
          lockOut={batchData.finishedAt !== false} />
      </Fragment>
      :
      action === 'xbatch' ?
        <Fragment>
          <BatchXEdit
            batchData={batchData}
            seriesData={seriesData}
            allVariants={allVariants}
            lock={!variantData || !batchData.live} />
          
          <SeriesForm
            batchData={batchData}
            lock={seriesData || batchData.completed}
          />
        
          <ItemSerialsWrapX
            bID={batchData._id}
            quantity={batchData.quantity}
            seriesId={seriesData._id}
            itemsQ={!seriesData ? 0 : seriesData.items.length}
            unit={variantData.runUnits}
            app={app}
            lock={!seriesData || batchData.completed === true} />
          
          <CounterAssign
            id={batchData._id}
            waterfall={batchData.waterfall}
            app={app}
            lock={batchData.completed === true} />
          
          <span>
            <ActionLink
              address={'/print/generallabel/' + 
                        batchData.batch + 
                        '?group=' + groupData.alias +
                        '&widget=' + widgetData.widget + 
                        '&ver=' + variantData.variant +
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
            app={app} />
          
          <RemoveXBatch
            batchData={batchData}
            seriesData={seriesData}
            check={batchData.createdAt.toISOString()}
            lockOut={batchData.completed === true} />
          
        </Fragment>
      : null
    }
  </Fragment>
);

export default ActionBar;