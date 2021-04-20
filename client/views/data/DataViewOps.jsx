import React from 'react';

import Pref from '/client/global/pref.js';

import { TraverseWrap } from '/client/layouts/DataExploreLayout.jsx';

import SearchHelp from './SearchHelp.jsx';

import ExploreLanding from './panels/ExploreLanding.jsx';
import ReportsWrap from './panels/Reports/ReportsWrap.jsx';
import AllGroups from './panels/AllGroups/AllGroups.jsx';

import BuildHistory from './panels/BuildHistory.jsx';

import ItemPanel from './panels/ItemPanel.jsx';
import ItemPanelX from './panels/ItemPanelX';
import BatchPanel from './panels/BatchPanel/BatchPanel.jsx';
import BatchPanelX from './panels/XBatchPanel/BatchPanelX.jsx';
import WidgetPanel from './panels/WidgetPanel/WidgetPanel';
import TestFailPanel from './panels/TestFailPanel.jsx';
import ScrapPanel from './panels/ScrapPanel.jsx';

import BatchesList from './lists/BatchesList.jsx';
import ItemsList from './lists/ItemsList.jsx';
import ItemsListX from './lists/ItemsListX';


// import WidgetsList from './lists/WidgetsList.jsx';

import ProgressCounter from '/client/utility/ProgressCounter.js';

import FlowCounter, { FallCounter, WhiteWaterCounter } from '/client/utility/ProgressCounterX';
import { NonConMerge } from '/client/utility/NonConOptions';


