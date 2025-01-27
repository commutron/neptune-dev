import React from 'react';
import moment from 'moment';

import UserNice from '/client/components/smallUi/UserNice';
import StepBackX from '/client/components/bigUi/ItemFeedX/StepBackX';

const ScrapBlock = ({ seriesId, serial, entry, eX, isQA })=> (
  <div className='infoFeed'>
    <n-feed-info-block class={'red'}>
      <n-feed-left-anchor><i className='fa-solid fa-trash-can fa-lg'></i></n-feed-left-anchor>
      <n-feed-info-center class='nospace centreText'>
        <div className='titleBar up centreText biggest'>{entry.type}</div>
        <p>{moment(entry.time).calendar()}, by <UserNice id={entry.who} />, at step {entry.step}</p>
        {entry.comm && <p className='capFL max400'>{entry.comm}</p>}
      </n-feed-info-center>
      <n-feed-right-anchor>
        {eX && isQA ?
          <StepBackX
            seriesId={seriesId} 
            bar={serial} 
            entry={entry}
            label='Undo Scrap Entry'
            lock={!isQA} 
          />
        : null}
      </n-feed-right-anchor>
    </n-feed-info-block>
  </div>
);

export default ScrapBlock;