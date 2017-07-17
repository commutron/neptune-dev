import React, {Component} from 'react';
import moment from 'moment';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FirstList from '../../../components/smallUi/FirstList.jsx';
import ScrapList from '../../../components/smallUi/ScrapList.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';
import ActiveLabel from '../../../components/smallUi/ActiveLabel.jsx';
import Progress from '../../../components/bigUi/Progress.jsx';
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
        v.type === 'first' ? fList.push({bar: item.serial, entry: v}) : null;
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
    const riverAltTitle = flowAlt ? flowAlt.title : 'not found';
    const done = b.finishedAt !== false; // no more boards if batch is finished
    
    const filter = this.filter();
    
    return (
      <SlideDownWrap>
      <div className='card'>
        <div className='space cap'>
          <h1>{b.batch} <span className='rAlign'><ActiveLabel id={b._id} active={b.active} /></span></h1>
          <hr />
          <h3>
            <JumpText title={g.alias} link={g.alias} />
            <JumpText title={w.widget} link={w.widget} />
            {Pref.version}: {v.version}
          </h3>
          <p>created: {moment(b.createdAt).calendar()} by: <UserNice id={b.createdWho} /></p>
          <p>{Pref.start}: {moment(b.start).calendar()}</p>
          <p>{Pref.end}: {moment(b.end).calendar()}</p>
          <p>finished: {fnsh}</p>
          <NoteLine entry={b.notes} id={b._id} widgetKey={false} />

          <Progress batchData={b} flow={flow} detail={true} />
          
          
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

          {/*<RouteList route={b.route} />*/}

          <FirstList data={filter[0]} />
          
          <RMAList
            id={b._id}
            data={b.cascade}
            options={a.trackOption}
            end={a.lastTrack}
            inUse={filter[2]} />
          
          <ScrapList data={filter[1]} />
          
          <p>{Pref.escape}s: {b.escaped.length}</p>

          <hr />
          
          <BlockList id={b._id} data={b.blocks} lock={done} />

        <hr />
        </div>

      </div>
      </SlideDownWrap>
    );
  }
}