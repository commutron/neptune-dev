import React, {Component} from 'react';
import moment from 'moment';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';
import FirstList from '../../../components/smallUi/FirstList.jsx';
import ScrapList from '../../../components/smallUi/ScrapList.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import ShortList from '../../../components/bigUi/ShortList.jsx';
import ShortButton from '../../../components/forms/ShortButton.jsx';
import ActiveLabel from '../../../components/smallUi/ActiveLabel.jsx';
import Progress from '../../../components/bigUi/Progress.jsx';
import Remove from '../../../components/forms/Remove.jsx';
import BatchForm from '../../../components/forms/BatchForm.jsx';
import RiverSelect from '../../../components/forms/RiverSelect.jsx';
import NCEscape from '../../../components/forms/NCEscape.jsx';
import RMAForm from '../../../components/forms/RMAForm.jsx';
//import RMAList from '../../../components/smallUi/RMAList.jsx';
import MultiItemForm from '../../../components/forms/MultiItemForm.jsx';

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
    data.map( (entry)=>{
      // check history for...
      for(let value of entry.history) {
        // firsts
        if(value.type === 'first') {
          fList.push({
            bar: entry.serial,
            entry: value
          });
        // scraps
        }else if(value.type === 'scrap') {
          scList.push(entry.serial);
        // other
        }else{null}
      }
     });
     return [fList, scList];
  }
  /*
  rmas() {
    const dt = this.props.batchData.rma;
    let past = [];
    if(dt.length > 0) {
      for(var x of dt) {
        past.push(x.rma);
      }
    }else{null}
    return past;
  }*/

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
    const more = b.finishedAt === false; // no more boards if batch is finished
    
    const filter = this.filter();
    
    return (
      <SlideDownWrap>
      <div className='card'>
        <div className='space cap'>
          <h1>{b.batch} <span className='rAlign'><ActiveLabel id={b._id} active={b.active} /></span></h1>
          <hr />
          <h3>
            <JumpFind title={g.alias} sub='' />
            <JumpFind title={w.widget} sub='' />
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
          
          {/*<RMAList id={b._id} data={b.rma} nons={a.nonConOption} rmas={a.rmaOption} />*/}
          
          <ScrapList data={filter[1]} count={b.scrap} />

          <hr />
          
          <ShortList batchData={b} />
          
          <ShortButton id={b._id} short={b.short} />

        <hr />
        </div>
        <br />
          
        <BatchForm
          batchId={b._id}
          batchNow={b.batch}
          versionNow={b.versionKey}
          start={b.start}
          end={b.end}
          widgetId={b.widgetId}
          versions={w.versions}
          lock={!w.versions || !b.active} />

        <RiverSelect
          id={b._id}
          widget={w}
          river={b.river}
          riverAlt={b.riverAlt}
          lock={!more} />
        
        <MultiItemForm
          id={b._id}
          items={b.items}
          more={more}
          unit={v.unit} />
          
        <NCEscape
          id={b._id}
          nons={a.nonConOption} />
        
        <RMAForm
          id={b._id}
          exist={false}
          options={a.trackOption}
          end={a.lastTrack} />
        
        <Remove
          action='batch'
          title={b.batch}
          check={b.createdAt.toISOString()}
          entry={b} />

      </div>
      </SlideDownWrap>
    );
  }
}