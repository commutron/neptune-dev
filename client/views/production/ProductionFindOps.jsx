import React from 'react';
import Pref from '/client/global/pref.js';

import { ProWrap, ProWindow } from '/client/layouts/ProLayout.jsx';

import WikiOps from '../wiki/WikiOps.jsx';
import SearchHelp from './SearchHelp.jsx';

import DoProCard from './cards/DoProCard.jsx';
import XBatchCard from './cards/XBatchCard.jsx';

import BatchesList from './lists/BatchesList.jsx';
import GroupsList from './lists/GroupsList.jsx';
import WidgetsList from './lists/WidgetsList.jsx';

import NPICard from './cards/NPICard.jsx';

const ProductionFindOps = ({ 
  hotBatch, hotxBatch, 
  allBatch, allxBatch,
  allGroup, allWidget, allVariant,
  user, activeUsers, app,
  orb, anchor
})=> {
  
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
  
  function linkedWidget(wId) {
    return allWidget.find(x => x._id === wId);
  }
  
  function groupWidgets(gId) {
    return allWidget.filter(x => x.groupId === gId);
  }
  
  function variantDataByKey(vKey) {
    return allVariant.find(x => x.versionKey === vKey);
  }

  if(!orb) {
    Session.set('nowBatch', false);
    return (
      <ProWindow app={app}>
        <div className='centre wide'>
          <SearchHelp />
        </div>
      </ProWindow>
    );
  }

  // Easter eggs, hidden features or dark patterns \\
  if(orb === '.') {
    Session.set('nowBatch', false);
    return (
      <ProWindow app={app}>
        <div className='centre'>
          <p>the special hell</p>
        </div>
      </ProWindow>
    );
  }
  
  if(orb === Pref.batch || orb === Pref.batch + 's' || orb === Pref.btch) {
    Session.set('nowBatch', false);
    return (
      <ProWrap app={app}>
        <BatchesList 
          batchData={[...allBatch, ...allxBatch]} 
          widgetData={allWidget} />
        <div></div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.group || orb === Pref.group + 's' || orb === Pref.grp) {
    Session.set('nowBatch', false);
    return (
      <ProWrap app={app}>
        <GroupsList 
          groupData={allGroup} 
          batchData={allBatch} 
          widgetData={allWidget} />
        <div></div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.docs || orb === 'docs' || orb === 'd') {
    Session.set('now', Pref.docs);
    Session.set('nowBatch', false);
    return (
      <ProWindow app={app}>
        <WikiOps wi={false} root={app.instruct} anchor={false} full={true} />
      </ProWindow>
    );
  }
  
  if(orb === Pref.npi || orb === Pref.npiFull) {
    Session.set('now', Pref.npiFull);
    Session.set('nowBatch', false);
    return (
      <ProWrap
        user={user}
        app={app}
        action='npiDo'
      >
        <NPICard
          allGroup={allGroup}
          allWidget={allWidget}
          allVariant={allVariant}
          user={user}
          app={app} />
        <WikiOps 
          wi={false} 
          root={app.instruct} 
          anchor={false} />
      </ProWrap>
    );
  }

// Batch
  if(!isNaN(orb) && orb.length === 5) {
    if(hotBatch) {
      let widget = linkedWidget(hotBatch.widgetId);
      let variant= variantDataByKey(hotBatch.versionKey);
      let group = linkedGroup(widget.groupId);
      return (
		    <ProWrap
		      batchData={hotBatch}
		      widgetData={widget}
          user={user}
          app={app}
          action='batchBuild'
          actionBar={true}
        >
          <DoProCard
            batchData={hotBatch}
            widgetData={widget}
            groupData={group}
            user={user}
            app={app} />
          <WikiOps 
            wi={variant.instruct} 
            root={app.instruct} 
            anchor={anchor} />
        </ProWrap>
      );
    }else if(hotxBatch) {
      let widget = linkedWidget(hotxBatch.widgetId);
      let variant = variantDataByKey(hotxBatch.versionKey);
      let group = linkedGroup(hotxBatch.groupId);
      return (
		    <ProWrap
		      batchData={hotxBatch}
		      widgetData={widget}
          user={user}
          app={app}
          action='xBatchBuild'
          actionBar={true}
          // tideLockOut={false}
        >
          <XBatchCard
            batchData={hotxBatch}
            widgetData={widget}
            groupData={group}
            user={user}
            app={app} />
          <WikiOps 
            wi={variant.instruct}
            root={app.instruct}
            anchor={anchor} />
        </ProWrap>
      );
    }
  }
  
// Item
	if( Pref.regexSN.test(orb) ) {
	  //let lookup = batchByItem();
    if(hotBatch) {
      let item = itemData(hotBatch.items, orb);
      let widget = linkedWidget(hotBatch.widgetId);
      let variant= variantDataByKey(hotBatch.versionKey);
      let group = linkedGroup(widget.groupId);
      return (
        <ProWrap
          batchData={hotBatch}
          itemData={item}
          itemSerial={item.serial}
          widgetData={widget}
          user={user}
          users={activeUsers}
          app={app}
          actionBar={true}
        >
          <DoProCard
            batchData={hotBatch}
            itemData={item}
            widgetData={widget}
            groupData={group}
            user={user}
            users={activeUsers}
            app={app} />
          <WikiOps 
            wi={variant.instruct} 
            root={app.instruct}
            anchor={anchor} />
        </ProWrap>
      );
    }
  }

// Group
  if(isNaN(orb)) {
    let alias = groupAlias();
    let lookupG = alias ? alias : false;
    if(lookupG) {
      Session.set('nowBatch', false);
      let widgets = groupWidgets(lookupG._id);
      let activeWidgets = groupActiveWidgets(lookupG._id);
      return (
        <ProWrap
          batchData={false}
          itemData={false}
          groupAlias={lookupG.alias}
          app={app}
        >
          <WidgetsList
            groupAlias={lookupG.alias}
            widgetData={widgets}
            active={activeWidgets} />
          <WikiOps 
            wi={lookupG.wiki} 
            root={app.instruct} 
            anchor={anchor} />
        </ProWrap>
      );
    }
  }
  
  // number that looks like a barcode but such a barcode does not exist
  if(!isNaN(orb) && orb.length > 5 && orb.length <= 14) {
    Session.set('nowBatch', orb);
    return(
      <ProWindow app={app}>
        <div className='centre wide space'>
          <p className='big centerText'>{orb} is not a registered serial number</p>
          <hr />
          <SearchHelp />
        </div>
      </ProWindow>
    );
  }
  
  Session.set('nowBatch', false);
	return (
	  <ProWindow app={app}>
      <div className='centre wide'>
        <p className='biggest'>¯\_(ツ)_/¯</p>
        <br />
        <SearchHelp />
      </div>
    </ProWindow>
  );
};

export default ProductionFindOps;