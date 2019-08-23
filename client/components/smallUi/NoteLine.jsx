import React from 'react';
import moment from 'moment';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import NoteForm from '../forms/NoteForm';

// requires data
// entry of map as props.entry
// order or customer ID as props.id
// false or product as props.widgetKey

//<NoteLine entry={version.notes} id={w._id} versionKey={w.versionKey} />

const NoteLine = (props)=> {

  let dt = props.entry;
  const action = props.id && Roles.userIsInRole(Meteor.userId(), ['edit', 'run']) ? 
                 <NoteForm
                   id={props.id}
                   versionKey={props.versionKey}
                   content={dt.content}
                   xBatch={props.xBatch}
                   small={true} /> : 
                 null;
  
  if(props.plain && !dt.content) {
    return (
      <div className='noteCard'>
        {action}
      </div>
    );
  }
    
  if(props.plain) {
    return (
      <div className='noteCard'>
        {dt.content}
        <div className='footerBar'>
          {action}
          <i>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"})} - <UserNice id={dt.who} /></i>
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
        <i>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"})} - <UserNice id={dt.who} /></i>
      </div>
    </fieldset>
  );
};

export default NoteLine;