import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';

import Tabs from '/client/components/smallUi/Tabs.jsx';

import TagsModule from '../../../components/bigUi/TagsModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
import RiverSatus from '../../../components/smallUi/RiverStatus.jsx';
import FirstsOverview from '/client/components/bigUi/FirstsOverview.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
import ProgBurndown from '/client/components/charts/ProgBurndown.jsx';
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
                {b.items.length > 0 &&
                  <fieldset>
                    <legend>Serial Range</legend>
                    {itemsOrder[0].serial} - {itemsOrder[itemsOrder.length-1].serial}
                  </fieldset>}
                <NoteLine entry={b.notes} id={b._id} widgetKey={false}  />
                <BlockList id={b._id} data={b.blocks} lock={done} />
              </div>
              <div className='twoThirdsContent'>
                <div className='wellSpacedLine'>
                  <p className='capFL'>{Pref.start}: {moment(b.start).calendar()}</p>
                  <p className='capFL'>{Pref.end}: {moment(b.end).calendar()}</p>
                  <p>Finished: {fnsh}</p>
                </div>
                <br />
                {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
                  <em>firsts timeline or recent activity</em>}
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
                  <hr />
                  <FirstsOverview
                    doneFirsts={filter.fList}
                    flow={riverFlow}
                    flowAlt={riverAltFlow} />
                </div>
              
                <div className='twoThirdsContent'>
                  <StepsProgress
                    mini={true}
                    expand={true}
                    progCounts={progCounts} />
                </div>
                
                <div className='threeThirdsContent wide'>
                  <ProgBurndown
                    start={b.start}
                    end={b.finishedAt}
                    flowData={riverFlow}
                    flowAltData={riverAltFlow}
                    itemData={b.items}
                    title='Progress Burndown' />
                </div>
              </div>
          
            
            <div className='oneTwoThreeContainer space'>
              <div className='oneThirdContent min300 centreSelf'>
                <NonConPie nonCons={b.nonCon} />
              </div>
              <div className='twoThirdsContent'>
                <NonConRate batches={[b.batch]} />
              </div>
              <div className='threeThirdsContent'>
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