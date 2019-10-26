import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import { AnonyUser } from '/client/components/smallUi/UserNice.jsx';

const TimeBlocksRaw = ({ batch, tide, clientTZ })=> (
  <dl className='numFont'>
  {!tide ?
    <p className='centreText'>start/stop not enabled</p>
    :
    tide.map( (mov, index)=>{
      return(
        <RawBlock key={index} tB={mov} batch={batch} clientTZ={clientTZ} />
    )})}
  </dl>
);

export default TimeBlocksRaw;



const RawBlock = ({ tB, batch, clientTZ })=> {
  
  const [ phGuess, setGuess ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('phaseBestGuess', tB.who, batch, tB.startTime, tB.stopTime, clientTZ,
    (err, asw)=>{
      err && console.log(err);
      if(asw) {
        setGuess(asw);
      }
    });
  }, []);
  
  const mStart = moment(tB.startTime);
  const mStop = tB.stopTime ? moment(tB.stopTime) : moment();
  
  return(
    <p title={tB.tKey}>
        <AnonyUser id={tB.who} />
        - {mStart.format('YYYY/MM/DD-kk:mm')}
        -to-{mStop.format('YYYY/MM/DD-kk:mm')}
        - {Math.round( moment.duration(mStop.diff(mStart)).asMinutes() )} minutes
        - {phGuess ? `${phGuess[1].join(', ')} (${phGuess[0]})` : '....'}
    </p>
  );
};