import React, {Component} from 'react';
import moment from 'moment';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import HistoryLine from '../../../components/smallUi/HistoryLine.jsx';
import NCLine from '../../../components/smallUi/NCLine.jsx';
import RMALine from '../../../components/smallUi/RMALine.jsx';
import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';

export default class ItemPanel extends Component	{

  ncData() {
    let relevant = [];
    for (let value of this.props.batchData.nonCon) {
      if(value.serial === this.props.itemData.serial) {
        relevant.push(value);
      }else{null}
    }
    relevant.sort((nc1, nc2) => {return nc1.ref > nc2.ref});
    return relevant;
  }

  render() {

    const a = this.props.app;
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const nc = this.ncData();
  
    const done = i.finishedAt !== false;
    const scrap = done ? i.history.find(x => x.type === 'scrap') : false;

    const status = done ? <i className='greenT'>Finished</i> : <i className='blueT'>In Process</i>;

    const end = done ? scrap ? 
                <ScrapBox entry={scrap} />
                :
                <p>finished: {moment(i.finishedAt).calendar()} by <UserNice id={i.finishedWho} /></p> 
                : 
                <p></p>;

    return (
      <SlideDownWrap>
        <div className='card' key={i.serial}>
          <div className='space cap'>
            <h1>{i.serial}<span className='rAlign'>{status}</span></h1>
            <hr />
            <h3>
              <JumpText title={b.batch} link={b.batch} />
              <JumpText title={g.alias} link={g.alias} />
              <JumpText title={w.widget} link={w.widget} />
              {Pref.version}: {v.version}
            </h3>
            <hr />
            <p>units: {i.units}</p>
            <p>created: {moment(i.createdAt).calendar()} by <UserNice id={i.createdWho} /></p>
            {end}
  
            <details className='green'>
              <summary>History</summary>
              {i.history.map( (entry, index)=>{
                return (
                  <HistoryLine key={index} entry={entry} id={b._id} bar={i.serial} done={done} />
                )})}
            </details>
  
            <details className='red'>
              <summary>{nc.length} {Pref.nonCon}s</summary>
              {nc.map( (entry, index)=>{
                return ( 
                  <NCLine key={index} id={b._id} entry={entry} /> 
                )})}
            </details>
            
            <RMALine id={b._id} bar={i.serial} data={i.rma} />
  
          <hr />
          </div>
  
  			</div>
			</SlideDownWrap>
    );
  }
}