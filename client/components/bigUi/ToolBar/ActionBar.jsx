import React from 'react';
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
import VersionForm from '/client/components/forms/VersionForm.jsx';
import RemoveVersion from '/client/components/forms/RemoveVersion.jsx';
import CompForm from '/client/components/forms/CompForm.jsx';
import FlowFormHead from '/client/components/forms/FlowFormHead.jsx';

import Remove from '/client/components/forms/Remove.jsx';

const ActionBar = ({
  batchData, itemData, 
  groupData, 
  widgetData, versionData, 
  app, user,
  action, noText,
  ncTypesCombo
})=> (
  
  <div className='actionBar'>
    <div className='footLeft'>
    { 
  	action === 'item' ?
  	  <div> 
    	  <UnitSet
    	    id={batchData._id}
    	    item={itemData}
    	    noText={noText} />
    	 <PanelBreak
          id={batchData._id}
          batch={batchData.batch}
    	    item={itemData}
    	    noText={noText} />
        <UndoFinish
    	    id={batchData._id}
    	    finishedAtB={batchData.finishedAt}
    	    serial={itemData.serial}
    	    finishedAtI={itemData.finishedAt}
    	    timelock={ itemData.finishedAt !== false ?
    	      moment().diff(moment(itemData.finishedAt), 'minutes') 
    	      > (60 * 24 * 7) : true
    	    }
    	    noText={noText} />
        <ItemIncompleteForm
	        id={batchData._id}
	        item={itemData}
	        app={app}
	        noText={noText} />
	      <ScrapForm
	        id={batchData._id}
	        item={itemData}
	        anc={app.ancillaryOption}
	        noText={noText} />
        <Remove
          action='item'
          title={itemData.serial}
          check={itemData.createdAt.toISOString()}
          entry={batchData}
          lockOut={batchData.finishedAt !== false}
          noText={noText} />
      </div>
		:
    action === 'batch' ?
      <div>
        <BatchEdit
          batchId={batchData._id}
          batchNow={batchData.batch}
          versionNow={batchData.versionKey}
          salesOrder={batchData.salesOrder || ''}
          start={batchData.start}
          end={batchData.end}
          quoteTimeBudget={batchData.quoteTimeBudget}
          versions={widgetData.versions}
          lock={!widgetData.versions || !batchData.live}
          noText={noText} />
        <ItemSerialsWrap
          id={batchData._id}
          items={batchData.items}
          more={batchData.finishedAt === false}
          unit={versionData.units}
          app={app}
          noText={noText} />
        <RiverSelect
          id={batchData._id}
          widget={widgetData}
          river={batchData.river}
          riverAlt={batchData.riverAlt}
          lock={batchData.finishedAt !== false}
          noText={noText} />
        <ActionLink
          address={'/print/generallabel/' + 
                    batchData.batch + 
                    '?group=' + groupData.alias +
                    '&widget=' + widgetData.widget + 
                    '&ver=' + versionData.version +
                    '&desc=' + widgetData.describe +
                    '&sales=' + (batchData.salesOrder || '') +
                    '&quant=' + batchData.items.length }
          title='Print Label'
          icon='fa-print'
          color='whiteT'
          noText={noText} />
        <BlockForm
          id={batchData._id}
          edit={false}
          lock={batchData.finishedAt !== false}
          noText={noText} />
        <RMAForm
          id={batchData._id}
          editObj={false}
          trackOptions={app.trackOption}
          end={app.lastTrack}
          app={app}
          user={user}
          noText={noText}
          ncTypesCombo={ncTypesCombo || []} />
        <NCEscape
          id={batchData._id}
          user={user}
          nons={app.nonConOption}
          noText={noText}
          ncTypesCombo={ncTypesCombo || []} />
        <RemoveBatch
          title={batchData.batch}
          check={batchData.createdAt.toISOString()}
          entry={batchData}
          lockOut={batchData.finishedAt !== false} />
      </div>
      :
      action === 'xbatch' ?
      <div>
        <BatchFormX
          batchId={batchData._id}
          batchNow={batchData.batch}
          versionNow={batchData.versionKey}
          salesOrder={batchData.salesOrder}
          start={batchData.salesStart}
          end={batchData.salesEnd}
          quantity={batchData.quantity}
          groupId={batchData.groupId}
          widgetId={batchData.widgetId}
          versions={widgetData.versions}
          lock={!widgetData.versions || !batchData.live}
          noText={noText} />
        <CounterAssign
          id={batchData._id}
          waterfall={batchData.waterfall}
          app={app}
          lock={batchData.completed === true}
          noText={noText} />
        <ActionLink
          address={'/print/generallabel/' + 
                    batchData.batch + 
                    '?group=' + groupData.alias +
                    '&widget=' + widgetData.widget + 
                    '&ver=' + versionData.version +
                    '&desc=' + widgetData.describe +
                    '&sales=' + (batchData.salesOrder || '') +
                    '&quant=' + batchData.quantity }
          title='Print Label'
          icon='fa-print'
          color='whiteT'
          noText={noText} />
        <BlockForm
          id={batchData._id}
          edit={false}
          xBatch={true}
          lock={batchData.completed === true}
          noText={noText} />
        <Remove
          action='xbatch'
          title={batchData.batch}
          check={batchData.createdAt.toISOString()}
          entry={batchData}
          lockOut={batchData.completed === true}
          noText={noText} />
      </div>
      :
        action === 'version' && versionData ?
        <div>
          <VersionForm
            widgetData={widgetData}
            versionData={versionData}
            app={app}
            rootWI={versionData.wiki}
            small={false} />
          <CompForm 
            id={widgetData._id} 
            versionKey={versionData.versionKey} />
          <BatchCreate
            versionNow={versionData.versionKey}
            widgetId={widgetData._id}
            versions={widgetData.versions}
            lock={!widgetData.versions}
            noText={noText} />
          <BatchFormX
            batchId={false}
            batchNow='new'
            versionNow={versionData.versionKey}
            salesOrder={false}
            start={false}
            end={false}
            quantity={false}
            groupId={groupData._id}
            widgetId={widgetData._id}
            versions={widgetData.versions}
            lock={!widgetData.versions}
            noText={noText} />
          <RemoveVersion
            widgetId={widgetData._id}
            versionKey={versionData.versionKey}
            check={versionData.createdAt.toISOString()} />
        </div>
      :
      action === 'widget' ?
        <div>
          <WidgetEditForm
            id={widgetData._id}
            now={widgetData}
            noText={noText} />
          <VersionForm
            widgetData={widgetData}
            version={false}
            app={app}
            noText={noText} />
          <FlowFormHead
            id={widgetData._id}
            edit={false}
            existFlows={widgetData.flows}
            app={app}
            noText={noText} />
          <BatchCreate
            versionNow={false}
            widgetId={widgetData._id}
            versions={widgetData.versions}
            lock={!widgetData.versions}
            noText={noText} />
          <BatchFormX
            batchId={false}
            batchNow='new'
            versionNow={false}
            salesOrder={false}
            start={false}
            end={false}
            quantity={false}
            groupId={groupData._id}
            widgetId={widgetData._id}
            versions={widgetData.versions}
            lock={!widgetData.versions}
            noText={noText} />
          <Remove
            action='widget'
            title={widgetData.widget}
            check={widgetData.createdAt.toISOString()}
            entry={widgetData._id}
            noText={noText} />
        </div>
      : null
    }

    </div>
    
  { /* Center Section */ }      
    <div className='footCent'></div>
        
  { /* Right Section */ }
    <div className='footRight'></div>
  </div>
);

export default ActionBar;