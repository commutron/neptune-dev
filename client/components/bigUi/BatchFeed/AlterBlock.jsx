import React from 'react';
import moment from 'moment';
// import timezone from 'moment-timezone';
// import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeedX/style.css';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const AlterBlock = ({ dt, cal })=> {
  
  const toDate = (val)=> typeof(val) == 'object' && moment(val).isValid() ? moment(val).format('MMM D YYYY, h:mm a') : val;
  
  return(
    <n-feed-info-block class='alterEvent'>
      <n-feed-left-anchor>
        <i className="fa-solid fa-eraser fa-lg fa-fw"></i>
      </n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title>      
          <span>Altered: <em className='clean'>"{dt.changeKey}"</em></span>
          <span>for {dt.changeReason}</span>
          <span><UserNice id={dt.changeWho} /></span>
          <span>{cal(dt.changeDate)}</span>
        </n-feed-info-title>
          
        <dd>{toDate(dt.oldValue)} <i className="fas fa-arrow-right fa-fw"></i> {toDate(dt.newValue)}</dd>
      </n-feed-info-center>
      <n-feed-right-anchor></n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default AlterBlock;