import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import Tabs from '../../../components/smallUi/Tabs.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import TagsModule from '../../../components/bigUi/TagsModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
import RiverSatus from '../../../components/smallUi/RiverStatus.jsx';
import FirstsOverview from '/client/components/bigUi/FirstsOverview.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
import NonConOverview from '../../../components/charts/NonConOverview.jsx';
import NonConRate from '../../../components/charts/NonConRate.jsx';
import NonConPie from '../../../components/charts/NonConPie.jsx';
import RMATable from '../../../components/tables/RMATable.jsx';

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
     return [fList, rmaList];
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
                  <i className='fas fa-sync blueT' aria-hidden='true' title='in progress'></i>
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
              
              <div className='max300'>
                <TagsModule
                  id={b._id}
                  tags={b.tags}
                  vKey={false}
                  tagOps={a.tagOption} />
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
              
              <div className='split space'>
                <div>
                  <RiverSatus
                    items={b.items.length}
                    river={b.river}
                    riverTitle={riverTitle}
                    riverAlt={b.riverAlt}
                    riverAltTitle={riverAltTitle} />
                  <hr />
                  <FirstsOverview
                    doneFirsts={filter[0]}
                    flow={riverFlow}
                    flowAlt={riverAltFlow} />
                </div>
                <div className='centreRow wide'>
                  <StepsProgress
                    batchData={b}
                    flow={riverFlow}
                    flowAlt={riverAltFlow}
                    mini={false} />
                </div>
              </div>
              
              <BlockList id={b._id} data={b.blocks} lock={done} />
              
              <div className='split'>
                <div className='wide'>
                  <NonConOverview
                    ncOp={a.nonConOption}
                    flow={riverFlow}
                    flowAlt={riverAltFlow}
                    nonCons={b.nonCon} />
                  <NonConRate batches={[b.batch]} />
                </div>
                <div className='centre'>
                  <NonConPie nonCons={b.nonCon} />
                </div>
              </div>
              
              <div>
                <RMATable
                  id={b._id}
                  data={b.cascade}
                  items={b.items}
                  options={a.trackOption}
                  end={a.lastTrack}
                  inUse={filter[1]} />
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