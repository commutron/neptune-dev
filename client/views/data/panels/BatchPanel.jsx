import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
//import UserName from '/client/components/uUi/UserName.jsx';
import Tabs from '/client/components/smallUi/Tabs.jsx';

import TagsModule from '../../../components/bigUi/TagsModule.jsx';

import FloorRelease from '/client/components/smallUi/FloorRelease.jsx';
import { ReleaseNote } from '/client/components/bigUi/ReleasesModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
import RiverSatus from '../../../components/smallUi/RiverStatus.jsx';
//import FirstsOverview from '/client/components/bigUi/FirstsOverview.jsx';
import FirstsTimeline from '/client/components/bigUi/FirstsTimeline.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
import ProgBurndown from '/client/components/charts/ProgBurndown.jsx';
import NonConOverview from '../../../components/charts/NonConOverview.jsx';
import NonConRate from '../../../components/charts/NonConRate.jsx';
import { HasNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
import { NonConPer } from '../../../components/bigUi/NonConMiniTops.jsx';
import { MostNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
import NonConPie from '../../../components/charts/NonConPie.jsx';
import RMATable from '../../../components/tables/RMATable.jsx';

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
    const g = this.props.groupData;
    
    const end = b.finishedAt !== false ? moment(b.finishedAt) : moment();
    const timeElapse = moment.duration(end.diff(b.start)).asWeeks().toFixed(1);
    
    const timeasweeks = timeElapse.split('.');
    const timeweeks = timeasweeks[0];
    const timedays = moment.duration(timeasweeks[1] * 0.1, 'weeks').asDays().toFixed(0);
    const elapseNice = timeweeks + ' week' + 
                        (timeweeks == 1 ? ', ' : 's, ') + 
                          timedays + ' day' +
                            (timedays == 1 ? '' : 's');
                 
    const fnsh = b.finishedAt ? end.format("MMMM Do, YYYY") : null;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river );
    const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    
    const riverTitle = flow ? flow.title : 'not found';
    const riverFlow = flow ? flow.flow : [];
    const riverAltTitle = flowAlt ? flowAlt.title : 'not found';
    const riverAltFlow = flowAlt ? flowAlt.flow : [];
    const done = b.finishedAt !== false; // no more boards if batch is finished
    
    let released = b.floorRelease === undefined ? undefined : 
                    b.floorRelease === false ? false :
                    typeof b.floorRelease === 'object';
                    
    const itemsOrder = b.items.sort( (x,y)=> x.serial - y.serial);
    
    const filter = this.filter();
    const progCounts = ProgressCounter(riverFlow, riverAltFlow, b, true);
    
    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={b.batch}>
            
          <div className='titleSection'>
            <span>{b.batch}</span>
            <span className='up'>{g.alias}</span>
            <span className='up'>{w.widget}</span>
            <span><i className='clean'>v.</i>{v.version}</span>
            <span>
              { b.active ? 
                <i className='fas fa-sync blueT' aria-hidden='true' title='in progress'></i>
                :
                <i className='fa fa-check-circle greenT' aria-hidden='true' title='finished'></i>
              }
            </span>
          </div>
          
          <br />
          
          <Tabs
            tabs={
              [
                'Info',
                'Progress',
                `${Pref.nonCon}s`,
                `${Pref.rma}s`
              ]
            }
            wide={true}
            stick={false}
            hold={true}
            sessionTab='batchExPanelTabs'>
            
            <div className='oneTwoThreeContainer space'>
              <div className='oneThirdContent min200'>
                <TagsModule
                  id={b._id}
                  tags={b.tags}
                  vKey={false}
                  tagOps={a.tagOption} />
                <fieldset className='noteCard'>
                  <legend>Time Range</legend>
                  <p className='capFL'>{Pref.start}: {moment(b.start).format("MMMM Do, YYYY")}</p>
                  <p className='capFL'>{Pref.end}: {moment(b.end).format("MMMM Do, YYYY")}</p>
                  {fnsh !== null && <p>Finished: {fnsh}</p>}
                  <p>{fnsh !== null ? 'Total Time:' : 'Elapsed:'} {elapseNice}</p>
                </fieldset>
                {b.items.length > 0 &&
                  <fieldset className='noteCard'>
                    <legend>Serial Range</legend>
                    <i className='letterSpaced'>{itemsOrder[0].serial} - {itemsOrder[itemsOrder.length-1].serial}</i>
                  </fieldset>}
                {released === undefined ? null :
                  released === true ?
                    <ReleaseNote id={b._id} release={b.floorRelease} expand={true} />
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
          
            
              <div className='oneTwoThreeContainer space'>
                <div className='oneThirdContent min200'>
                  <RiverSatus
                    items={b.items.length}
                    river={b.river}
                    riverTitle={riverTitle}
                    riverFlow={riverFlow}
                    riverAlt={b.riverAlt}
                    riverAltTitle={riverAltTitle}
                    riverAltFlow={riverAltFlow} />
                  {/*<hr />
                  <FirstsOverview
                    doneFirsts={filter.fList}
                    flow={riverFlow}
                    flowAlt={riverAltFlow} />*/}
                </div>
              
                <div className='twoThirdsContent'>
                  <StepsProgress
                    mini={true}
                    expand={true}
                    progCounts={progCounts} />
                </div>
                
                <div className='threeThirdsContent wide'>
                  <ProgBurndown
                    id={b._id}
                    start={b.start}
                    floorRelease={b.floorRelease}
                    end={b.finishedAt}
                    flowData={riverFlow}
                    flowAltData={riverAltFlow}
                    itemData={b.items}
                    title='Progress Burndown' />
                </div>
              </div>
          
            
            <div className='vFrameContainer space'>
              <div className='avOneContent min300 centreSelf'>
                <div className='wide centreRow'>
                  <HasNonCon noncons={b.nonCon} items={b.items} />
                  <NonConPer noncons={b.nonCon} items={b.items} />
                  <MostNonCon noncons={b.nonCon} app={a} />
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
                  nonCons={b.nonCon} />
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