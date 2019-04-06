import React, {Component} from 'react';
import moment from 'moment';
import business from 'moment-business';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
//import UserName from '/client/components/uUi/UserName.jsx';
import Tabs from '/client/components/smallUi/Tabs.jsx';
import InfoTab from './InfoTab.jsx';

import FirstsTimeline from '/client/components/bigUi/FirstsTimeline.jsx';
import StepsProgress from '/client/components/bigUi/StepsProgress/StepsProgress.jsx';
import ProgLayerBurndown from '/client/components/charts/ProgLayerBurndown.jsx';
import NonConOverview from '/client/components/charts/NonConOverview.jsx';
import NonConRate from '/client/components/charts/NonConRate.jsx';
import { HasNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { NonConPer } from '/client/components/bigUi/NonConMiniTops.jsx';
import { MostNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { TodayNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftFxNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftInNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import NonConPie from '/client/components/charts/NonConPie.jsx';
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
    

///////////////////////////////////////
/*
    const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
    let allthetimes = [];
    for(let item of b.items) {
      for(let entry of item.history) {
        if(entry.type === 'inspect' && entry.good === true) {
          allthetimes.push({
            key: entry.key,
            step: entry.step,
            time: entry.time,
            who: entry.who,
          });
        }
      }
    }
    const cronoTimes = allthetimes.sort((x1, x2)=> {
                        if (x1.time < x2.time) { return -1 }
                        if (x1.time > x2.time) { return 1 }
                        return 0;
                      });
    let sortedTimes = [];
    for(let step of riverFlow) {
      if(step.type === 'inspect') {
        const thesetimes = cronoTimes.filter( x => x.key === step.key );
        sortedTimes.push({
          step: step.step,
          entries: thesetimes
        });
      }
    }
*/
////////////////////////////////////////
    
    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={b.batch}>
          
          <Tabs
            tabs={
              [
                'Info',
                'First-offs',
                'Progress',
                `${Pref.nonCon}s`,
                `${Pref.rma}s`,
                //'proto'
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
              allDone={allDone} />
            
            <div className='space'>
              <FirstsTimeline
                id={b._id}
                batch={b.batch}
                verifyList={filter.verifyList}
                doneBatch={done} />
            </div>
          
            <div className='space'>
            
              <div className='vmargin space'>
                <StepsProgress
                  progCounts={progCounts}
                  riverTitle={riverTitle}
                  riverAltTitle={riverAltTitle}
                  truncate={false} />
              </div>
                
              <div className='dropCeiling vmargin space'>
                <ProgLayerBurndown
                  id={b._id}
                  start={b.start}
                  floorRelease={b.floorRelease}
                  end={b.finishedAt}
                  flowData={riverFlow}
                  itemData={b.items.filter( x => x.alt === 'no' || x.alt === false )}
                  title='Progress Burndown' />
                
                {b.riverAlt !== false &&  
                  <ProgLayerBurndown
                    id={b._id}
                    start={b.start}
                    floorRelease={b.floorRelease}
                    end={b.finishedAt}
                    flowData={riverAltFlow}
                    itemData={b.items.filter( x => x.alt === 'yes' )}
                    title='Alt Progress Burndown' />}
              
                <details className='footnotes'>
                  <summary>Chart Details</summary>
                  <p className='footnote'>
                    The X axis is the number of serialized items remaining.
                  </p>
                  <p className='footnote'>
                    The Y axis starts with the batch creation date and ends with 
                    either today or the batch complete day. Weekends are skipped 
                    entirely.
                  </p>
                  <p className='footnote'>
                    A step that was added mid-run might not reach zero because 
                    finished items would have skipped recording that step.
                  </p>
                </details>
              </div>
            </div>
            
            <div className='vFrameContainer space'>
              <div className='avOneContent min300 centreSelf'>
                <div className='wide centreRow'>
                  <HasNonCon noncons={b.nonCon} items={b.items} />
                  <NonConPer noncons={b.nonCon} items={b.items} />
                  <MostNonCon noncons={b.nonCon} app={a} />
                  <TodayNonCon noncons={b.nonCon} />
                  <LeftFxNonCon noncons={b.nonCon} />
                  <LeftInNonCon noncons={b.nonCon} />
                </div>
                <NonConPie nonCons={b.nonCon} />
              </div>
              <div className='avTwoContent'>
                <p className='wide centreText'>NonCon Rate</p>
                <NonConRate batches={[b.batch]} />
              </div>
              <div className='avThreeContent'>
                <NonConOverview
                  ncOp={a.nonConOption}
                  flow={riverFlow}
                  flowAlt={riverAltFlow}
                  nonCons={b.nonCon}
                  app={a} />
              </div>
            </div>
            
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
            
            {/*proto ?
              <div>
                <ol>
                  {sortedTimes.length === 0 ?
                  <p className='centreText'>no inspections</p>
                  :
                  sortedTimes.map( (step, index)=>{
                    return(
                      <ol key={index}>
                        <b>{step.step} inspect</b>
                        {step.entries.map( (ding, inx)=>{
                          return(
                            <li key={inx}>
                              - {ding.time.toString()} - 
                              - {ding.who.slice(0, 3).toLowerCase()}
                            </li> );
                        })}
                      </ol>
                  )})}
                </ol>
              </div>
            : <div><p className='centreText'>nothing to see here</p></div> */}
            
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