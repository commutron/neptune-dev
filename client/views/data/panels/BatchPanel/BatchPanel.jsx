import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';
import InfoTab from './InfoTab.jsx';
import TimeTab from './TimeTab.jsx';
import NCTab from './NCTab.jsx';

import EventsTimeline from '/client/components/bigUi/BatchFeed/EventsTimeline.jsx';
import RMATable from '/client/components/tables/RMATable.jsx';

// props
/// batchData
/// widgetData 
/// groupData
/// app

const BatchPanel = (props)=> {
  
  function getFlows() {
    const b = props.batchData;
    const w = props.widgetData;
    let riverTitle = 'not found';
    let riverFlow = [];
    let riverAltTitle = 'not found';
    let riverFlowAlt = [];
    let ncListKeys = [];
    let progCounts = false;
    if( b && w ) {
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
      progCounts = ProgressCounter(riverFlow, riverFlowAlt, b);
    }
    return { riverTitle, riverFlow, riverAltTitle, riverFlowAlt, ncListKeys, progCounts };
  }
  
  function filterSpecial() {
    const data = props.batchData.items;
    let verifyList = [];
    let rmaList = [];
    data.map( (item)=>{
      if(item.rma.length > 0) {
        for(let id of item.rma) {
          rmaList.push(id);
        }
      }else{null}
      // check history for...
      for(let v of item.history) {
        // firsts
        if(v.type === 'first') {
          v.serial = item.serial;
          verifyList.push( v );
        }
      }
     });
     return {verifyList: verifyList, rmaList: rmaList};
  }


    const a = props.app;
    const b = props.batchData;
    const w = props.widgetData;
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    //const g = props.groupData;
    
    const done = b.finishedAt !== false; // no more boards if batch is finished
    const allDone = b.items.every( x => x.finishedAt !== false );

    const filter = filterSpecial();
    
    const path = !b ? 
      { riverTitle: 'not found', riverFlow: [], 
        riverAltTitle: 'not found', riverFlowAlt: [], 
        ncListKeys: [], progCounts: false 
      } : getFlows();
                        

  return(
    <div className='section' key={b.batch}>
      
      <Tabs
        tabs={
          [
            'Info',
            'Time',
            'Events',
            `Problems`,
            `Returns`
          ]
        }
        wide={true}
        stick={false}
        hold={true}
        sessionTab='batchPanelTabs'>
        
        <InfoTab 
          a={props.app}
          b={props.batchData}
          user={props.user}
          done={done}
          allDone={allDone}
          progCounts={path.progCounts}
          riverTitle={path.riverTitle}
          riverAltTitle={path.riverAltTitle} />
      
        <TimeTab 
          a={props.app}
          b={props.batchData}
          v={v}
          user={props.user}
          totalUnits={path.progCounts.totalRegUnits + path.progCounts.totalAltUnits}
          done={done}
          allDone={allDone}
          riverFlow={path.riverFlow}
          riverAltFlow={path.riverAltFlow} />
          
        <div className='space3v'>
          <EventsTimeline
            id={b._id}
            batch={b.batch}
            verifyList={filter.verifyList}
            eventList={b.events || []}
            alterList={b.altered || []}
            quoteList={b.quoteTimeBudget || []}
            doneBatch={done} />
        </div>
        
        <NCTab 
          a={props.app}
          b={props.batchData}
          riverFlow={path.riverFlow}
          riverAltFlow={path.riverAltFlow}
          ncListKeys={path.ncListKeys.flat()} />
        
        <div>
          <RMATable
            id={b._id}
            data={b.cascade}
            items={b.items}
            options={a.trackOption}
            end={a.lastTrack}
            inUse={filter.rmaList}
            app={a} />
          <p>{Pref.escape}s: {b.escaped.length}</p>
        </div>
        
      </Tabs>
      
      <CreateTag
        when={b.createdAt}
        who={b.createdWho}
        whenNew={b.updatedAt}
        whoNew={b.updatedWho}
        dbKey={b._id} />
    </div>
  );
};

export default BatchPanel;