import React from 'react';
import Pref from '/client/global/pref.js';

import { ProWrap } from '/client/layouts/ProLayout.jsx';

import WikiOps from '../wiki/WikiOps.jsx';
import SearchHelp from './SearchHelp.jsx';

import ItemCard from './cards/ItemCard.jsx';
import BatchCard from './cards/BatchCard.jsx';
import XBatchCard from './cards/XBatchCard.jsx';
//import WidgetCard from './cards/WidgetCard.jsx';

import BatchesList from './lists/BatchesList.jsx';
import GroupsList from './lists/GroupsList.jsx';
import WidgetsList from './lists/WidgetsList.jsx';

const ProductionFindOps = ({ 
  hotBatch, hotxBatch, 
  allBatch, allxBatch,
  allWidget, allGroup,
  user, activeUsers, app,
  orb, anchor
})=> {
  
  // function linkedBatch(wId, vKey) {
  //   return allBatch.find(x => x.widgetId === wId, x => x.versionKey === vKey);
  // }
  
  // function allLinkedBatches(wId) {
  //   return allBatch.filter(x => x.widgetId === wId);
  // }
  
  function groupActiveWidgets(gId) {
    let widgetsList = allWidget.filter(x => x.groupId === gId);
    let xActive = allxBatch.filter( b => b.completed === false);
    let legacyActive = allBatch.filter( b => b.finishedAt === false);
    const activeBatch = [...xActive, ...legacyActive ];
    
    const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
    let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
    const activeList = Array.from(activeWidgets, w => w._id);
    return activeList;
  }
  
  function itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }

  // function group() {
  //  return allGroup.find(x => x.group === orb);
  // }
  
  function groupAlias() {
    return allGroup.find(x => x.alias === orb);
  }
  
  function linkedGroup(gId) {
    return allGroup.find(x => x._id === gId);
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
  
  function versionData(versions, vKey) {
    return versions.find(x => x.versionKey === vKey);
  }

  if(!orb) {
    Session.set('nowBatch', false);
    return (
      <ProWrap standAlone={true} app={app}>
        <div className='centre wide'>
          <SearchHelp />
        </div>
      </ProWrap>
    );
  }

  // Easter eggs, hidden features or dark patterns \\
  if(orb === '.') {
    Session.set('nowBatch', false);
    return (
      <ProWrap standAlone={true} app={app}>
        <div className='centre'>
          <p>the special hell</p>
          {/*<img src='/titleLogo.svg' className='shadow noCopy' height='600' />*/}
        </div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.batch || orb === Pref.batch + 's' || orb === Pref.btch) {
    Session.set('nowBatch', false);
    return (
      <ProWrap app={app}>
        <BatchesList batchData={[...allBatch, ...allxBatch]} widgetData={allWidget} />
        <div></div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.group || orb === Pref.group + 's' || orb === Pref.grp) {
    Session.set('nowBatch', false);
    return (
      <ProWrap app={app}>
        <GroupsList groupData={allGroup} batchData={allBatch} widgetData={allWidget} />
        <div></div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.docs || orb === 'docs' || orb === 'd') {
    Session.set('now', Pref.docs);
    Session.set('nowBatch', false);
    return (
      <ProWrap standAlone={true} app={app}>
        <WikiOps wi={false} root={app.instruct} anchor={false} full={true} />
      </ProWrap>
    );
  }

// Batch
  if(!isNaN(orb) && orb.length === 5) {
    if(hotBatch) {
      let widget = linkedWidget(hotBatch.widgetId);
      let version = versionData(widget.versions, hotBatch.versionKey);
      let group = linkedGroup(widget.groupId);
      return (
		    <ProWrap
		      batchData={hotBatch}
		      widgetData={widget}
          versionData={version}
          user={user}
          app={app}
          action='batchBuild'
          actionBar={true}
        >
          <BatchCard
            batchData={hotBatch}
            widgetData={widget}
            versionData={version}
            groupData={group}
            user={user}
            app={app} />
          <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
        </ProWrap>
      );
    }else if(hotxBatch) {
      let widget = linkedWidget(hotxBatch.widgetId);
      let version = versionData(widget.versions, hotxBatch.versionKey);
      let group = linkedGroup(hotxBatch.groupId);
      return (
		    <ProWrap
		      batchData={hotxBatch}
		      widgetData={widget}
          versionData={version}
          user={user}
          app={app}
          action='xBatchBuild'
          actionBar={true}
          tideLockOut={true}
        >
          <XBatchCard
            batchData={hotxBatch}
            widgetData={widget}
            versionData={version}
            groupData={group}
            user={user}
            app={app} />
          <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
        </ProWrap>
      );
    }
  }
  
// Item
  ////// will need to be changed?? for alphnumeric barcodes such as with TGS
	if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
	  //let lookup = batchByItem();
    if(hotBatch) {
      let item = itemData(hotBatch.items, orb);
      let widget = linkedWidget(hotBatch.widgetId);
      let version = versionData(widget.versions, hotBatch.versionKey);
      let group = linkedGroup(widget.groupId);
      return (
        <ProWrap
          batchData={hotBatch}
          itemData={item}
          itemSerial={item.serial}
          widgetData={widget}
          versionData={version}
          user={user}
          users={activeUsers}
          app={app}
          actionBar={true}
        >
          <ItemCard
            batchData={hotBatch}
            itemData={item}
            widgetData={widget}
            users={activeUsers}
            app={app} />
          <BatchCard
            batchData={hotBatch}
            itemSerial={item.serial}
            widgetData={widget}
            versionData={version}
            groupData={group}
            user={user}
            app={app} />
          <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
        </ProWrap>
      );
    }
  }

// Group
  if(isNaN(orb)) {
    let alias = groupAlias();
    let lookup = alias ? alias : false;
    if(lookup) {
      Session.set('nowBatch', false);
      let widgets = groupWidgets(lookup._id);
      let activeWidgets = groupActiveWidgets(lookup._id);
      return (
        <ProWrap
          batchData={false}
          itemData={false}
          versionData={false}
          groupAlias={lookup.alias}
          app={app}
        >
          <WidgetsList
            groupAlias={lookup.alias}
            widgetData={widgets}
            active={activeWidgets} />
          <WikiOps wi={lookup.wiki} root={app.instruct} anchor={anchor} />
        </ProWrap>
      );
    }
  }
  
  // number that looks like a barcode but such a barcode does not exist
  if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
    Session.set('nowBatch', orb);
    return(
      <ProWrap standAlone={true} app={app}>
        <div className='centre wide space'>
          <p className='big centerText'>{orb} is not a registered serial number</p>
          <hr />
          <SearchHelp />
        </div>
      </ProWrap>
    );
  }
  
  Session.set('nowBatch', false);
	return (
	  <ProWrap standAlone={true} app={app}>
      <div className='centre wide'>
        <p className='biggest'>¯\_(ツ)_/¯</p>
        <br />
        <SearchHelp />
      </div>
    </ProWrap>
  );
};

export default ProductionFindOps;