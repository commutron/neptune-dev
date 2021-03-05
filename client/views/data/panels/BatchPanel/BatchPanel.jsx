import React, { useState, useEffect } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';
import InfoTab from './InfoTab.jsx';
import TimeTab from './TimeTab.jsx';
import ProblemTab from './ProblemTab.jsx';

import EventsTimeline from '/client/components/bigUi/BatchFeed/EventsTimeline.jsx';
import RMATable from '/client/components/tables/RMATable.jsx';


const BatchPanel = ({ 
  batchData, widgetData, //variantData,
  user, isDebug, app, 
  brancheS, flowData
})=> {
  
  const [ verifyListState, verifyListSet ] = useState([]);
  const [ rmaListState, rmaListSet ] = useState([]);
  
  useEffect( ()=>{
    const data = batchData.items;
    let verifyList = [];
    let rmaList = [];
    data.map( (item)=>{
      if(item.rma.length > 0) {
        for(let id of item.rma) {
          rmaList.push(id);
        }
      }else{null}
      // check history for...
      for(let i of item.history) {
        // firsts
        if(i.type === 'first') {
          i.serial = item.serial;
          verifyList.push( i );
        }
      }
     });
     verifyListSet(verifyList);
     rmaListSet(rmaList);
  }, [batchData]);

  const a = app;
  const b = batchData;
  // const w = widgetData;
  //const v = variantData;
  
  const done = b.finishedAt !== false; // no more boards if batch is finished
  const allDone = b.items.every( x => x.finishedAt !== false );
    
  isDebug && console.log(JSON.stringify(flowData));

  return(
    <div className='section darkTheme' key={b.batch}>
      
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
          a={app}
          b={batchData}
          user={user}
          isDebug={isDebug}
          done={done}
          allDone={allDone}
          progCounts={flowData.progCounts}
          riverTitle={flowData.riverTitle}
          riverAltTitle={flowData.riverAltTitle}
          brancheS={brancheS} />
      
        <TimeTab 
          a={app}
          b={batchData}
          user={user}
          isDebug={isDebug}
          totalUnits={flowData.progCounts.totalRegUnits + flowData.progCounts.totalAltUnits}
          done={done}
          allDone={allDone}
          riverFlow={flowData.riverFlow}
          riverAltFlow={flowData.riverAltFlow} />
          
        <div className='space3v'>
          <EventsTimeline
            id={b._id}
            batchData={batchData}
            brancheS={brancheS}
            releaseList={b.releases || []}
            verifyList={verifyListState}
            eventList={b.events || []}
            alterList={b.altered || []}
            quoteList={b.quoteTimeBudget || []}
            doneBatch={done} />
        </div>
        
        <ProblemTab 
          a={app}
          b={batchData}
          riverFlow={flowData.riverFlow}
          riverAltFlow={flowData.riverAltFlow}
          ncTypesCombo={flowData.ncTypesComboFlat}
          brancheS={brancheS}
          isDebug={isDebug} />
        
        <div>
          <RMATable
            id={b._id}
            data={b.cascade}
            items={b.items}
            options={a.trackOption}
            end={a.lastTrack}
            inUse={rmaListState}
            ncTypesCombo={flowData.ncTypesComboFlat}
            app={a}
            user={user} />
          
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