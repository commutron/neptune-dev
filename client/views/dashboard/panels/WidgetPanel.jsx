import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FlowsList from '../../../components/bigUi/FlowsList.jsx';
import VersionsList from '../../../components/smallUi/VersionsList.jsx';

export default class WidgetPanel extends Component	{

  render() {

    //const g = this.props.groupData;
    const w = this.props.widgetData;
    const b = this.props.batchRelated;
    const a = this.props.app;

    return (
      <SlideDownWrap>
      <div className='card'>
        <div className='space cap edit'>
          <h1 className='up'>{w.widget}</h1>
          <h2>{w.describe}</h2>
          <hr />
          <p>Created: {moment(w.createdAt).calendar()} by <UserNice id={w.createdWho} /></p>

          <hr />
          <p>
            {b.map( (entry, index)=>{
              let ac = entry.active ? 'greenT' : null;
              return (
                <JumpText key={index} title={entry.batch} link={entry.batch} sty={ac} />
              )})}
          </p>
          <hr />
          
          <FlowsList id={w._id} flows={w.flows} />

        </div>
        
        <VersionsList widgetData={w} />
          
      </div>
      </SlideDownWrap>
    );
  }
} 