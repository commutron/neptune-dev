import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import Tabs from '../../../components/smallUi/Tabs.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FirstsOverview from '../../../components/charts/FirstsOverview.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
import Progress from '../../../components/bigUi/Progress.jsx';
import StepsProgressMini from '../../../components/bigUi/StepsProgressMini.jsx';
import NonConOverview from '../../../components/charts/NonConOverview.jsx';
import NonConPie from '../../../components/charts/NonConPie.jsx';
import RMAList from '../../../components/smallUi/RMAList.jsx';

// props
/// batchData
/// widgetData 
/// groupData
/// app

export default class BatchPanel extends Component	{
    
  // replace using es5 .filter() method
  filter() {
    const data = this.props.batchData.items;
    let fList = [];
    let scList = [];
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
        v.type === 'first' ? fList.push({bar: item.serial, fKey: v.key, step: v.step}) : null;
        // scraps
        v.type === 'scrap' ? scList.push(item.serial) : null;
      }
     });
     return [fList, scList, rmaList];
  }

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const fnsh = b.finishedAt ? moment(b.finishedAt).calendar() : '';
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river );
    const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    
    const riverTitle = flow ? flow.title : 'not found';
    const riverFlow = flow ? flow.flow : [];
    const riverAltTitle = flowAlt ? flowAlt.title : 'not found';
    const riverAltFlow = flowAlt ? flowAlt.flow : [];
    const done = b.finishedAt !== false; // no more boards if batch is finished
    
    const filter = this.filter();
    
    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={b.batch}>
            
            <div className='titleSection'>
              <span>{b.batch}</span>
              <span><JumpText title={g.alias} link={g.alias} /></span>
              <span><JumpText title={w.widget} link={w.widget} /></span>
              <span><i className='clean'>v.</i>{v.version}</span>
              <span>
                { b.active ? 
                  <i className='fa fa-refresh blueT' aria-hidden='true'></i>
                  :
                  <i className='fa fa-check-circle greenT' aria-hidden='true'></i>
                }
              </span>
            </div>
            
          <div className='space cap'>
          
            <div className='balance'>
            
              <div>
                <p>{Pref.start}: {moment(b.start).calendar()}</p>
                <p>{Pref.end}: {moment(b.end).calendar()}</p>
                <p>finished: {fnsh}</p>
              </div>
              
              <NoteLine entry={b.notes} id={b._id} widgetKey={false} />
              
            </div>
            
            <br />
            
            <Tabs
              tabs={
                [
                  'Progress',
                  Pref.trackFirst + 's',
                  Pref.block + 's',
                  Pref.nonCon + 's',
                  Pref.rmaProcess + 'es'
                ]
              }
              wide={true}
              stick={false}>
              
              <div>
                {/*<RouteList route={b.route} />*/}
                {!b.river ? 
                <p>
                  <i className="fa fa-exclamation-circle fa-2x" aria-hidden="true"></i>
                  <i>The {Pref.buildFlow} has not been selected for this {Pref.batch}</i>
                </p>
                :
                <b>Current {Pref.buildFlow}: <i>{riverTitle}</i></b>}
                <br />
                {!b.riverAlt ? 
                <p>
                  <i className="fa fa-question-circle fa-2x" aria-hidden="true"></i>
                  <i>The {Pref.buildFlowAlt} has not been selected for this {Pref.batch}</i>
                </p>
                :
                <b>Current {Pref.buildFlowAlt}: <i>{riverAltTitle}</i></b>}
                
                <Progress batchData={b} flow={riverFlow} detail={true} />
                <StepsProgressMini batchData={b} flow={riverFlow} />
              </div>
              
              <FirstsOverview doneFirsts={filter[0]} flow={riverFlow} flowAlt={riverAltFlow} />
              
              <BlockList id={b._id} data={b.blocks} lock={done} />
              
              <div className='balance'>
                <NonConOverview ncOp={a.nonConOption} nonCons={b.nonCon} />
                <NonConPie nonCons={b.nonCon} />
              </div>
              
              <div>
                <RMAList
                  id={b._id}
                  data={b.cascade}
                  options={a.trackOption}
                  end={a.lastTrack}
                  inUse={filter[2]} />
                <p>{Pref.escape}s: {b.escaped.length}</p>
              </div>
              
            </Tabs>
            
          </div>
          
          <CreateTag when={b.createdAt} who={b.createdWho} whenNew={b.updatedAt} whoNew={b.updatedWho} />
        </div>
      </AnimateWrap>
    );
  }
}