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

const NoteLine = ({ id, versionKey, xBatch, entry, plain })=> {

  let dt = entry;
  const action = id && Roles.userIsInRole(Meteor.userId(), ['edit', 'run']) ? 
                 <NoteForm
                   id={id}
                   versionKey={versionKey}
                   content={dt.content}
                   xBatch={xBatch}
                   small={true} /> : 
                 null;
  
  if(plain && !dt.content) {
    return (
      <div className='noteCard'>
        {action}
      </div>
    );
  }
    
  if(plain) {
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
      <fieldset className='noteCard'>
        <legend className='cap'>notes</legend>
        {action}
      </fieldset>
    );
  }
    
  return (
    <fieldset className='noteCard'>
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