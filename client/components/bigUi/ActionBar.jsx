import React, {Component} from 'react';

//import DataToggle from '../tinyUi/DataToggle.jsx';
import IkyToggle from '../tinyUi/IkyToggle.jsx';
import NCAdd from '../river/NCAdd.jsx';
import NonConEdit from '../forms/NonConEdit.jsx';
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


export default class ActionBar extends Component	{
  
  render() {
    
    //let snap = this.props.snap;
    let batchData = this.props.batchData;
    let itemData = this.props.itemData;
    let widgetData = this.props.widgetData;
    let versionData = this.props.versionData;
    let groupData = this.props.groupData;
    let app = this.props.app;
    let act = this.props.action;
    let ncedit = Roles.userIsInRole(Meteor.userId(), 'run');
    
    return (
      <div className='dashAction'>
        <div className='footLeft'>
        { 
        act === 'build' && ncedit ?
            <NonConEdit
      		    ncData={batchData.nonCon}
      		    id={batchData._id}
              serial={itemData.serial}
      		    nons={app.nonConOption} />
      	:
      	act === 'batchBuild' && batchData.items.length === 0 ?
      	  <MultiItemForm
            id={batchData._id}
            items={batchData.items}
            more={batchData.finishedAt === false}
            unit={versionData.units} />
      	:
      	act === 'item' ?
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
        act === 'batch' ?
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
              unit={versionData.units} />
            <BlockForm
              id={batchData._id}
              edit={false}
              lock={batchData.finishedAt !== false} />
            <RiverSelect
              id={batchData._id}
              widget={widgetData}
              river={batchData.river}
              riverAlt={batchData.riverAlt}
              lock={batchData.finishedAt !== false} />
            <NCEscape
              id={batchData._id}
              nons={app.nonConOption} />
            <RMAForm
              id={batchData._id}
              edit={false}
              options={app.trackOption}
              end={app.lastTrack} />
            <Remove
              action='batch'
              title={batchData.batch}
              check={batchData.createdAt.toISOString()}
              entry={batchData} />
          </div>
          :
          act === 'widget' ?
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
          act === 'group' ?
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
          act === 'newGroup' ?
             <GroupForm id={false} name={false} alias={false} wiki={false} />
          :null
        }

        </div>
        
  { /* Center Section */ }      
        <div className='footCent'>
          {act === 'build' ?
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
  }
}