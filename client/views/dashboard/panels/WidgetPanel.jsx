import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../../../components/smallUi/UserNice.jsx';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';
import FlowsList from '../../../components/bigUi/FlowsList.jsx';
import Remove from '../../../components/forms/Remove.jsx';
import WidgetEditForm from '../../../components/forms/WidgetEditForm.jsx';
import VersionsList from '../../../components/smallUi/VersionsList.jsx';
import {VersionForm} from '../../../components/forms/VersionForm.jsx';
import {VersionKill} from '../../../components/forms/VersionForm.jsx';
import FlowForm from '../../../components/forms/FlowForm.jsx';
import BatchForm from '../../../components/forms/BatchForm.jsx';

export default class WidgetPanel extends Component	{

  render() {

    //const g = this.props.groupData;
    const w = this.props.widgetData;
    const b = this.props.batchRelated;
    const a = this.props.app;
    
    const wiki = w.versions.length > 0 ? w.versions[w.versions.length -1].wiki : a.instruct;

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
              let ac = entry.active ? 'action clear greenT' : null;
              return (
                <JumpFind key={index} title={entry.batch} sub='' sty={ac} />
              )})}
          </p>
          <hr />
          
          <FlowsList id={w._id} flows={w.flows} />

        </div>
        
        <VersionsList widgetData={w} />
        
        <hr />

        <WidgetEditForm
          id={w._id}
          now={w} />
          
        <VersionForm
          widgetData={w}
          version={false}
          rootWI={wiki} />
          
        <VersionKill id={w._id} />
        
        <FlowForm
          id={w._id}
          edit={false}
          existFlows={w.flows}
          options={a.trackOption}
          end={a.lastTrack} />
        
        <BatchForm
          batchId={false}
          batchNow='new'
          versionNow='new'
          start={false}
          end={false}
          widgetId={w._id}
          versions={w.versions}
          lock={!w.versions} />

        <Remove action='widget' title={w.widget} check={w.createdAt.toISOString()} entry={w._id} />
        <br />
      </div>
      </SlideDownWrap>
    );
  }
} 