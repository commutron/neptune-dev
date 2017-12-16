import React from 'react';
import moment from 'moment';
import UserNice from './UserNice.jsx';

const ScrapBox = ({ entry })=> (
  <div className='actionBox red'>
    <div className='titleBar centre'>
      <h1 className='up'>{entry.type}</h1>
    </div>
    <div className='centre'>
      <p>{moment(entry.time).calendar()}</p>
      <p>by: <UserNice id={entry.who} />, at step: {entry.step}</p>
      <p className='capFL'>{entry.comm}</p>
      <br />
    </div>
  </div>
);

export default ScrapBox;