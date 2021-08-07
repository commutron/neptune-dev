import React from 'react';
import Pref from '/client/global/pref.js';

import { ProWrap, ProWindow } from '/client/layouts/ProLayout';

import WikiOps from '../wiki/WikiOps';
import SearchHelp from './SearchHelp';

import XDoProCard from './cards/XDoProCard';
import PartialCard from './cards/PartialCard';

import BatchesList from './lists/BatchesList';
import GroupsList from './lists/GroupsList';
import WidgetsList from './lists/WidgetsList';

const ProductionFindOps = ({ 
  hotxBatch, hotxSeries, hotxRapids,
  allxBatch,
  allGroup, allWidget, allVariant,
  user, activeUsers, app,
  orb, anchor
})=> {
  
  function groupActiveWidgets(gId) {
    let widgetsList = allWidget.filter(x => x.groupId === gId);
    let xActive = allxBatch.filter( b => b.completed === false);
    const activeBatch = xActive;
    
    const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
    let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
    const activeList = Array.from(activeWidgets, w => w._id);
    return activeList;
  }
  
  function itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }

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
  
  if(orb === Pref.batch || orb === Pref.batch + 's') {
    Session.set('nowBatch', false);
    Session.set('nowInstruct', undefined);
    return (
      <ProWrap app={app}>
        <BatchesList 
          batchData={allxBatch} 
          widgetData={allWidget} />
        <div></div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.group || orb === Pref.group + 's') {
    Session.set('nowBatch', false);
    Session.set('nowInstruct', undefined);
    return (
      <ProWrap app={app}>
        <GroupsList 
          groupData={allGroup} 
          batchData={allxBatch} 
          widgetData={allWidget} />
        <div></div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.docs || orb === 'docs') {
    Session.set('now', Pref.docs);
    Session.set('nowBatch', false);
    Session.set('nowInstruct', undefined);
    return (
      <ProWindow app={app}>
        <WikiOps 
          root={app.instruct} 
          anchor={false} 
          full={true} />
      </ProWindow>
    );
  }

// Batch
  if( Pref.regex5.test(orb) ) {
    if(hotxBatch) {
      let widget = linkedWidget(hotxBatch.widgetId);
      let variant = variantDataByKey(hotxBatch.versionKey);
      let group = linkedGroup(hotxBatch.groupId);
      Session.set('nowInstruct', variant.instruct);
      return (
		    <ProWrap
		      batchData={hotxBatch}
		      seriesData={hotxSeries}
		      widgetData={widget}
          user={user}
          app={app}
          action='xBatchBuild'
        >
          <XDoProCard
            batchData={hotxBatch}
            seriesData={hotxSeries}
            rapidsData={hotxRapids}
            widgetData={widget}
            groupData={group}
            user={user}
            app={app} />
          <WikiOps 
            root={app.instruct}
            anchor={anchor} />
        </ProWrap>
      );
    }
  }
  
// Item
	if( Pref.regexSN.test(orb) ) {
    if(hotxSeries) {
      let item = itemData(hotxSeries.items, orb);
      let widget = linkedWidget(hotxSeries.widgetId);
      let variant= variantDataByKey(hotxSeries.versionKey);
      let group = linkedGroup(hotxSeries.groupId);
      Session.set('nowInstruct', variant.instruct);
      return (
        <ProWrap
          batchData={hotxBatch}
          seriesData={hotxSeries}
          rapidsData={hotxRapids}
          itemData={item}
          itemSerial={item.serial}
          widgetData={widget}
          user={user}
          users={activeUsers}
          app={app}
          action='xItemBuild'
        >
          <XDoProCard
            batchData={hotxBatch}
            seriesData={hotxSeries}
            rapidsData={hotxRapids}
            itemData={item}
            widgetData={widget}
            groupData={group}
            user={user}
            users={activeUsers}
            app={app} />
          <WikiOps
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
      Session.set('nowInstruct', lookupG.wiki);
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
            root={app.instruct} 
            anchor={anchor} />
        </ProWrap>
      );
    }
  }
  
  if(!isNaN(orb) && orb.length >= 5) {
    Session.set('nowBatch', orb);
    return(
      <ProWindow app={app}>
        <div className='centre wide space'>
          <PartialCard orb={orb} />
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