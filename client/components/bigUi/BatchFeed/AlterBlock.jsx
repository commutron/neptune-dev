import React from 'react';
import '/client/components/bigUi/ItemFeedX/style.css';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const AlterBlock = ({ dt, cal })=> (
  <n-feed-info-block class='alterEvent'>
    <n-feed-left-anchor>
      <i className="fas fa-eraser fa-lg fa-fw"></i>
    </n-feed-left-anchor>
    <n-feed-info-center>
      <n-feed-info-title>      
        <span>Altered: <em className='clean'>"{dt.changeKey}"</em></span>
        <span>for {dt.changeReason}</span>
        <span></span>
        <span><UserNice id={dt.changeWho} /></span>
        <span>{cal(dt.changeDate)}</span>
      </n-feed-info-title>
        
      <dd>{dt.oldValue.toLocaleString()} <i className="fas fa-arrow-right fa-fw"></i> {dt.newValue.toLocaleString()}</dd>
    </n-feed-info-center>
    <n-feed-right-anchor></n-feed-right-anchor>
  </n-feed-info-block>
);

export default AlterBlock;