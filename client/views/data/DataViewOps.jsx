import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import { TraverseWrap } from '/client/layouts/DataExploreLayout.jsx';

import SearchHelp from './SearchHelp.jsx';

import AdvancedSearch from './panels/AdvancedSearch.jsx';
import Reports from './panels/Reports.jsx';
import AllGroups from './panels/AllGroups.jsx';
import AllBatches from './panels/AllBatches.jsx';

import ItemPanel from './panels/ItemPanel.jsx';
import BatchPanel from './panels/BatchPanel/BatchPanel.jsx';
import BatchPanelX from './panels/BatchPanelX.jsx';
import WidgetPanel from './panels/WidgetPanel.jsx';
import GroupPanel from './panels/GroupPanel.jsx';
import ScrapPanel from './panels/ScrapPanel.jsx';

import BatchesList from './lists/BatchesList.jsx';
import ItemsList from './lists/ItemsList.jsx';
import WidgetsList from './lists/WidgetsList.jsx';
/*
view: this.props.view,
request: this.props.request,
specify: this.props.specify
*/

export default class DataViewOps extends Component	{
  
  /*
  linkedBatch(wId, vKey) {
    return this.props.allBatch.find(x => x.widgetId === wId, x => x.versionKey === vKey);
  }
  */
  allLinkedBatches(wId) {
    const xBatches = this.props.allXBatch.filter(x => x.widgetId === wId);
    const legacyBatches = this.props.allBatch.filter(x => x.widgetId === wId);
    return [...xBatches, ...legacyBatches ];
  }
  
