import React from 'react';

import Pref from '/client/global/pref.js';

import { TraverseWrap } from '/client/layouts/DataExploreLayout.jsx';

import SearchHelp from './SearchHelp.jsx';

import ExploreLanding from './panels/ExploreLanding.jsx';
import ReportsWrap from './panels/Reports/ReportsWrap.jsx';
import AllGroups from './panels/AllGroups/AllGroups.jsx';

import BuildHistory from './panels/BuildHistory.jsx';

import ItemPanelX from './panels/ItemPanelX';
import BatchPanelX from './panels/XBatchPanel/BatchPanelX.jsx';
import WidgetPanel from './panels/WidgetPanel/WidgetPanel';
import RapidsPanel from './panels/RapidsPanel';
import RextendPanel from './panels/RextendPanel';
import TestFailPanel from './panels/TestFailPanel';
import TestFailComparePanel from './panels/TestFailComparePanel';

import ScrapPanel from './panels/ScrapPanel';

import BatchesList from './lists/BatchesList';
import ItemsListX from './lists/ItemsListX';

import FlowCounter, { FallCounter, WhiteWaterCounter } from '/client/utility/ProgressCounterX';
import { NonConMerge } from '/client/utility/NonConOptions';


const DataViewOps = ({ 
  allXBatch, 
  allGroup, allWidget, allVariant,
  user, isDebug, app, brancheS, users,
  hotXBatch, hotXSeries, hotXRapids,
  view, request, specify,
  subLink, orb
})=> {
  
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  
  function allLinkedBatches(wId) {
    const xBatches = allXBatch.filter(x => x.widgetId === wId);
    return xBatches;
  }
  
  function itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }
  
  function linkedGroup(gId) {
    return allGroup.find(x => x._id === gId);
  }
  
  function getWidget(request) {
    return allWidget.find( x => x._id === request || x.widget === request );
  }
  function linkedWidget(wId) {
    return allWidget.find(x => x._id === wId);
  }
  
  function linkedVariantKey(vKey) {
    return allVariant.find(x => x.versionKey === vKey);
  }
  
  function groupWidgets(gId) {
    return allWidget.filter(x => x.groupId === gId);
  }
  
  function widgetVariants(wId) {
    return allVariant.filter(x => x.widgetId === wId);
  }
  
  function getFlowData(batchData, seriesData, widgetData, appData) {
    let riverTitle = 'unset';
    let riverFlow = [];
    
    let ncListKeys = [];
    let ncTypesComboFlat = [];
    let flowCounts = false;
    
    const itemS = seriesData && seriesData.items.sort( (x,y)=> x.serial - y.serial);
    const srange = itemS && itemS.length > 0 ?
                  `${itemS[0].serial} - ${itemS[itemS.length-1].serial}` : null;
                  
    const getRiverFirst = (w, bx)=> {
      return new Promise(function(resolve) {
        if( w && bx ) {
          const river = w.flows.find( x => x.flowKey === bx.river);
          if(river) {
            riverTitle = river.title;
            riverFlow = river.flow;
            river.type === 'plus' && ncListKeys.push(river.ncLists);
          }
        }
        resolve('Success');
      });
    };
    
    const generateSecond = (srs)=> {
      flowCounts = FlowCounter(riverFlow, srs);
      
      ncTypesComboFlat = NonConMerge(ncListKeys, appData, user, true);
    };

    getRiverFirst(widgetData, batchData)
      .then(generateSecond(seriesData));
      

    return {
      riverTitle, riverFlow, srange,
      ncTypesComboFlat, flowCounts
    };
  }
  
  function getFallData(batchData, appData) {
    if( batchData && appData ) {
    
      const fallCounts = FallCounter(batchData, appData);
     
      return fallCounts;
    }
  }
  
  function getRapidData(batchData, seriesData, rapidsData) {
    if( batchData, rapidsData ) {
      let calcRapids = [];
      for(let rapid of rapidsData) {
        const rapidCount = WhiteWaterCounter(rapid, seriesData);
        rapid.rSet = rapidCount[0];
        rapid.rDone = rapidCount[1];
        calcRapids.push( rapid );
      }
      return calcRapids;
    }else{
      return null;
    }
  }
 
  if(!view) {
    // Session.set('nowBatch', false);
    return (
      <TraverseWrap
	      batchData={false}
        widgetData={false}
        variantData={false}
        groupData={false}
        user={user}
        app={app}
        title='Explore'
        subLink={subLink}
        action={false}
        base={true}
      >
        <ExploreLanding
          xBatchData={allXBatch}
          widgetData={allWidget}
          variantData={allVariant}
          groupData={allGroup} 
          app={app}
          isDebug={isDebug} />
      </TraverseWrap>
    );
  }
  
  if(view === 'buildHistory') {
    // Session.set('nowBatch', false);
    return (
      <TraverseWrap
	      batchData={false}
        widgetData={false}
        variantData={false}
        groupData={false}
        user={user}
        app={app}
        title='Build History'
        subLink={subLink}
        action={false}
        base={true}
      >
        <BuildHistory
          allXBatch={allXBatch}
          allVariant={allVariant}
          allWidget={allWidget}
          allGroup={allGroup} 
          app={app} />
      </TraverseWrap>
    );
  }   
      
  if(view === 'reports') {
    // Session.set('nowBatch', false);
    return (
      <TraverseWrap
	      batchData={false}
        widgetData={false}
        variantData={false}
        groupData={false}
        user={user}
        app={app}
        title='Reports'
        subLink={subLink}
        action={false}
        base={true}
      >
        <ReportsWrap
          allXBatch={allXBatch}
          allWidget={allWidget}
          allVariant={allVariant}
          allGroup={allGroup} 
          app={app}
          isDebug={isDebug}
          isNightly={isNightly} />
      </TraverseWrap>
    );
  }
    
  if(view === 'overview') {
    // Session.set('nowBatch', false);
    if(request === 'groups') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          variantData={false}
          groupData={false}
          user={user}
          app={app}
          title={Pref.groups}
          subLink={subLink}
          action='newGroup'
          base={true}
        >
          <AllGroups
            batchDataX={allXBatch}
            widgetData={allWidget}
            variantData={allVariant}
            groupData={allGroup} 
            app={app}
            specify={specify} />
        </TraverseWrap>
      );
    }else if(request === 'rapid') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          variantData={false}
          groupData={false}
          user={user}
          app={app}
          title='Rapids Free'
          subLink={subLink}
          action={false}
          base={true}
        >
          <RapidsPanel
            app={app} />
        </TraverseWrap>
      );
    // }else if(request === 'trends') {
    //   return(
    //     <TraverseWrap
		  //     batchData={false}
    //       widgetData={false}
    //       variantData={false}
    //       groupData={false}
    //       user={user}
    //       app={app}
    //       title={Pref.batches}
    //       subLink={subLink}
    //       action={false}
    //       base={true}
    //     >
    //       <AllBatches
    //         batchData={allXBatch}
    //         widgetData={allWidget}
    //         groupData={allGroup}
    //         allWidget={allWidget}
    //         allVariant={allVariant}
    //         allXBatch={allXBatch}
    //         app={app}
    //         isDebug={isDebug} />
    //     </TraverseWrap>
    //   );
    }else if(request === 'rapidex') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          variantData={false}
          groupData={false}
          user={user}
          app={app}
          title={`${Pref.rapidExd} ${Pref.xBatchs}`}
          subLink={subLink}
          action={false}
          base={true}
        >
          <RextendPanel
            app={app} />
        </TraverseWrap>
      );
    }else if(request === 'testfail') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          variantData={false}
          groupData={false}
          user={user}
          app={app}
          title='Tests Failed'
          subLink={subLink}
          action={false}
          base={true}
        >
          <TestFailPanel 
            batchData={allXBatch} 
            app={app} />
        </TraverseWrap>
      );
    }else if(request === 'testfail2') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          variantData={false}
          groupData={false}
          user={user}
          app={app}
          title='Tests Failed'
          subLink={subLink}
          action={false}
          base={true}
        >
          <TestFailComparePanel 
            batchData={allXBatch} 
            app={app} />
        </TraverseWrap>
      );  
    }else if(request === 'scraps') {
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          variantData={false}
          groupData={false}
          user={user}
          app={app}
          title='Scraps'
          subLink={subLink}
          action={false}
          base={true}
        >
          <ScrapPanel 
            batchData={allXBatch} 
            app={app} />
        </TraverseWrap>
      );
    }else{
      return(
        <TraverseWrap
		      batchData={false}
          widgetData={false}
          variantData={false}
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
    if(hotXSeries) {
      let item = itemData(hotXSeries.items, specify);
      let widget = linkedWidget(hotXSeries.widgetId);
      let variant = linkedVariantKey(hotXSeries.versionKey);
      let group = linkedGroup(hotXSeries.groupId);
                     
      let flowData = getFlowData(hotXBatch, hotXSeries, widget, app);
      let fallData = getFallData(hotXBatch, app);
      let rapXData = getRapidData(hotXBatch, hotXSeries, hotXRapids);
      
      if(item && widget && variant && group) {
        return(
          <TraverseWrap
            batchData={hotXBatch}
            seriesData={hotXSeries}
            itemData={item}
            widgetData={widget}
            variantData={variant}
            groupData={group}
            user={user}
            app={app}
            title='Item'
            subLink={subLink}
            action='xitem'
          >
            <ItemPanelX
              batchData={hotXBatch}
              seriesData={hotXSeries}
              rapidsData={rapXData}
              itemData={item}
              widgetData={widget}
              variantData={variant}
              groupData={group}
              app={app}
              brancheS={brancheS}
              user={user}
              listTitle={true}
              flowData={flowData}
              fallData={fallData} />
            <ItemsListX
              seriesData={hotXSeries}
              batchData={hotXBatch}
              widgetData={widget}
              flowData={flowData}
              fallData={fallData}
              orb={orb}
              isDebug={isDebug} />
          </TraverseWrap>
        );
      }else{
        return(
          <TraverseWrap
  		      batchData={false}
            widgetData={false}
            variantData={false}
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
    if(hotXBatch) {
      let widget = linkedWidget(hotXBatch.widgetId);
      let variant = linkedVariantKey(hotXBatch.versionKey);
      let allVariants = widgetVariants(hotXBatch.widgetId);
      let group = linkedGroup(hotXBatch.groupId);
      
      let flowData = getFlowData(hotXBatch, hotXSeries, widget, app);
      let fallData = getFallData(hotXBatch, app);
      let rapXData = getRapidData(hotXBatch, hotXSeries, hotXRapids);
      
      return(
		    <TraverseWrap
		      batchData={hotXBatch}
          seriesData={hotXSeries}
          flowData={flowData}
          widgetData={widget}
          variantData={variant}
          allVariants={allVariants}
          groupData={group}
          user={user}
          app={app}
          title='Batch+'
          subLink={subLink}
          action='xbatch'
        >
          <BatchPanelX
            batchData={hotXBatch}
            seriesData={hotXSeries}
            rapidsData={rapXData}
            widgetData={widget}
            variantData={variant}
            groupData={group}
            flowData={flowData}
            fallData={fallData}
            app={app}
            user={user}
            isDebug={isDebug} />
          <ItemsListX
            seriesData={hotXSeries}
		        batchData={hotXBatch}
		        widgetData={widget}
		        flowData={flowData}
		        fallData={fallData}
		        orb={orb}
		        isDebug={isDebug} />
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
      let allVariants = widgetVariants(widget._id);
      let allBatches = allLinkedBatches(widget._id);
      return(
        <TraverseWrap
          batchData={false}
          itemData={false}
          widgetData={widget}
          variantData={false}
          allVariants={allVariants}
          groupData={group}
          user={user}
          app={app}
          title='Widget'
          subLink={subLink}
          mid={true}
        >
          <WidgetPanel
            widgetData={widget}
            groupData={group}
            variantData={allVariants}
            batchRelated={allBatches}
            app={app}
            user={user}
          />
          <BatchesList
            batchData={allBatches}
            widgetData={allWidgets}
            variantData={allVariants} />
        </TraverseWrap>
      );
    }
  }
    
  Session.set('nowBatch', false);
	return(
	  <TraverseWrap
      batchData={false}
      widgetData={false}
      variantData={false}
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