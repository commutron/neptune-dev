import React from 'react';
import moment from 'moment';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const NoteLine = ({ action, id, versionKey, entry, plain, lgIcon })=> {

  let dt = entry;
  const dateStr = (date)=> moment(date).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm a"});
  
  if(plain && !dt.content) {
    return null;
  }
    
  if(plain) {
    return (
      <div className='noteCard'>
        {dt.content}
        <div className='footerBar'>
          <i>{dateStr(dt.time)} - <UserNice id={dt.who} /></i>
        </div>
      </div>
    );
  }
    
  if(!dt.content) {
    return (
      <fieldset className='noteCard'>
        <legend className='cap'>notes</legend>
      </fieldset>
    );
  }
    
  return (
    <fieldset className='noteCard'>
      <legend className='cap'>notes</legend>
      {dt.content}
      <div className='footerBar'>
        <i>{dateStr(dt.time)} - <UserNice id={dt.who} /></i>
      </div>
    </fieldset>
  );
};

export default NoteLine;