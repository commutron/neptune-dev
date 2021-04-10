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

import { toast } from 'react-toastify';


const BatchPanel = ({ 
  batchData, widgetData, //variantData,
  user, isDebug, app, 
  brancheS, flowData
})=> {
  
  const [ rapidCheck, rapidCheckSet ] = useState(false);
  const [ seriesCheck, seriesCheckSet ] = useState(false);
  const [ batchCheck, batchCheckSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('checkIfRapidConverted', batchData._id, (err, re)=>{
      err && console.error(err);
      rapidCheckSet(re); 
    });
    ///
    Meteor.call('checkIfBatchConverted', batchData._id, (err, re)=>{
      err && console.error(err);
      batchCheckSet(re); 
    });
    ///
    Meteor.call('checkIfSeriesConverted', batchData._id, (err, re)=>{
      err && console.error(err);
      seriesCheckSet(re); 
    });
  });
  
  
  function runRapidConvert(e) {
    this.cnvrtRapid.disabled = true;
    Meteor.call('convertToRapid', batchData._id, (err, re)=>{
      err && console.error(err);
      re === 'isDone' && window.alert('Rapid Already Exists'); 
      re ? toast.success('GOOD') : toast.error('ERROR');
    });
  }
  
  function runSeriesConvert(e) {
    this.cnvrtSeries.disabled = true;
    Meteor.call('convertToSeries', batchData._id, (err, re)=>{
      err && console.error(err);
      re === 'hasSeries' && window.alert('Series Already Exists');
      re ? toast.success('GOOD') : toast.error('ERROR');
    });
  }
  
  function runBatchConvert(e) {
    this.cnvrtBatch.disabled = true;
    Meteor.call('convertToXBatch', batchData._id, (err, re)=>{
      err && console.error(err);
      re === 'isX' && window.alert('XBatch Already Exists');
      re ? toast.success('GOOD') : toast.error('ERROR');
    });
  }
  
  function runOldDelete(e) {
    this.dltBatch.disabled = true;
    Meteor.call('adminFORCERemoveOldBatch', batchData._id, batchData.batch, 
    (err, re)=>{
      err && console.error(err);
      re ? toast.success('GOOD') : toast.error('ERROR');
    });
    window.location.reload();
  }
  
  
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
      
      {Roles.userIsInRole(Meteor.userId(), 'admin') &&
        <div className='vmargin'>
          <div className='vmargin balancer'>
          
            <button
              id='cnvrtRapid'
              className='action bigger clearOrange'
              onClick={()=>runRapidConvert()}
              disabled={rapidCheck}
            >Create RAPID</button>
            
            <button
              id='cnvrtSeries'
              className='action bigger clearOrange'
              onClick={()=>runSeriesConvert()}
              disabled={!rapidCheck || seriesCheck}
            >Create Series</button>
            
            <button
              id='cnvrtBatch'
              className='action bigger clearOrange'
              onClick={()=>runBatchConvert()}
              disabled={!rapidCheck || !seriesCheck || batchCheck}
            >Create XBatch</button>
            
          </div>
          
          <div className='vmargin centre'>
      
            <button
              id='dltBatch'
              className='action biggest clearRed'
              onClick={()=>runOldDelete()}
              disabled={!(rapidCheck && seriesCheck && batchCheck)}
            >DELETE Legacy</button>
            
          </div>
        </div>
      }
      
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