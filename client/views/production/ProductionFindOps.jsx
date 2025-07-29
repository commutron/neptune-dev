import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';

import { ProWrap, ProWindow } from '/client/layouts/ProLayout';

import WikiOps from '../wiki/WikiOps';
import QuickRecent from './QuickRecent';
import SearchHelp from './SearchHelp';

import XDoProCard from './cards/XDoProCard';
import PartialCard from './cards/PartialCard';
import EquipCard from './cards/EquipCard';
import MultiCard from './cards/MultiCard';
import InlineNewSerial from './cards/NewInlineSerial';
import ServiceCard, { RepairCard } from './cards/ServiceCard';

import BatchesList from './lists/BatchesList';
import GroupsList from './lists/GroupsList';
import WidgetsList from './lists/WidgetsList';

const ProductionFindOps = ({ 
  hotxBatch, hotxSeries, hotxRapids,
  allxBatch,
  allGroup, allWidget, allVariant,
  user, time, app, canMulti, canSerial,
  activeUsers, plainBatchS, brancheS, 
  allEquip, allMaint,
  orb, eqS, anchor
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
  
  function linkedWidget(wId) {
    return allWidget.find(x => x._id === wId);
  }
  
  function groupWidgets(gId) {
    return allWidget.filter(x => x.groupId === gId);
  }
  
  function variantDataByKey(vKey) {
    return allVariant.find(x => x.versionKey === vKey);
  }

  function equipDataById() {
    return allEquip.find(x => x._id === eqS);
  }
  
  function maintDataById() {
    return allMaint.find(x => x._id === eqS);
  }
  
  function linkedEquip(equipId) {
    return allEquip.find(x => x._id === equipId);
  }
  
  if(!orb) {
    Session.set('nowBatch', false);
    return (
      <ProWindow 
        brancheS={brancheS} 
        plainBatchS={plainBatchS}
        user={user}
        canMulti={canMulti}
        allEquip={allEquip}
      >
        <QuickCards
          orbslice={orb}
          canMulti={canMulti}
          canSerial={canSerial}
          user={user}
          allEquip={allEquip}
          allMaint={allMaint}
        />
      </ProWindow>
    );
  }
  
  if(orb === Pref.batch || orb === Pref.batch + 's') {
    Session.set('nowBatch', false);
    Session.set('nowInstruct', undefined);
    return (
      <ProWrap 
        app={app} 
        brancheS={brancheS}
        plainBatchS={plainBatchS}
        canMulti={canMulti}>
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
      <ProWrap 
        app={app}
        brancheS={brancheS}
        plainBatchS={plainBatchS} 
        canMulti={canMulti}>
        <GroupsList 
          groupData={allGroup} 
          batchData={allxBatch} 
          widgetData={allWidget} />
        <div></div>
      </ProWrap>
    );
  }
  
  if(orb === Pref.docs.toLowerCase() || orb === 'docs') {
    Session.set('now', Pref.docs.toLowerCase());
    Session.set('nowBatch', false);
    Session.set('nowInstruct', undefined);
    return (
      <ProWindow 
        brancheS={brancheS} 
        plainBatchS={plainBatchS}
        allEquip={allEquip}
        user={user}
        canMulti={canMulti}
      >
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
      Session.set('nowInstruct', variant.instruct);
      return (
		    <ProWrap
		      batchData={hotxBatch}
		      seriesData={hotxSeries}
		      widgetData={widget}
		      radioactive={variant.radioactive}
          user={user}
          time={time}
          app={app}
          brancheS={brancheS}
          plainBatchS={plainBatchS} 
          canMulti={canMulti}
          action='xBatchBuild'
        >
          <XDoProCard
            batchData={hotxBatch}
            seriesData={hotxSeries}
            rapidsData={hotxRapids}
            widgetData={widget}
            user={user}
            brancheS={brancheS}
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
	  console.log('valid serial format');
	  
    if(hotxSeries) {
      let item = itemData(hotxSeries.items, orb);
      let widget = linkedWidget(hotxSeries.widgetId);
      let variant= variantDataByKey(hotxSeries.versionKey);
      Session.set('nowInstruct', variant.instruct);
      return (
        <ProWrap
          batchData={hotxBatch}
          seriesData={hotxSeries}
          rapidsData={hotxRapids}
          itemData={item}
          itemSerial={item.serial}
          widgetData={widget}
          radioactive={variant.radioactive}
          user={user}
          time={time}
          users={activeUsers}
          app={app}
          brancheS={brancheS}
          plainBatchS={plainBatchS}
          canMulti={canMulti}
          action='xItemBuild'
        >
          <XDoProCard
            batchData={hotxBatch}
            seriesData={hotxSeries}
            rapidsData={hotxRapids}
            itemData={item}
            widgetData={widget}
            user={user}
            users={activeUsers}
            brancheS={brancheS}
            app={app} />
          <WikiOps
            root={app.instruct}
            anchor={anchor} />
        </ProWrap>
      );
    }else{
      console.log('Would You like to create this??');
      return(
        <ProWindow 
          brancheS={brancheS} 
          plainBatchS={plainBatchS} 
          user={user}
          canMulti={canMulti}
          allEquip={allEquip}
        >
          <QuickCards
            gem={orb}
            orbslice={orb}
            canMulti={canMulti}
            canSerial={canSerial}
            user={user}
            allEquip={allEquip}
            allMaint={allMaint}
          />
        </ProWindow>
      );
    }
  }

// Equipment
  if(orb?.startsWith('EqFx')) {
    const eqData = equipDataById();
    if(eqData) {
      Session.set('nowBatch', false);
      Session.set('nowInstruct', eqData?.library);
      return (
        <ProWrap
          batchData={false}
          itemData={false}
          user={user}
          time={time}
          users={activeUsers}
          app={app}
          brancheS={brancheS}
          plainBatchS={plainBatchS} 
          canMulti={canMulti}
          defaultWide={true}
          eqAlias={eqData.alias}
          equipId={eqData._id}
        >
          <RepairCard
            eqData={eqData}
            brancheS={brancheS}
          />
          <WikiOps 
            root={app.instruct} 
            anchor={anchor} />
        </ProWrap>
      );
    }
  }
// Maintain
  if(orb?.startsWith('Eq')) {
    const maintData = maintDataById();
    if(maintData) {
      const eqData = linkedEquip(maintData.equipId);
      Session.set('nowBatch', false);
      Session.set('nowInstruct', eqData?.instruct);
      return (
        <ProWrap
          batchData={false}
          itemData={false}
          user={user}
          time={time}
          users={activeUsers}
          app={app}
          brancheS={brancheS}
          plainBatchS={plainBatchS} 
          canMulti={canMulti}
          defaultWide={true}
          eqAlias={eqData.alias}
          maintId={maintData._id}
        >
          <ServiceCard
            eqData={eqData}
            maintData={maintData}
            brancheS={brancheS}
          />
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
          brancheS={brancheS}
          plainBatchS={plainBatchS} 
          canMulti={canMulti}
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
    console.log('Number Greater Than 5');
    
    return(
      <ProWindow 
        brancheS={brancheS} 
        plainBatchS={plainBatchS} 
        user={user}
        canMulti={canMulti}
        allEquip={allEquip}
      >
        <QuickCards
          orbslice={orb}
          canMulti={canMulti}
          canSerial={canSerial}
          user={user}
          allEquip={allEquip}
          allMaint={allMaint}
        />
      </ProWindow>
    );
  }
  Session.set('nowBatch', false);
	return(
	  <ProWindow 
	    brancheS={brancheS} 
	    plainBatchS={plainBatchS}
	    allEquip={allEquip}
	    user={user}
	    canMulti={canMulti}
	   >
	    <div className='centreText wide'>
        <i className='biggest'>¯\_(ツ)_/¯</i><br />
        <n-sm>No Match</n-sm>
      </div>
      <QuickCards
        orbslice={orb}
        canMulti={canMulti}
        canSerial={canSerial}
        user={user}
        allEquip={allEquip}
        allMaint={allMaint}
      />
    </ProWindow>
  );
};

export default ProductionFindOps;

const QuickCards = ({ gem, orbslice, canMulti, canSerial, user, allEquip, allMaint })=> (
  <div className='scrollWrap forceScrollStyle' style={{height: '100%', minHeight: '100%'}}>
    {orbslice && <PartialCard orb={orbslice} /> }
    {user.engaged && <ClockedCard user={user} />}
    {gem && <InlineNewSerial canSerial={canSerial} gem={gem} user={user} /> }
    <div className='balancer gapsR gapsC wide space'>
      <QuickRecent user={user} />
      {canMulti && <MultiCard />}
      <EquipCard equipData={allEquip} maintainData={allMaint} />
      <SearchHelp />
    </div>
  </div>
);

const ClockedCard = ({ user })=> {
// engaged
// tKey:"Hu8Kqhwu3sghXYbnT"
// tName:"22007"
// tSubt
// tTask
// task:"PROX"
  
  const eng = user.engaged.tName;
  const title = eng.startsWith('Eq') ? eng.split("<*>")[0].substring(eng.indexOf("-")+1) : eng;

  return(
    <div className='centre pop wmargin vmargin spacehalf min200 max400 darkCard nGlow'>
      {user.engaged ?
        <div className='centre centreText cap'>
          <span className='biggester numFont'>{title}</span>
          <span className='letterSpaced' style={{fontWeight: 'lighter'}}>{user.engaged.tTask}, {user.engaged.tSubt}</span>  
        </div> 
      : null}
    </div>
  );
};