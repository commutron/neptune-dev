import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import DataWrap from './DataWrap.jsx';
import { TraverseWrap } from '/client/layouts/DataExploreLayout.jsx';

import SearchHelp from './SearchHelp.jsx';

import ItemPanel from './panels/ItemPanel.jsx';
import BatchPanel from './panels/BatchPanel.jsx';
import WidgetPanel from './panels/WidgetPanel.jsx';
import GroupPanel from './panels/GroupPanel.jsx';
//import BlockPanel from './panels/BlockPanel.jsx';
//import ScrapPanel from './panels/ScrapPanel.jsx';

import BatchesList from './lists/BatchesList.jsx';
import ItemsList from './lists/ItemsList.jsx';
import GroupsList from './lists/GroupsList.jsx';
import WidgetsList from './lists/WidgetsList.jsx';

/*
view: this.props.view,
request: this.props.request,
specify: this.props.specify
*/

export default class DataViewOps extends Component	{
  
  linkedBatch(wId, vKey) {
    return this.props.allBatch.find(x => x.widgetId === wId, x => x.versionKey === vKey);
  }
  
  allLinkedBatches(wId) {
    return this.props.allBatch.filter(x => x.widgetId === wId);
  }
  
  groupActiveWidgets(gId) {
    let widgetsList = this.props.allWidget.filter(x => x.groupId === gId);
    let activeBatch = this.props.allBatch.filter( x => x.active === true);
    
    let activeList = [];
    for(let wdgt of widgetsList) {
      let match = activeBatch.find(x => x.widgetId === wdgt._id);
      match ? activeList.push(match.widgetId) : false;
    }
    return activeList;
  }
  
  itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }

  getGroup(request) {
    return this.props.allGroup
            .find( x => 
              x._id === request || 
              x.alias === request || 
              x.group === request );
  }
  
  group() {
    return this.props.allGroup.find(x => x.group === this.props.orb);
  }

  groupAlias() {
    return this.props.allGroup.find(x => x.alias === this.props.orb);
  }
  
  linkedGroup(gId) {
    return this.props.allGroup.find(x => x._id === gId);
  }
  
  getWidget(request) {
    return this.props.allWidget
            .find( x => 
              x._id === request || 
              x.widget === request );
  }
  
  widget() {
    return this.props.allWidget.find(x => x.widget === this.props.orb);
  }
  
  linkedWidget(wId) {
    return this.props.allWidget.find(x => x._id === wId);
  }
  
  groupWidgets(gId) {
    return this.props.allWidget.filter(x => x.groupId === gId);
  }
  
  versionData(versions, vKey) {
    return versions.find(x => x.versionKey === vKey);
  }

  render () {

    const orb = this.props.orb;
    const app = this.props.app;
    const allGroup = this.props.allGroup;
    const allWidget = this.props.allWidget;
    const allBatch = this.props.allBatch;
    const hotBatch = this.props.hotBatch;
    
    const view = this.props.view;
    const request = this.props.request;
    const specify = this.props.specify;

    if(!view) {
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <div className='centre wide'>
            <SearchHelp />
            
            <div className='centre'>
              {allBatch.map( (entry, index)=>{
                return(
                  <button
                    key={index}
                    className='action clear'
                    onClick={()=>FlowRouter.go('/data/batch?request=' + entry.batch)}
                  >{entry.batch}</button>
              )})}
              <hr />
              <button
                className='action clear'
                onClick={()=>FlowRouter.go('/data/group?request=protogen')}
              >Protogen</button>
            </div>
          </div>
        </div>
      );
    }

    if(request === 'protogen') {
      Session.set('nowBatch', 'julie');
      return (
        <div className='dashMainFull'>
          <div className='centre'>
            <p>remember the cant</p>
          </div>
        </div>
      );
    }
    
    if(view === 'allgroup') {
      return (
        <TraverseWrap action='newGroup'>
          <GroupsList groupData={allGroup} batchData={allBatch} widgetData={allWidget} />
        </TraverseWrap>
      );
    }
    
    /*
    if(orb === Pref.block || orb === Pref.blck) {
      Session.set('now', Pref.block);
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <BlockPanel batchData={allBatch} />
        </div>
      );
    }
    if(orb === Pref.scrap || orb === Pref.scrp) {
      Session.set('now', Pref.scrap);
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <ScrapPanel batchData={allBatch} />
        </div>
      );
    }
    */

  // Batch
    if(view === 'batch') {
      if(hotBatch) {
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        return (
			    <TraverseWrap
			      batchData={hotBatch}
            widgetData={widget}
            versionData={version}
            groupData={group} 
            app={app}
            action='batch'
          >
            <BatchPanel
              batchData={hotBatch}
              widgetData={widget}
              versionData={version}
              groupData={group} 
              app={app} />
            <ItemsList
			        batchData={hotBatch}
			        widgetData={widget}
			        tide={orb} />
          </TraverseWrap>
        );
      }
    }
	  
	  
	  /*
  // Item
    //// barcode numbers are short durring dev but they will have to longer in production
    ////// this will also need to be changed???? for alphnumeric barcodes such as with TGS
		if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
		  //let lookup = this.batchByItem();
      if(hotBatch) {
        let item = this.itemData(hotBatch.items, orb);
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        return (
          <TraverseWrap
            batchData={hotBatch}
            itemData={item}
            widgetData={widget}
            versionData={version}
            groupData={group}
            app={app}
            action='item'
          >
            <ItemsList
              batchData={hotBatch}
              widgetData={widget}
              tide={orb} />
            <div>
              <ItemPanel
                batchData={hotBatch}
                itemData={item}
                widgetData={widget}
                versionData={version}
                groupData={group}
                app={app}
                listTitle={true} />
            </div>
          </TraverseWrap>
        );
      }
    }
*/
  // Group
    if(view === 'group') {
      const group = this.getGroup(request);
      //let alias = this.groupAlias();
      //let group = this.group();
      //let lookup = alias ? alias : group ? group : false;
      if(group) {
        let widgets = this.groupWidgets(group._id);
        let activeWidgets = this.groupActiveWidgets(group._id);
        return (
          <TraverseWrap
            batchData={false}
            itemData={false}
            widgetData={widgets}
            versionData={false}
            groupData={group}
            app={app}
            action='group'
          >
            <GroupPanel groupData={group} app={app} />
            <WidgetsList
              groupAlias={group.alias}
              widgetData={widgets}
              active={activeWidgets} />
          </TraverseWrap>
        );
      }
    }


  // Widget
    if(view === 'widget') {
      const widget = this.getWidget(request);
      if(widget) {
        Session.set('nowBatch', false);
        let group = this.linkedGroup(widget.groupId);
        let allWidgets = this.groupWidgets(widget.groupId);
        let allBatches = this.allLinkedBatches(widget._id);
        return (
          <TraverseWrap
            batchData={false}
            itemData={false}
            widgetData={widget}
            versionData={false}
            groupData={group}
            app={app}
            action='widget'
          >
            <WidgetPanel
              widgetData={widget}
              groupData={group}
              batchRelated={allBatches}
              app={app}
            />
            <BatchesList
              batchData={allBatches}
              widgetData={allWidgets} />
          </TraverseWrap>
        );
      }
    }
    /*
    // number that looks like a barcode but such a barcode does not exist
    if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
	    Session.set('nowBatch', orb);
	    return(
	      <div className='dashMainFull'>
          <div className='centre wide space'>
            <p className='big centerText'>{orb} {Pref.noSerial}</p>
            <hr />
            <SearchHelp />
          </div>
        </div>
	      );
	  }
	  */
    
    Session.set('nowBatch', false);
		return (
		  <TraverseWrap>
        <div className='centre wide'>
          <p className='biggest'>¯\_(ツ)_/¯</p>
          <br />
          <SearchHelp />
        </div>
        <div></div>
      </TraverseWrap>
    );
  }
}