import React from 'react';
import moment from 'moment';

import ActionLink from '/client/components/uUi/ActionLink.jsx';
import BlockForm from '../forms/BlockForm.jsx';
import BatchForm from '../forms/BatchForm.jsx';
import BatchFormX from '../forms/BatchFormX.jsx';
import MultiItemForm from '../forms/MultiItemForm.jsx';
import RiverSelect from '../forms/RiverSelect.jsx';
import CounterAssign from '../forms/CounterAssign.jsx';
import NCEscape from '../forms/NCEscape.jsx';
import RMAForm from '../forms/RMAForm.jsx';
import Remove from '../forms/Remove.jsx';

import UnitSet from '../forms/UnitSet.jsx';
import PanelBreak from '../forms/PanelBreak.jsx';
import ScrapForm from '../forms/ScrapForm.jsx';

import WidgetEditForm from '../forms/WidgetEditForm.jsx';
import VersionForm from '../forms/VersionForm.jsx';
import FlowForm from '../forms/FlowForm.jsx';

import GroupForm from '../forms/GroupForm.jsx';
import WidgetNewForm from '../forms/WidgetNewForm.jsx';

const ActionBar = ({batchData, itemData, groupData, widgetData, versionData, app, action, noText})=> (
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
          lock={batchData.finishedAt !== false}
          noText={noText} />
      </div>
		:
    action === 'batch' ?
      <div>
        <BatchForm
          batchId={batchData._id}
          batchNow={batchData.batch}
          versionNow={batchData.versionKey}
          salesOrder={batchData.salesOrder || ''}
          start={batchData.start}
          end={batchData.end}
          widgetId={batchData.widgetId}
          versions={widgetData.versions}
          lock={!widgetData.versions || !batchData.active}
          noText={noText} />
        <MultiItemForm
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
                    '&fulfill=' + (batchData.end || '') +
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
          edit={false}
          options={app.trackOption}
          end={app.lastTrack}
          app={app}
          noText={noText} />
        <NCEscape
          id={batchData._id}
          nons={app.nonConOption}
          noText={noText} />
        <Remove
          action='batch'
          title={batchData.batch}
          check={batchData.createdAt.toISOString()}
          entry={batchData}
          lock={batchData.finishedAt !== false}
          noText={noText} />
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
          lock={!widgetData.versions || !batchData.active}
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
                    '&fulfill=' + (batchData.salesEnd || '') +
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
          lock={batchData.completed === true}
          noText={noText} />
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
          <FlowForm
            id={widgetData._id}
            edit={false}
            existFlows={widgetData.flows}
            options={app.trackOption}
            end={app.lastTrack}
            noText={noText} />
          <BatchForm
            batchId={false}
            batchNow='new'
            versionNow='new'
            start={false}
            end={false}
            widgetId={widgetData._id}
            versions={widgetData.versions}
            lock={!widgetData.versions}
            noText={noText} />
          <BatchFormX
            batchId={false}
            batchNow='new'
            versionNow='new'
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
      :
      action === 'group' ?
        <div>
          <GroupForm
            id={groupData._id}
            name={groupData.group}
            alias={groupData.alias}
            wiki={groupData.wiki}
            noText={noText}
            primeTopRight={false} />
          <WidgetNewForm
            groupId={groupData._id}
            end={app.lastTrack} 
            rootWI={app.instruct}
            noText={noText} />
          <Remove
            action='group'
            title={groupData.group}
            check={groupData.createdAt.toISOString()}
            entry={groupData._id}
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