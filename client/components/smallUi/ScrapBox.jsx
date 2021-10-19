import React from 'react';
import moment from 'moment';
import UserNice from './UserNice.jsx';

const ScrapBox = ({ id, serial, entry, eX })=> (
  <div className='actionBox scrapBanner red vgap'>
    <div className='titleBar centre'>
      <h1 className='up'>{entry.type}</h1>
    </div>
    <div className='centreText'>
      <p>{moment(entry.time).calendar()}</p>
      <p>by: <UserNice id={entry.who} />, at step: {entry.step}</p>
      <p className='capFL'>{entry.comm}</p>
      
    </div>
  </div>
);

export default ScrapBox;