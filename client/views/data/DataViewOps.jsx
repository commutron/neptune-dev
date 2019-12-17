import React from 'react';
import Pref from '/client/global/pref.js';

import { TraverseWrap } from '/client/layouts/DataExploreLayout.jsx';

import SearchHelp from './SearchHelp.jsx';

import ExploreLanding from './panels/ExploreLanding.jsx';
import ReportsWrap from './panels/Reports/ReportsWrap.jsx';
import AllGroups from './panels/AllGroups/AllGroups.jsx';
import AllBatches from './panels/AllBatches.jsx';
import AllItems from './panels/AllItems.jsx';
import Calendar from './panels/Calendar.jsx';

import ItemPanel from './panels/ItemPanel.jsx';
import BatchPanel from './panels/BatchPanel/BatchPanel.jsx';
import BatchPanelX from './panels/BatchPanelX.jsx';
import WidgetPanel from './panels/WidgetPanel.jsx';
import VersionPanel from './panels/VersionPanel/VersionPanel.jsx';
import TestFailPanel from './panels/TestFailPanel.jsx';
import ScrapPanel from './panels/ScrapPanel.jsx';

import BatchesList from './lists/BatchesList.jsx';
import ItemsList from './lists/ItemsList.jsx';
// import WidgetsList from './lists/WidgetsList.jsx';

const DataViewOps = ({ 
  allXBatch, allBatch, 
  allGroup, allWidget,
  user, app,
  hotBatch, hotXBatch,
  view, request, specify,
  subLink, orb
})=> {
  
  /*
  lfunction inkedBatch(wId, vKey) {
    return allBatch.find(x => x.widgetId === wId, x => x.versionKey === vKey);
  }
  */
  function allLinkedBatches(wId) {
    const xBatches = allXBatch.filter(x => x.widgetId === wId);
    const legacyBatches = allBatch.filter(x => x.widgetId === wId);
    return [...xBatches, ...legacyBatches ];
  }
  
  function verLinkedBatches(vKey) {
    const xBatches = allXBatch.filter(x => x.versionKey === vKey);
    const legacyBatches = allBatch.filter(x => x.versionKey === vKey);
    return [...xBatches, ...legacyBatches ];
  }
  
  function itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }

  // function getGroup(request) {
  //   return allGroup
  //           .find( x => 
  //             x._id === request || 
  //             x.alias === request || 
  //             x.group === request );
  // }
  
  // function group() {
  //   return allGroup.find(x => x.group === orb);
  // }

  // function groupAlias() {
  //   return allGroup.find(x => x.alias === orb);
  // }
  
  function linkedGroup(gId) {
    return allGroup.find(x => x._id === gId);
  }
  
  function getWidget(request) {
    return allWidget
            .find( x => 
              x._id === request || 
              x.widget === request );
  }
  
  // function widget() {
  //   return allWidget.find(x => x.widget === orb);
  // }
  
  function linkedWidget(wId) {
    return allWidget.find(x => x._id === wId);
  }
  
  function groupWidgets(gId) {
    return allWidget.filter(x => x.groupId === gId);
  }
  
  function versionData(versions, vKeum) {
    return versions.find( x => x.versionKey === vKeum || x.version === vKeum );
  }

 
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
        invertColor={true}
      >
        <ExploreLanding
          batchData={allBatch}
          xBatchData={allXBatch}
          widgetData={allWidget}
          groupData={allGroup} 
          app={app} />
      </TraverseWrap>
    );
  }
    
  if(view === 'calendar') {
    Session.set('nowBatch', false);
    return (
      <TraverseWrap
	      batchData={false}
        widgetData={false}
        versionData={false}
        groupData={false}
        user={user}
        app={app}
        title='Events Calendar'
        subLink={subLink}
        action={false}
        base={true}
        invertColor={true}
      >
        <Calendar
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
        <ReportsWrap
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
          invertColor={true}
        >
          <AllGroups
            batchData={allBatch}
            batchDataX={allXBatch}
            widgetData={allWidget}
            groupData={allGroup} 
            app={app}
            specify={specify} />
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
          invertColor={true}
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
    }else if(request === 'items') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          versionData={false}
          groupData={false}
          user={user}
          app={app}
          title={Pref.items + ' Search'}
          subLink={subLink}
          action={false}
          base={true}
          invertColor={true}
        >
          <AllItems
            batchData={allBatch}
            xBatchData={allXBatch}
            widgetData={allWidget}
            groupData={allGroup} 
            app={app} />
        </TraverseWrap>
      );
    }else if(request === 'testfail') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          versionData={false}
          groupData={false}
          user={user}
          app={app}
          title='Test Fail Overview'
          subLink={subLink}
          action={false}
          beta={true}
          base={true}
          invertColor={true}
        >
          <TestFailPanel batchData={allBatch} app={app} />
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
          invertColor={true}
        >
          <ScrapPanel batchData={allBatch} app={app} />
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
      let item = itemData(hotBatch.items, specify);
      let widget = linkedWidget(hotBatch.widgetId);
      let version = versionData(widget.versions, hotBatch.versionKey);
      let group = linkedGroup(widget.groupId);
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
            //invertColor={true}
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
      let widget = linkedWidget(hotBatch.widgetId);
      let version = versionData(widget.versions, hotBatch.versionKey);
      let group = linkedGroup(widget.groupId);
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
          //invertColor={true}
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
      let widget = linkedWidget(hotXBatch.widgetId);
      let version = versionData(widget.versions, hotXBatch.versionKey);
      let group = linkedGroup(hotXBatch.groupId);
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
          //invertColor={true}
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

// Version  
  if(view === 'widget' && specify) {
    let widget = getWidget(request);
    let version = versionData(widget.versions, specify);
    if(widget && version) {
      Session.set('nowBatch', false);
      let group = linkedGroup(widget.groupId);
      let allWidgets = groupWidgets(widget.groupId);
      let allBatches = verLinkedBatches(version.versionKey);
      return (
        <TraverseWrap
          batchData={false}
          itemData={false}
          widgetData={widget}
          versionData={version}
          groupData={group}
          user={user}
          app={app}
          title='Version'
          subLink={subLink}
          action='version'
          invertColor={true}
        >
          <VersionPanel
            versionData={version}
            widgetData={widget}
            groupData={group}
            batchRelated={allBatches}
            app={app}
            user={user}
          />
          <BatchesList
            batchData={allBatches}
            versionData={version}
            widgetData={allWidgets} />
        </TraverseWrap>
      );
    }
  }
// Widget
  if(view === 'widget') {
    const widget = getWidget(request);
    if(widget) {
      Session.set('nowBatch', false);
      let group = linkedGroup(widget.groupId);
      let allWidgets = groupWidgets(widget.groupId);
      let allBatches = allLinkedBatches(widget._id);
      return(
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
          invertColor={true}
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
	return(
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
};

export default DataViewOps;