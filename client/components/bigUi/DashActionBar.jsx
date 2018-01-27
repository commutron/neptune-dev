import React from 'react';
import moment from 'moment';

import ActionLink from '/client/components/uUi/ActionLink.jsx';
import IkyToggle from '../tinyUi/IkyToggle.jsx';
import NCAdd from '../river/NCAdd.jsx';

import BlockForm from '../forms/BlockForm.jsx';
import BatchForm from '../forms/BatchForm.jsx';
import MultiItemForm from '../forms/MultiItemForm.jsx';
import RiverSelect from '../forms/RiverSelect.jsx';
import NCEscape from '../forms/NCEscape.jsx';
import RMAForm from '../forms/RMAForm.jsx';
import Remove from '../forms/Remove.jsx';

import ScrapForm from '../forms/ScrapForm.jsx';
import UnitSet from '../forms/UnitSet.jsx';

import WidgetEditForm from '../forms/WidgetEditForm.jsx';
import VersionForm from '../forms/VersionForm.jsx';
import FlowForm from '../forms/FlowForm.jsx';

import GroupForm from '../forms/GroupForm.jsx';
import WidgetNewForm from '../forms/WidgetNewForm.jsx';


const DashActionBar = ({ batchData, itemData, widgetData, versionData, groupData, app, action})=>	(
  <div className='dashAction'>
    <div className='footLeft'>
    {
  	action === 'batchBuild' && 
  	  batchData.items
  	    .filter( x => x.history.length < 1 )
  	      .length < 1 ?
  	  <MultiItemForm
        id={batchData._id}
        items={batchData.items}
        more={batchData.finishedAt === false}
        unit={versionData.units}
        app={app} />
  	:
  	action === 'item' ?
  	  <div> 
    	  <UnitSet
    	    id={batchData._id}
    	    item={itemData} />
        <ScrapForm
	        id={batchData._id}
	        item={itemData}
	        anc={app.ancillaryOption} />
        <Remove
          action='item'
          title={itemData.serial}
          check={itemData.createdAt.toISOString()}
          entry={batchData} />
      </div>
		:
    action === 'batch' ?
      <div>
        <BatchForm
          batchId={batchData._id}
          batchNow={batchData.batch}
          versionNow={batchData.versionKey}
          start={batchData.start}
          end={batchData.end}
          widgetId={batchData.widgetId}
          versions={widgetData.versions}
          lock={!widgetData.versions || !batchData.active} />
        <MultiItemForm
          id={batchData._id}
          items={batchData.items}
          more={batchData.finishedAt === false}
          unit={versionData.units}
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
                    '&ver=' + versionData.version +
                    '&desc=' + widgetData.describe +
                    '&quant=' + batchData.items.length +
                    '&date=' + moment(batchData.end).format('MMMM D')}
          title='Print Label'
          icon='fa-print'
          color='whiteT' />
        <BlockForm
          id={batchData._id}
          edit={false}
          lock={batchData.finishedAt !== false} />
        <RMAForm
          id={batchData._id}
          edit={false}
          options={app.trackOption}
          end={app.lastTrack} />
        <NCEscape
          id={batchData._id}
          nons={app.nonConOption} />
        <Remove
          action='batch'
          title={batchData.batch}
          check={batchData.createdAt.toISOString()}
          entry={batchData} />
      </div>
      :
      action === 'widget' ?
        <div>
          <WidgetEditForm
            id={widgetData._id}
            now={widgetData} />
          <VersionForm
            widgetData={widgetData}
            version={false}
            app={app} />
          <FlowForm
            id={widgetData._id}
            edit={false}
            existFlows={widgetData.flows}
            options={app.trackOption}
            end={app.lastTrack} />
          <BatchForm
            batchId={false}
            batchNow='new'
            versionNow='new'
            start={false}
            end={false}
            widgetId={widgetData._id}
            versions={widgetData.versions}
            lock={!widgetData.versions} />
          <Remove
            action='widget'
            title={widgetData.widget}
            check={widgetData.createdAt.toISOString()}
            entry={widgetData._id} />
        </div>
      :
      action === 'group' ?
        <div>
          <GroupForm
            id={groupData._id}
            name={groupData.group}
            alias={groupData.alias}
            wiki={groupData.wiki} />
          <WidgetNewForm
            groupId={groupData._id}
            end={app.lastTrack} 
            rootWI={app.instruct} />
          <Remove
            action='group'
            title={groupData.group}
            check={groupData.createdAt.toISOString()}
            entry={groupData._id} />
        </div>
      :
      action === 'newGroup' ?
         <GroupForm id={false} name={false} alias={false} wiki={false} />
      :null
    }

    </div>
    
{ /* Center Section */ }      
    <div className='footCent'>
      {action === 'build' ?
        <NCAdd 
          id={batchData._id}
          barcode={itemData.serial}
          app={app} />
      :null}
    </div>
        
{ /* Right Section */ }
    <div className='footRight'>
      <IkyToggle />
    </div>
  </div>
);

export default DashActionBar;