  groupActiveWidgets(gId) {
    let widgetsList = this.props.allWidget.filter(x => x.groupId === gId);
    let xActive = this.props.allXBatch.filter( b => b.completed === false);
    let legacyActive = this.props.allBatch.filter( b => b.finishedAt === false);
    const activeBatch = [...xActive, ...legacyActive ];
    
    const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
    let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
    const activeList = Array.from(activeWidgets, w => w._id);
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
    const user = this.props.user;
    const app = this.props.app;
    const allGroup = this.props.allGroup;
    const allWidget = this.props.allWidget;
    const allBatch = this.props.allBatch;
    const allXBatch = this.props.allXBatch;
    const hotBatch = this.props.hotBatch;
    const hotXBatch = this.props.hotXBatch;
    
    const view = this.props.view;
    const request = this.props.request;
    const specify = this.props.specify;
    const subLink = this.props.subLink;
    
    if(!view) {
      Session.set('nowBatch', false);
      return (
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          versionData={false}
          groupData={false}
          user={user}
          app={app}
          title='Explore'
          subLink={subLink}
          action={false}
          base={true}
        >
          <AdvancedSearch
            batchData={allBatch}
            xBatchData={allXBatch}
            widgetData={allWidget}
            groupData={allGroup} 
            app={app} />
        </TraverseWrap>
      );
    }
    
    if(view === 'reports') {
      Session.set('nowBatch', false);
      return (
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          versionData={false}
          groupData={false}
          user={user}
          app={app}
          title='Reports'
          subLink={subLink}
          action={false}
          base={true}
          invertColor={true}
        >
          <Reports
            batchData={allBatch}
            widgetData={allWidget}
            groupData={allGroup} 
            app={app} />
        </TraverseWrap>
      );
    }
    
    if(view === 'overview') {
      Session.set('nowBatch', false);
      if(request === 'groups') {
        return(
          <TraverseWrap
			      batchData={false}
            widgetData={false}
            versionData={false}
            groupData={false}
            user={user}
            app={app}
            title={Pref.groups + ' Overview'}
            subLink={subLink}
            action='newGroup'
            base={true}
          >
            <AllGroups
              batchData={allBatch}
              batchDataX={allXBatch}
              widgetData={allWidget}
              groupData={allGroup} 
              app={app} />
          </TraverseWrap>
        );
      }else if(request === 'batches') {
        return(
          <TraverseWrap
			      batchData={false}
            widgetData={false}
            versionData={false}
            groupData={false}
            user={user}
            app={app}
            title={Pref.batches + ' Overview'}
            subLink={subLink}
            action={false}
            base={true}
          >
            <AllBatches
              batchData={allBatch}
              widgetData={allWidget}
              groupData={allGroup}
              allWidget={allWidget}
              allBatch={allBatch}
              allXBatch={allXBatch}
              app={app} />
          </TraverseWrap>
        );
      }else if(request === 'scraps') {
        return(
          <TraverseWrap
  		      batchData={false}
            widgetData={false}
            versionData={false}
            groupData={false}
            user={user}
            app={app}
            title='Scraps Overview'
            subLink={subLink}
            action={false}
            base={true}
          >
            <ScrapPanel batchData={allBatch} />
          </TraverseWrap>
        );
      }else{
        return(
          <TraverseWrap
  		      batchData={false}
            widgetData={false}
            versionData={false}
            groupData={false}
            user={user}
            app={app}
            title=''
            subLink={subLink}
            action={false}
            base={true}
          >
            <div className='centre'>
              <p>remember the cant</p>
            </div>
          </TraverseWrap>
        );
      }
    }
    
  // Item
		if(view === 'batch' && specify) {
      if(hotBatch) {
        let item = this.itemData(hotBatch.items, specify);
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        if(item && widget && version && group) {
          return (
            <TraverseWrap
              batchData={hotBatch}
              itemData={item}
              widgetData={widget}
              versionData={version}
              groupData={group}
              user={user}
              app={app}
              title='Item'
              subLink={subLink}
              action='item'
            >
              <ItemPanel
                batchData={hotBatch}
                itemData={item}
                widgetData={widget}
                versionData={version}
                groupData={group}
                app={app}
                user={user}
                listTitle={true} />
              <ItemsList
                batchData={hotBatch}
                widgetData={widget}
                tide={orb} />
            </TraverseWrap>
          );
        }else{
          return(
            <TraverseWrap
    		      batchData={false}
              widgetData={false}
              versionData={false}
              groupData={false}
              user={user}
              app={app}
              title='!!!'
              subLink={subLink}
              action={false}
              base={true}
            >
              <div className='centre wide'>
                <p className='big'>Data Does Not Exist</p>
              </div>
              <div></div>
            </TraverseWrap>
          );
        }
      }
    }

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
            user={user}
            app={app}
            title='Batch'
            subLink={subLink}
            action='batch'
          >
            <BatchPanel
              batchData={hotBatch}
              widgetData={widget}
              versionData={version}
              groupData={group} 
              app={app}
              user={user} />
            <ItemsList
			        batchData={hotBatch}
			        widgetData={widget}
			        tide={orb} />
          </TraverseWrap>
        );
      }else if(hotXBatch) {
        let widget = this.linkedWidget(hotXBatch.widgetId);
        let version = this.versionData(widget.versions, hotXBatch.versionKey);
        let group = this.linkedGroup(hotXBatch.groupId);
        return (
			    <TraverseWrap
			      batchData={hotXBatch}
            widgetData={widget}
            versionData={version}
            groupData={group}
            user={user}
            app={app}
            title='Batch+'
            subLink={subLink}
            action='xbatch'
          >
            <BatchPanelX
              batchData={hotXBatch}
              widgetData={widget}
              versionData={version}
              groupData={group} 
              app={app}
              user={user} />
            <div>no items</div>
          </TraverseWrap>
        );
      }
    }

  // Group
    if(view === 'group') {
      const group = this.getGroup(request);
      if(group) {
        let widgets = this.groupWidgets(group._id);
        let activeWidgets = this.groupActiveWidgets(group._id);
        return (
          <TraverseWrap
            batchData={false}
            itemData={false}
            widgetData={false}
            versionData={false}
            groupData={group}
            user={user}
            app={app}
            title='Group'
            subLink={subLink}
            action='group'
            base={false}
          >
            <GroupPanel
              groupData={group}
              widgetData={widgets}
              active={activeWidgets}
              app={app} 
              user={user} />
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
            user={user}
            app={app}
            title='Widget'
            subLink={subLink}
            action='widget'
          >
            <WidgetPanel
              widgetData={widget}
              groupData={group}
              batchRelated={allBatches}
              app={app}
              user={user}
            />
            <BatchesList
              batchData={allBatches}
              widgetData={allWidgets} />
          </TraverseWrap>
        );
      }
    }
    
    Session.set('nowBatch', false);
		return (
		  <TraverseWrap
	      batchData={false}
        widgetData={false}
        versionData={false}
        groupData={false}
        user={user}
        app={app}
        title='???'
        subLink={subLink}
        action={false}
        base={true}
      >
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