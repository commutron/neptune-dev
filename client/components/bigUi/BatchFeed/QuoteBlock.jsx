import React from 'react';
import moment from 'moment';
import '/client/components/bigUi/ItemFeed/style.css';

const QuoteBlock = ({ dt, cal })=>{

  const hoursDur = moment.duration(dt.timeAsMinutes, "minutes")
                    .asHours().toFixed(2, 10);
  
  return(
    <n-feed-info-block class='alterEvent'>
      <n-feed-left-anchor>
        <i className="fas fa-hourglass-start fa-lg fa-fw"></i>
      </n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title class='cap'>  
          <span>Quote Time set to {hoursDur} hours</span>
          <span>({dt.timeAsMinutes} minutes)</span>
          <span></span>
          <span>{cal(dt.updatedAt)}</span>
        </n-feed-info-title>
      </n-feed-info-center>
      <n-feed-right-anchor></n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default QuoteBlock;