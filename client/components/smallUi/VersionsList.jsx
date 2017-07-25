import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';

import VersionForm from '../forms/VersionForm.jsx';
import {VersionRemove} from '../forms/VersionForm.jsx';
import NoteLine from './NoteLine.jsx';

export default class WidgetPanel extends Component	{

  render() {
    
    const w = this.props.widgetData;
    
    return(
      <div>
        {w.versions.map( (entry)=>{
            return(
              <ul key={entry.versionKey}>
                <li>version: {entry.version}</li>
                <li>created: {moment(entry.createdAt).calendar()} by <UserNice id={entry.createdWho} /></li>
                <li>{Pref.live}: {entry.live.toString()}</li>
                <li>tags: {entry.tags.length}</li>
                <li>wiki address: <a className='low' href={entry.wiki} target='_blank'>{entry.wiki}</a></li>
                <li>{Pref.unit} per item: {entry.units}</li>
                <li>components: {entry.assembly.length}</li>
                <li><NoteLine entry={entry.notes} id={w._id} versionKey={entry.versionKey} /></li>
                <li><VersionForm widgetData={w} version={entry} rootWI={entry.wiki} /></li>
                <li><VersionRemove widgetId={w._id} versionKey={entry.versionKey} lock={entry.createdAt.toISOString()} /></li>
              </ul>
            )})}
      </div>
      
      
    );
  }
}