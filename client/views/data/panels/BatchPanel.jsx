import React, {Component} from 'react';
import moment from 'moment';
import business from 'moment-business';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
//import UserName from '/client/components/uUi/UserName.jsx';
import Tabs from '/client/components/smallUi/Tabs.jsx';

import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import FloorRelease from '/client/components/smallUi/FloorRelease.jsx';
import { ReleaseNote } from '/client/components/bigUi/ReleasesModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
import RiverSatus from '../../../components/smallUi/RiverStatus.jsx';
//import FirstsOverview from '/client/components/bigUi/FirstsOverview.jsx';
import FirstsTimeline from '/client/components/bigUi/FirstsTimeline.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress/StepsProgress.jsx';
import ProgLayerBurndown from '/client/components/charts/ProgLayerBurndown.jsx';
import NonConOverview from '../../../components/charts/NonConOverview.jsx';
import NonConRate from '../../../components/charts/NonConRate.jsx';
import { HasNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
import { NonConPer } from '../../../components/bigUi/NonConMiniTops.jsx';
import { MostNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
import { TodayNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
import { LeftFxNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
import { LeftInNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
import NonConPie from '../../../components/charts/NonConPie.jsx';
import RMATable from '../../../components/tables/RMATable.jsx';

import BatchFinish from '/client/components/forms/BatchFinish.jsx';

// props
/// batchData
/// widgetData 
/// groupData
/// app

export default class BatchPanel extends Component	{
  
  filter() {
    const data = this.props.batchData.items;
    let fList = [];
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
          fList.push({
            bar: item.serial,
            fKey: v.key,
            step: v.step,
            time: v.time,
            good: v.good
          }) : null;
      }
     });
     return {fList: fList, rmaList: rmaList};
  }

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const w = this.props.widgetData;
    //const g = this.props.groupData;
    const user = this.props.user;
    
    const end = b.finishedAt !== false ? moment(b.finishedAt) : moment();
    const timeElapse = moment.duration(end.diff(b.start)).asWeeks().toFixed(1);
    
    const timeasweeks = timeElapse.split('.');
    const timeweeks = timeasweeks[0];
    const timedays = moment.duration(timeasweeks[1] * 0.1, 'weeks').asDays().toFixed(0);
    const elapseNice = timeweeks + ' week' + 
                        (timeweeks == 1 ? ', ' : 's, ') + 
                          timedays + ' day' +
                            (timedays == 1 ? '' : 's');
    const remain = business.weekDays( moment(), moment(b.end) );             
    const fnsh = b.finishedAt ? end.format("MMMM Do, YYYY h:mm A") : null;
    
    //const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river );
    const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    
    const riverTitle = flow ? flow.title : 'not found';
    const riverFlow = flow ? flow.flow : [];
    const riverAltTitle = flowAlt ? flowAlt.title : 'not found';
    const riverAltFlow = flowAlt ? flowAlt.flow : [];
    const done = b.finishedAt !== false; // no more boards if batch is finished
    const allDone = b.items.every( x => x.finishedAt !== false );

    let released = b.floorRelease === undefined ? undefined : 
                    b.floorRelease === false ? false :
                    typeof b.floorRelease === 'object';
                    
    const itemsOrder = b.items.sort( (x,y)=> x.serial - y.serial);
    
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
            
          <div className='titleSection'>
            <span>
              { b.live ? 
                <i className='fas fa-sync blueT' title='in progress'></i>
                :
                <i className='fa fa-check-circle greenT' title='finished'></i>
              }
              {!done && allDone && 
                <BatchFinish batchId={b._id} alreadyDone={done} />}
            </span>
          </div>
          
          <br />
          
          <Tabs
            tabs={
              [
                'Info',
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
            
            <div className='oneTwoThreeContainer space'>
              <div className='oneThirdContent min200'>
                <WatchButton 
                  list={user.watchlist}
                  type='batch'
                  keyword={b.batch} />
                  
                <TagsModule
                  id={b._id}
                  tags={b.tags}
                  vKey={false}
                  tagOps={a.tagOption} />
                <fieldset className='noteCard'>
                  <legend>Time Range</legend>
                  <p className='capFL'>{Pref.salesOrder}: {b.salesOrder || 'not available'}</p>
                  <p className='capFL'>{Pref.start}: {moment(b.start).format("MMMM Do, YYYY")}</p>
                  <p className='capFL'>{Pref.end}: {moment(b.end).format("MMMM Do, YYYY")}</p>
                  {fnsh !== null && <p>Finished: {fnsh}</p>}
                  <p>{fnsh !== null ? 'Total Time:' : 'Elapsed:'} {elapseNice}</p>
                  {fnsh !== null ? null : <p>Time Remaining: {remain} weekdays</p> }
                </fieldset>
                {b.items.length > 0 &&
                  <fieldset className='noteCard'>
                    <legend>Serial Range</legend>
                    <i className='numFont'>{itemsOrder[0].serial} - {itemsOrder[itemsOrder.length-1].serial}</i>
                  </fieldset>}
                {released === undefined ? null :
                  released === true ?
                    <ReleaseNote id={b._id} release={b.floorRelease} />
                  : <FloorRelease id={b._id} /> }
                <NoteLine entry={b.notes} id={b._id} widgetKey={false}  />
                <BlockList id={b._id} data={b.blocks} lock={done} expand={true} />
              </div>
              <div className='twoThirdsContent'>
                <FirstsTimeline
                  id={b._id}
                  batch={b.batch}
                  doneFirsts={filter.fList} />
              </div>
            </div>
          
            
              <div className='space'>
              
                <div className='vmargin space'>
                  <StepsProgress
                    mini={true}
                    expand={true}
                    progCounts={progCounts}
                    riverTitle={riverTitle}
                    riverAltTitle={riverAltTitle} />
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
                  
                  <p>
                    A step that was added mid-run might not reach zero because 
                    finished items would have skipped recording that step.
                  </p>
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