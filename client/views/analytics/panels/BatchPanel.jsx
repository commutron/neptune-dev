import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import Tabs from '../../../components/smallUi/Tabs.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
import RiverSatus from '../../../components/smallUi/RiverStatus.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
import NonConOverview from '../../../components/charts/NonConOverview.jsx';
import NonConPie from '../../../components/charts/NonConPie.jsx';
import RMAList from '../../../components/smallUi/RMAList.jsx';

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
        v.type === 'first' ? fList.push({bar: item.serial, fKey: v.key, step: v.step}) : null;
      }
     });
     return {fList: fList, rmaList: rmaList};
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
    
    const printData = b.batch + '?group=' + g.alias +
                                '&widget=' + w.widget + 
                                '&ver=' + v.version +
                                '&desc=' + w.describe +
                                '&quant=' + b.items.length +
                                '&date=' + moment(b.end).format('MMMM D');
    
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
                  <i className='fa fa-refresh blueT' aria-hidden='true' title='in progress'></i>
                  :
                  <i className='fa fa-check-circle greenT' aria-hidden='true' title='finished'></i>
                }
              </span>
            </div>
            
          <div className='space'>
          
            <div className='balance'>
            
              <div>
                <p className='capFL'>{Pref.start}: {moment(b.start).calendar()}</p>
                <p className='capFL'>{Pref.end}: {moment(b.end).calendar()}</p>
                <p>Finished: {fnsh}</p>
              </div>
              
              <NoteLine entry={b.notes} id={b._id} widgetKey={false} />
              
            </div>
            
            <br />
            
            <Tabs
              tabs={
                [
                  'Progress',
                  Pref.block + 's',
                  Pref.nonCon + 's',
                  Pref.rma + 's'
                ]
              }
              wide={true}
              stick={false}>
              
              <div className='balance space'>
                <RiverSatus
                  items={b.items.length}
                  river={b.river}
                  riverTitle={riverTitle}
                  riverAlt={b.riverAlt}
                  riverAltTitle={riverAltTitle} />
                <StepsProgress
                  batchData={b}
                  flow={riverFlow}
                  flowAlt={riverAltFlow}
                  mini={false}
                  doneFirsts={filter.fList} />
              </div>
              
              <BlockList id={b._id} data={b.blocks} lock={done} />
              
              <div className='balance'>
                <div className='wide max600'>
                  <NonConOverview ncOp={a.nonConOption} nonCons={b.nonCon} />
                </div>
                <NonConPie nonCons={b.nonCon} />
              </div>
              
              <div>
                <RMAList
                  id={b._id}
                  data={b.cascade}
                  options={a.trackOption}
                  end={a.lastTrack}
                  inUse={filter.rmaList} />
                <p>{Pref.escape}s: {b.escaped.length}</p>
              </div>
              
            </Tabs>
            
          </div>
          
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