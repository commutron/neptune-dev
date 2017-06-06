import React, {Component} from 'react';
import moment from 'moment';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';

export default class WidgetCard extends Component {

  render() {

    let g = this.props.groupData;
    let w = this.props.widgetData;
    let b = this.props.batchRelated;

    return (
      <SlideDownWrap>
        <div className='card'>
          <div className='space'>
            <h1 className='cap'>{g.alias}</h1>
            <h2 className='cap'>{w.widget}</h2>
            <h3 className='cap'>{w.describe}</h3>
            <hr />
            {b.map( (entry)=>{
              let ac = entry.active ? 'action clear greenT' : null;
              return (
                <span key={entry._id}>
                  <JumpFind title={entry.batch} sub='' sty={ac} />
                </span>
              )})}
            <hr />
            
            <div>
            
            {w.versions.map( (entry)=>{
              return(
                <ul key={entry.versionKey}>
                  <li>version: {entry.version}</li>
                  <li>created at: {moment(entry.createdAt).calendar()}</li>
                  <li>live: {entry.live.toString()}</li>
                  <li>tags: {entry.tags.length}</li>
                  <li><NoteLine entry={entry.notes} id={w._id} versionKey={entry.versionKey} /></li>
                </ul>
              )})}
          
            </div>
  
          </div>
        </div>
      </SlideDownWrap>
    );
  }
}