import React from 'react';
import '/client/components/bigUi/ItemFeedX/style.css';

const EventBlock = ({ dt, cal })=> {
  const icon = dt.title === 'Start of Process' ? 'play-circle' :
               dt.title === 'End of Process' ? 'stop-circle' : 
               'dot-circle';
  return(
    <n-feed-info-block class='evEvent'>
      <n-feed-left-anchor>
        <i className={`fas fa-${icon} fa-lg fa-fw`}></i>
      </n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title class='cap'>  
          <span>{dt.title}</span>
          <span>{dt.detail}</span>
          <span></span>
          <span>{cal(dt.time)}</span>
        </n-feed-info-title>
        
        {dt.sub && <dd className='small'>{dt.sub}</dd>}
      </n-feed-info-center>
      <n-feed-right-anchor></n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default EventBlock;