import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserName from '/client/components/uUi/UserName.jsx';
import NoteForm from '../forms/NoteForm';

// requires data
// entry of map as props.entry
// order or customer ID as props.id
// false or product as props.widgetKey

//<NoteLine entry={version.notes} id={w._id} versionKey={w.versionKey} />

export default class NoteLine extends Component	{

  render() {

    let dt = this.props.entry;
    const action = this.props.id && Roles.userIsInRole(Meteor.userId(), ['edit', 'run']) ? 
                   <NoteForm
                     id={this.props.id}
                     versionKey={this.props.versionKey}
                     content={dt.content}
                     xBatch={this.props.xBatch}
                     small={true} /> : 
                   null;
    
    if(this.props.plain && !dt.content) {
      return (
        <div className='noteCard'>
          {action}
        </div>
      );
    }
    
    if(this.props.plain) {
      return (
        <div className='noteCard'>
          {dt.content}
          <div className='footerBar'>
            {action}
            <i>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"})} - <UserName id={dt.who} /></i>
          </div>
        </div>
      );
    }
    
    if(!dt.content) {
      return (
        <fieldset className='noteCard low'>
          <legend className='cap'>notes</legend>
          {action}
        </fieldset>
      );
    }
    
    return (
      <fieldset className='noteCard low'>
        <legend className='cap'>notes</legend>
        {dt.content}
        <div className='footerBar'>
          {action}
          <i>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"})} - <UserName id={dt.who} /></i>
        </div>
      </fieldset>
    );
  }
}