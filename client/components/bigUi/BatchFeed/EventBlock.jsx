import React from 'react';
import '/client/components/bigUi/ItemFeedX/style.css';

const EventBlock = ({ dt, cal })=> (
  <n-feed-info-block class='genericEvent'>
    <n-feed-left-anchor>
      <i className="far fa-calendar-plus fa-lg fa-fw"></i>
    </n-feed-left-anchor>
    <n-feed-info-center>
      <n-feed-info-title class='cap'>  
        <span>{dt.title}</span>
        <span>{dt.detail}</span>
        <span></span>
        <span>{cal(dt.time)}</span>
      </n-feed-info-title>
    </n-feed-info-center>
    <n-feed-right-anchor></n-feed-right-anchor>
  </n-feed-info-block>
);

export default EventBlock;