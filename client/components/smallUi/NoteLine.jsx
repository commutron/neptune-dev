import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';
import NoteForm from '../forms/NoteForm';

// requires data
// entry of map as props.entry
// order or customer ID as props.id
// false or product as props.widgetKey

//<NoteLine entry={version.notes} id={w._id} versionKey={w.versionKey} />

export default class NoteLine extends Component	{

  render() {

    let dt = this.props.entry;
    let name = this.props.versionKey ? Pref.widget : Pref.batch;
    const action = this.props.id && Roles.userIsInRole(Meteor.userId(), ['edit', 'run']) ? 
                   <NoteForm
                     id={this.props.id}
                     versionKey={this.props.versionKey}
                     content={dt.content}
                     small={this.props.small} /> : 
                   null;
    
    if(this.props.plain && !dt.content) {
      return (
        <div>
          {action}
        </div>
      );
    }
    
    if(this.props.plain) {
      return (
        <div>
          {dt.content}
          <div className='footerBar'>
            {action}
            {moment(dt.time).calendar()} <UserNice id={dt.who} />
          </div>
        </div>
      );
    }
    
    if(!dt.content) {
      return (
        <fieldset className='low'>
          <legend className='cap'>{name} notes</legend>
          {action}
        </fieldset>
      );
    }
    
    return (
      <fieldset className='low'>
        <legend className='cap'>{name} notes</legend>
        {dt.content}
        <div className='footerBar'>
          {action}
          {moment(dt.time).calendar()} <UserNice id={dt.who} />
        </div>
      </fieldset>
    );
  }
}