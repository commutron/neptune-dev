import React, { Fragment } from 'react';
import './style.css';
import moment from 'moment';

import ActionLink from '/client/components/tinyUi/ActionLink.jsx';
import BlockForm from '/client/components/forms/BlockForm.jsx';
import BatchCreate from '/client/components/forms/BatchCreate.jsx';
import BatchEdit from '/client/components/forms/BatchEdit.jsx';
import BatchFormX from '/client/components/forms/BatchFormX.jsx';
import ItemSerialsWrap from '/client/components/forms/ItemSerials/ItemSerialsWrap.jsx';
import RiverSelect from '/client/components/forms/RiverSelect.jsx';
import CounterAssign from '/client/components/bigUi/ArrayBuilder/CounterAssign.jsx';
import NCEscape from '/client/components/forms/NCEscape.jsx';
import RMAForm from '/client/components/forms/RMAForm.jsx';
import RemoveBatch from '/client/components/forms/RemoveBatch.jsx';

import UnitSet from '/client/components/forms/UnitSet.jsx';
import PanelBreak from '/client/components/forms/PanelBreak.jsx';
import UndoFinish from '/client/components/forms/UndoFinish.jsx';
import ItemIncompleteForm from '/client/components/forms/ItemIncompleteForm.jsx';
import ScrapForm from '/client/components/forms/ScrapForm.jsx';

import WidgetEditForm from '/client/components/forms/WidgetEditForm.jsx';
import CompForm from '/client/components/forms/CompForm.jsx';
import FlowFormHead from '/client/components/forms/FlowFormHead.jsx';

import VariantForm from '/client/components/forms/VariantForm.jsx';

import Remove from '/client/components/forms/Remove.jsx';

const ActionBar = ({
  batchData, itemData, 
  groupData, widgetData, 
  variantData, allVariants,
  app, user,
  action, noText,
  ncTypesCombo
})=> (
  
  <div className='actionBar'>
    <div className='footLeft'>
    { 
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
    	    finishedAtI={itemData.finishedAt}
    	    timelock={ itemData.finishedAt !== false ?
    	      moment().diff(moment(itemData.finishedAt), 'minutes') 
    	      > (60 * 24 * 7) : true
    	    } />
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
                    '&sales=' + (batchData.salesOrder || '') +
                    '&quant=' + batchData.items.length }
          title='Print Label'
          icon='fa-print'
          color='whiteT' />
        <BlockForm
          id={batchData._id}
          edit={false}
          lock={batchData.finishedAt !== false} />
        <RMAForm
          id={batchData._id}
          editObj={false}
          trackOptions={app.trackOption}
          end={app.lastTrack}
          app={app}
          user={user}
          ncTypesCombo={ncTypesCombo || []} />
        <NCEscape
          id={batchData._id}
          user={user}
          nons={app.nonConOption}
          ncTypesCombo={ncTypesCombo || []} />
        <RemoveBatch
          title={batchData.batch}
          check={batchData.createdAt.toISOString()}
          entry={batchData}
          lockOut={batchData.finishedAt !== false} />
      </Fragment>
      :
      action === 'xbatch' ?
        <Fragment>
          <BatchFormX
            batchId={batchData._id}
            batchNow={batchData.batch}
            versionKey={variantData.versionKey}
            salesOrder={batchData.salesOrder}
            start={batchData.salesStart}
            end={batchData.salesEnd}
            quantity={batchData.quantity}
            groupId={batchData.groupId}
            widgetId={batchData.widgetId}
            allVariants={allVariants}
            lock={!variantData || !batchData.live} />
          <CounterAssign
            id={batchData._id}
            waterfall={batchData.waterfall}
            app={app}
            lock={batchData.completed === true} />
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
            icon='fa-print'
            color='whiteT' />
          <BlockForm
            id={batchData._id}
            edit={false}
            xBatch={true}
            lock={batchData.completed === true} />
          <Remove
            action='xbatch'
            title={batchData.batch}
            check={batchData.createdAt.toISOString()}
            entry={batchData}
            lockOut={batchData.completed === true} />
        </Fragment>
      :
      action === 'variant' && variantData ?
        <Fragment>
          <VariantForm
            widgetData={widgetData}
            variantData={variantData}
            app={app}
            rootWI={variantData.instruct} />
          <CompForm 
            vID={variantData._id} />
          <BatchCreate
            versionKey={variantData.versionKey}
            widgetId={widgetData._id}
            allVariants={allVariants}
            lock={!allVariants} />
          <BatchFormX
            batchId={false}
            batchNow='new'
            versionKey={variantData.versionKey}
            salesOrder={false}
            start={false}
            end={false}
            quantity={false}
            groupId={groupData._id}
            widgetId={widgetData._id}
            allVariants={allVariants}
            lock={!allVariants} />
          <Remove
            action='variant'
            title={variantData.variant}
            check={variantData.createdAt.toISOString()}
            entry={variantData}
            lockOut={variantData.live === true} />
        </Fragment>
      :
      action === 'widget' ?
        <Fragment>
          <WidgetEditForm
            id={widgetData._id}
            now={widgetData} />
          <VariantForm
            widgetData={widgetData}
            variantData={false}
            app={app}
            rootWI={groupData.wiki} />
          <FlowFormHead
            id={widgetData._id}
            edit={false}
            existFlows={widgetData.flows}
            app={app} />
          <BatchCreate
            versionKey={false}
            widgetId={widgetData._id}
            allVariants={allVariants}
            lock={!allVariants} />
          <BatchFormX
            batchId={false}
            batchNow='new'
            variantNow={false}
            salesOrder={false}
            start={false}
            end={false}
            quantity={false}
            groupId={groupData._id}
            widgetId={widgetData._id}
            allVariants={allVariants}
            lock={!allVariants} />
          <Remove
            action='widget'
            title={widgetData.widget}
            check={widgetData.createdAt && widgetData.createdAt.toISOString()}
            entry={widgetData._id}
            lockOut={!allVariants.every( x => x.live === false )} />
        </Fragment>
      : null
    }
    </div>
  </div>
);

export default ActionBar;