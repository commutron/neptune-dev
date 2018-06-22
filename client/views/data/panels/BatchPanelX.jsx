import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
//import ProgressCounter from '/client/components/utilities/ProgressCounter.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
//import UserName from '/client/components/uUi/UserName.jsx';
import Tabs from '/client/components/smallUi/Tabs.jsx';

import TagsModule from '../../../components/bigUi/TagsModule.jsx';

import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import { ReleaseNote } from '/client/components/bigUi/ReleasesModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
//import RiverSatus from '../../../components/smallUi/RiverStatus.jsx';
//import FirstsOverview from '/client/components/bigUi/FirstsOverview.jsx';
//import FirstsTimeline from '/client/components/bigUi/FirstsTimeline.jsx';
//import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
//import ProgBurndown from '/client/components/charts/ProgBurndown.jsx';
//import NonConOverview from '../../../components/charts/NonConOverview.jsx';
//import NonConRate from '../../../components/charts/NonConRate.jsx';
//import { HasNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
//import { NonConPer } from '../../../components/bigUi/NonConMiniTops.jsx';
//import { MostNonCon } from '../../../components/bigUi/NonConMiniTops.jsx';
//import NonConPie from '../../../components/charts/NonConPie.jsx';
//import RMATable from '../../../components/tables/RMATable.jsx';

// props
/// batchData
/// widgetData 
/// groupData
/// app

export default class BatchPanelX extends Component	{

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const end = !b.completed ? moment() : moment(b.completedAt);
    const timeElapse = moment.duration(end.diff(b.salesStart)).asWeeks().toFixed(1);
    
    const timeasweeks = timeElapse.split('.');
    const timeweeks = timeasweeks[0];
    const timedays = moment.duration(timeasweeks[1] * 0.1, 'weeks').asDays().toFixed(0);
    const elapseNice = timeweeks + ' week' + 
                        (timeweeks == 1 ? ', ' : 's, ') + 
                          timedays + ' day' +
                            (timedays == 1 ? '' : 's');
                 
    const cmplt = b.completedAt ? end.format("MMMM Do, YYYY") : null;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    //const flow = w.flows.find( x => x.flowKey === b.river );
    //const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    
    //const riverTitle = flow ? flow.title : 'not found';
    //const riverFlow = flow ? flow.flow : [];

    const done = b.completed === true && b.active === false; // no more boards if batch is finished
    
    let released = b.releases.find( x => x.type === 'floorRelease');
    
    //const progCounts = ProgressCounter(riverFlow, riverAltFlow, b, true);
    
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
                  xBatch={true}
                  tagOps={a.tagOption} />
                <fieldset className='noteCard'>
                  <legend>Time Range</legend>
                  <p className='capFL'>{Pref.salesOrder}: {b.salesOrder || 'not available'}</p>
                  <p className='capFL'>{Pref.start}: {moment(b.salesStart).format("MMMM Do, YYYY")}</p>
                  <p className='capFL'>{Pref.end}: {moment(b.salesEnd).format("MMMM Do, YYYY")}</p>
                  {cmplt !== null && <p>Completed: {cmplt}</p>}
                  <p>{cmplt !== null ? 'Total Time:' : 'Elapsed:'} {elapseNice}</p>
                </fieldset>
                {!released ?
                  <ReleaseAction id={b._id} rType='floorRelease' />
                  :
                  <ReleaseNote
                    id={b._id}
                    release={released}
                    xBatch={true}
                    expand={true} />
                }
                <NoteLine entry={b.notes} id={b._id} xBatch={true} widgetKey={false}  />
                <BlockList id={b._id} data={b.blocks} xBatch={true} lock={done} expand={true} />
              </div>
              <div className='twoThirdsContent'>
              {/*
                <FirstsTimeline
                  id={b._id}
                  batch={b.batch}
                  doneFirsts={filter.fList} />
              */}
              </div>
            </div>
          
            
              <div className='oneTwoThreeContainer space'>
                <div className='oneThirdContent min200'>
                  {/*
                  <FirstsOverview
                    doneFirsts={filter.fList}
                    flow={riverFlow}
                    flowAlt={riverAltFlow} />*/}
                  <h3>Assigned Counters</h3>
                  <dl>
                    {b.waterfall.map( (entry)=>{
                    let total = entry.counts.length > 0 ?
                    Array.from(entry.counts, x => x.tick).reduce((x,y)=> x + y) :
                    0;
                      return <dd key={entry.wfKey}>{entry.gate} : {total}</dd>;
                    })}
                  </dl>
                </div>
              
                <div className='twoThirdsContent'>
                {/*
                  <StepsProgress
                    mini={true}
                    expand={true}
                    progCounts={progCounts} />
                */}
                </div>
                
                <div className='threeThirdsContent wide'>
                {/*
                  <ProgBurndown
                    id={b._id}
                    start={b.start}
                    floorRelease={b.floorRelease}
                    end={b.finishedAt}
                    flowData={riverFlow}
                    flowAltData={riverAltFlow}
                    itemData={b.items}
                    title='Progress Burndown' />
                */}
                </div>
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