import React, {Component} from 'react';
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

export default class BatchPanel extends Component	{
  
  filter() {
    const data = this.props.batchData.items;
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

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const w = this.props.widgetData;
    //const g = this.props.groupData;
    //const user = this.props.user;
    
    //const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river );
    const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    
    const riverTitle = flow ? flow.title : 'not found';
    const riverFlow = flow ? flow.flow : [];
    const riverAltTitle = flowAlt ? flowAlt.title : 'not found';
    const riverAltFlow = flowAlt ? flowAlt.flow : [];
    const done = b.finishedAt !== false; // no more boards if batch is finished
    const allDone = b.items.every( x => x.finishedAt !== false );

    const filter = this.filter();
    const progCounts = ProgressCounter(riverFlow, riverAltFlow, b);
    
    return (
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
              a={this.props.app}
              b={this.props.batchData}
              user={this.props.user}
              done={done}
              allDone={allDone}
              progCounts={progCounts}
              riverTitle={riverTitle}
              riverAltTitle={riverAltTitle} />
            
            <TimeTab 
              a={this.props.app}
              b={this.props.batchData}
              user={this.props.user}
              done={done}
              allDone={allDone}
              riverFlow={riverFlow}
              riverAltFlow={riverAltFlow} />
              
            <div className='space3v'>
              <FirstsTimeline
                id={b._id}
                batch={b.batch}
                verifyList={filter.verifyList}
                doneBatch={done} />
            </div>
            
            <NCTab 
              a={this.props.app}
              b={this.props.batchData}
              riverFlow={riverFlow}
              riverAltFlow={riverAltFlow} />
            
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
  }
}