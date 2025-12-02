import React, {useState, useEffect, useLayoutEffect, useRef, Fragment} from 'react';
import { Duration, DateTime } from 'luxon';
import moment from 'moment';
import Pref from '/public/pref.js';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const ClockString = ({ doThing })=> {
  const fstring = "MMM d, h:mm:ss a";
  
  const [ chill ] = useState(Roles.userIsInRole(Meteor.userId(), 'readOnly'));
  
  const [ clockTime, clockTimeSet ] = useState( DateTime.now().toFormat(fstring) );
  const [ tickingTime, tickingTimeSet ] = useState( Duration.fromObject({}) );

  useInterval( ()=> {
    clockTimeSet( DateTime.now().toFormat(fstring) );
    tickingTimeSet( tickingTime => tickingTime.plus({ seconds: 1}) );
    
    if(doThing && tickingTime.as('minutes') > (chill ? Pref.noiseChill : Pref.noiseUpdate)) {
      tickingTimeSet( Duration.fromObject() );
      doThing(); }
  },1000);
      
  return(
    <Fragment>
      <span className='grayT'>Updated {tickingTime.toHuman()} ago</span>
      <span className='grayT'>{clockTime}</span>
    </Fragment>
  );
};

export default ClockString;

export const CountDownNum = ({ dur, peers })=> {
  
  const [ tick, tickingSet ] = useState( Duration.fromObject({}) );
  useLayoutEffect( ()=> { tickingSet( Duration.fromObject({ seconds: dur }) ) }, [dur]);
  
  useInterval( ()=> {
    tickingSet( tick => tick.minus({ seconds: isNaN(peers) ? 1 : peers }));
  },1000);
  
  return(
    <n-num 
      data-tip={`${peers} people on this task`}
      class='liteTip'
    >{tick.toFormat('h:mm:ss')}</n-num>
  );
};

// export const TimeString = (num, unit)=> {
//   let dur = Duration.fromObject({ [unit]: num });
//   let str = dur.toFormat(num > 60 ? 'h:mm:ss' : 'm:ss');
//   let hum = dur.toHuman({ listStyle: "long", showZeros: true });
//   return <n-num data-tip={hum} class='liteTip'>{str}</n-num>;
// };
export const TimeString = (num, unit)=> {
  let dur = moment.duration(num, unit);
  let str = num > 60 ? `${dur.hours()}:${(dur.minutes()).toString().padStart(2, 0)}:${dur.seconds().toString().padStart(2, 0)}` : `${dur.minutes().toString().padStart(2, 0)}:${dur.seconds()}`;
  let hum = dur.humanize();
  return <n-num data-tip={hum} class='liteTip'>{str}</n-num>;
};