import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';
import InfoTab from './InfoTab.jsx';
import TimeTab from './TimeTab.jsx';
import NCTab from './NCTab.jsx';

import FirstsTimeline from '/client/components/bigUi/FirstsTimeline.jsx';
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
    let flow = [];
    let riverAltTitle = 'not found';
    let flowAlt = [];
    let ncListKeys = [];
    let progCounts = false;
    if( b && w ) {
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
      if(river) {
        riverTitle = river.title;
        flow = river.flow;
        river.type === 'plus' && ncListKeys.push(river.ncLists);
      }
      if(riverAlt) {
        riverAltTitle = riverAlt.title;
        flowAlt = riverAlt.flow;
        riverAlt.type === 'plus' && ncListKeys.push(riverAlt.ncLists);
      }
      progCounts = ProgressCounter(flow, flowAlt, b);
    }
    return { riverTitle, flow, riverAltTitle, flowAlt, ncListKeys, progCounts };
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
        v.type === 'first' ? 
          verifyList.push({
            serial: item.serial,
            rec: v
          }) : null;
      }
     });
     return {verifyList: verifyList, rmaList: rmaList};
  }


    const a = props.app;
    const b = props.batchData;
    //const w = this.props.widgetData;
    //const g = this.props.groupData;
    //const user = this.props.user;
    
    //const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const done = b.finishedAt !== false; // no more boards if batch is finished
    const allDone = b.items.every( x => x.finishedAt !== false );

    const filter = filterSpecial();
    
    const path = !b ? 
      { riverTitle: 'not found', flow: [], 
        riverAltTitle: 'not found', flowAlt: [], 
        ncListKeys: [], progCounts: false 
      } : getFlows();
                        

  return(
    <AnimateWrap type='cardTrans'>
      <div className='section' key={b.batch}>
        
        <Tabs
          tabs={
            [
              'Info',
              'Timeline',
              'First-offs',
              `${Pref.nonCon}s`,
              `${Pref.rma}s`
            ]
          }
          wide={true}
          stick={false}
          hold={true}
          sessionTab='batchExPanelTabs'>
          
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
            user={props.user}
            done={done}
            allDone={allDone}
            riverFlow={path.riverFlow}
            riverAltFlow={path.riverAltFlow} />
            
          <div className='space3v'>
            <FirstsTimeline
              id={b._id}
              batch={b.batch}
              verifyList={filter.verifyList}
              doneBatch={done} />
          </div>
          
          <NCTab 
            a={props.app}
            b={props.batchData}
            riverFlow={path.riverFlow}
            riverAltFlow={path.riverAltFlow}
            ncListKeys={path.ncListKeys} />
          
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
    </AnimateWrap>
  );
};

export default BatchPanel;