import React from 'react';
import moment from 'moment';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import NoteForm from '../forms/NoteForm';


const NoteLine = ({ action, id, versionKey, entry, plain, lgIcon })=> {

  let dt = entry;
  const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
  const dateStr = (date)=> moment(date).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"});
  
  const insertForm = !id || !auth ? null : 
          <NoteForm
            action={action}
            id={id}
            versionKey={versionKey}
            content={dt.content}
            lgIcon={lgIcon} />;
  
  if(plain && !dt.content) {
    return insertForm;
  }
    
  if(plain) {
    return (
      <div className='noteCard'>
        {dt.content}
        <div className='footerBar'>
          {insertForm}
          <i>{dateStr(dt.time)} - <UserNice id={dt.who} /></i>
        </div>
      </div>
    );
  }
    
  if(!dt.content) {
    return (
      <fieldset className='noteCard'>
        <legend className='cap'>notes</legend>
        {insertForm}
      </fieldset>
    );
  }
    
  return (
    <fieldset className='noteCard'>
      <legend className='cap'>notes</legend>
      {dt.content}
      <div className='footerBar'>
        {insertForm}
        <i>{dateStr(dt.time)} - <UserNice id={dt.who} /></i>
      </div>
    </fieldset>
  );
};

export default NoteLine;