import React from 'react';
import moment from 'moment';
import { AnonyUser } from '/client/components/smallUi/UserNice.jsx';

const TimeBlocksRaw = ({ tide })=>(
  <ul className='numFont'>
  {!tide ?
    <p className='centreText'>start/stop not enabled</p>
    :
    tide.map( (mov, index)=>{
      const mStart = moment(mov.startTime);
      const mStop = mov.stopTime ? moment(mov.stopTime) : moment();
      return(
        <li key={index} title={mov.tKey}>
          <AnonyUser id={mov.who} />
          - {moment(mStart).format()}
          - {moment(mStop).format()}
          - {Math.round( moment.duration(mStop.diff(mStart)).asMinutes() )} minutes
        </li>
    )})}
  </ul>
);

export default TimeBlocksRaw;