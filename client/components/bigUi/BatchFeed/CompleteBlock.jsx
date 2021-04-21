import React from 'react';
import '/client/components/bigUi/ItemFeedX/style.css';

const CompleteBlock = ({ title, datetime, cal })=> (
  <n-feed-info-block class='finish'>
    <n-feed-left-anchor>
      <i className="fas fa-flag-checkered fa-lg fa-fw"></i>
    </n-feed-left-anchor>
    <n-feed-info-center>
      <n-feed-info-title class='cap'>
        <span>{title}</span>
        <span></span>
        <span>{cal(datetime)}</span>
      </n-feed-info-title>
    </n-feed-info-center>
    <n-feed-right-anchor></n-feed-right-anchor>
  </n-feed-info-block>
);

export default CompleteBlock;