const DataViewOps = ({ 
  allXBatch, allBatch, 
  allGroup, allWidget, allVariant,
  user, isDebug, app, brancheS, users,
  hotBatch, hotXBatch, hotXSeries, hotXRapids,
  view, request, specify,
  subLink, orb
})=> {
  
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  
  function allLinkedBatches(wId) {
    const xBatches = allXBatch.filter(x => x.widgetId === wId);
    const legacyBatches = allBatch.filter(x => x.widgetId === wId);
    return [...xBatches, ...legacyBatches ];
  }
  
  function itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }
  
  function linkedGroup(gId) {
    return allGroup.find(x => x._id === gId);
  }
  
  function getWidget(request) {
    return allWidget.find( x => 
              x._id === request || x.widget === request );
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

  function getFlowDataLEGACY(batchData, widgetData, appData) {
    let riverTitle = 'not found';
    let riverFlow = [];
    let riverAltTitle = 'not found';
    let riverFlowAlt = [];
    let ncListKeys = [];
    let ncTypesComboFlat = [];
    let progCounts = false;
    
    if( widgetData && batchData ) {
      
      const getRiverFirst = (w, b)=> {
        return new Promise(function(resolve) {
          const river = w.flows.find( x => x.flowKey === b.river);
          const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
          if(river) {
            riverTitle = river.title;
            riverFlow = river.flow;
            river.type === 'plus' && ncListKeys.push(river.ncLists);
          }
          if(riverAlt) {
            riverAltTitle = riverAlt.title;
            riverFlowAlt = riverAlt.flow;
            riverAlt.type === 'plus' && ncListKeys.push(riverAlt.ncLists);
          }
          resolve('Success');
        });
      };
      
      const generateSecond = (w, b, app)=> {
        progCounts = ProgressCounter(riverFlow, riverFlowAlt, b);
        
        ncTypesComboFlat = NonConMerge(ncListKeys, app, user, true);
      };

      getRiverFirst(widgetData, batchData)
        .then(generateSecond(widgetData, batchData, appData));
        
    }
    return {
      riverTitle, riverFlow, 
      riverAltTitle, riverFlowAlt, 
      ncTypesComboFlat, progCounts
    };
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
          batchData={allBatch}
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
          allBatch={allBatch}
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
          allBatch={allBatch}
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
            batchData={allBatch}
            batchDataX={allXBatch}
            widgetData={allWidget}
            variantData={allVariant}
            groupData={allGroup} 
            app={app}
            specify={specify} />
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
    //         batchData={allBatch}
    //         widgetData={allWidget}
    //         groupData={allGroup}
    //         allWidget={allWidget}
    //         allVariant={allVariant}
    //         allBatch={allBatch}
    //         allXBatch={allXBatch}
    //         app={app}
    //         isDebug={isDebug} />
    //     </TraverseWrap>
    //   );
    
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
          beta={true}
          base={true}
        >
          <TestFailPanel 
            batchData={allBatch} 
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
            batchData={allBatch} 
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
    if(hotBatch) {
      let item = itemData(hotBatch.items, specify);
      let widget = linkedWidget(hotBatch.widgetId);
      let variant = linkedVariantKey(hotBatch.versionKey);
      let group = linkedGroup(widget.groupId);
      let flowData = getFlowDataLEGACY(hotBatch, widget, app);
      if(item && widget && variant && group) {
        return (
          <TraverseWrap
            batchData={hotBatch}
            itemData={item}
            widgetData={widget}
            variantData={variant}
            groupData={group}
            user={user}
            app={app}
            title='Item'
            subLink={subLink}
            action='item'
            darkTheme={true}
          >
            <ItemPanel
              batchData={hotBatch}
              itemData={item}
              widgetData={widget}
              variantData={variant}
              groupData={group}
              app={app}
              brancheS={brancheS}
              user={user}
              listTitle={true}
              flowData={flowData} />
            <ItemsList
              batchData={hotBatch}
              widgetData={widget}
              flowData={flowData}
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
    }else if(hotXSeries) {
      let item = itemData(hotXSeries.items, specify);
      let widget = linkedWidget(hotXSeries.widgetId);
      let variant = linkedVariantKey(hotXSeries.versionKey);
      let group = linkedGroup(hotXSeries.groupId);
                     
      let flowData = getFlowData(hotXBatch, hotXSeries, widget, app);
      let fallData = getFallData(hotXBatch, app);
      let rapXData = getRapidData(hotXBatch, hotXSeries, hotXRapids);
      
      if(item && widget && variant && group) {
        return (
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
    if(hotBatch) {
      let widget = linkedWidget(hotBatch.widgetId);
      let variant = linkedVariantKey(hotBatch.versionKey);
      let allVariants = widgetVariants(hotBatch.widgetId);
      let group = linkedGroup(widget.groupId);
      let flowData = getFlowDataLEGACY(hotBatch, widget, app);
      return(
		    <TraverseWrap
		      batchData={hotBatch}
          widgetData={widget}
          variantData={variant}
          allVariants={allVariants}
          groupData={group}
          user={user}
          app={app}
          flowData={flowData}
          title='Batch'
          subLink={subLink}
          action='batch'
          darkTheme={true}
        >
          <BatchPanel
            batchData={hotBatch}
            widgetData={widget}
            variantData={variant}
            groupData={group} 
            app={app}
            brancheS={brancheS}
            user={user}
            isDebug={isDebug}
            flowData={flowData} />
          <ItemsList
		        batchData={hotBatch}
		        widgetData={widget}
		        flowData={flowData}
		        orb={orb}
		        isDebug={isDebug} />
        </TraverseWrap>
      );
    }else if(hotXBatch) {
      let widget = linkedWidget(hotXBatch.widgetId);
      let variant = linkedVariantKey(hotXBatch.versionKey);
      let allVariants = widgetVariants(hotXBatch.widgetId);
      let group = linkedGroup(hotXBatch.groupId);
      
      let flowData = getFlowData(hotXBatch, hotXSeries, widget, app);
      let fallData = getFallData(hotXBatch, app);
      let rapXData = getRapidData(hotXBatch, hotXSeries, hotXRapids);
      
      const isNigh = Roles.userIsInRole(Meteor.userId(), 'nightly');
      return (
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
            isDebug={isDebug}
            isNigh={isNigh} />
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