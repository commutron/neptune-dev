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
  const dtstring = {
    month: 'short', 
    day: 'numeric',
    hour: 'numeric', 
    minute: '2-digit', 
    // second: '2-digit', 
  };
  
  const [ chill ] = useState(Roles.userIsInRole(Meteor.userId(), 'readOnly'));
  
  const [ clockTime, clockTimeSet ] = useState( DateTime.now().toLocaleString(dtstring) );
  const [ tickingTime, tickingTimeSet ] = useState( Duration.fromObject({}) );

  useInterval( ()=> {
    clockTimeSet( DateTime.now().toLocaleString(dtstring) );
    tickingTimeSet( tickingTime => tickingTime.plus({ seconds: 1}) );
    
    if(doThing && tickingTime.as('minutes') > (chill ? Pref.noiseChill : Pref.noiseUpdate)) {
      tickingTimeSet( Duration.fromObject() );
      doThing(); }
  },1000);
      
  return(
    <Fragment>
      <span className='grayT'>Updated {tickingTime.shiftTo('minutes', 'seconds').toHuman({ showZeros: false })} ago</span>
      <span className='grayT'>{clockTime}</span>
    </Fragment>
  );
};

const ClockStringFallback = ({ doThing })=> {
  const fstring = "MMM d, h:mm:ss a";
  
  const [ chill ] = useState(Roles.userIsInRole(Meteor.userId(), 'readOnly'));
  
  const [ clockTime, clockTimeSet ] = useState( moment().format(fstring) );
  const [ tickingTime, tickingTimeSet ] = useState( moment.duration() );

  useInterval( ()=> {
    clockTimeSet( moment().format(fstring) );
    tickingTimeSet( tickingTime => tickingTime.add(1, 'seconds') );
    
    if(doThing && tickingTime.asMinutes() > (chill ? Pref.noiseChill : Pref.noiseUpdate)) {
      tickingTimeSet( moment.duration() );
      doThing(); }
  },1000);
      
  return(
    <Fragment>
      <span className='grayT'>Updated {tickingTime.humanize()} ago</span>
      <span className='grayT'>{clockTime}</span>
    </Fragment>
  );
};

export default ClockString;

// export const CountDownNum = ({ dur, peers })=> {
  
//   const [ tick, tickingSet ] = useState( Duration.fromObject({}) );
//   useLayoutEffect( ()=> { tickingSet( Duration.fromObject({ seconds: dur }) ) }, [dur]);
  
//   useInterval( ()=> {
//     tickingSet( tick => tick.minus({ seconds: isNaN(peers) ? 1 : peers }));
//   },1000);
  
//   return(
//     <n-num 
//       data-tip={`${peers} people on this task`}
//       class='liteTip'
//     >{tick.toFormat('h:mm:ss')}</n-num>
//   );
// };
export const CountDownNum = ({ dur, peers })=> {
  
  const [ tick, tickingSet ] = useState( moment.duration() );
  const [ int, intSet ] = useState( 0 );
  useLayoutEffect( ()=> { tickingSet( moment.duration(dur, 'seconds') ) }, [dur]);
  
  useInterval( ()=> {
    tickingSet( tick => tick.subtract( (isNaN(peers) ? 1 : peers), 'seconds') );
    intSet( int => int + 1 ); // so it detects the change
  },1000);
    
  return(
    <n-num 
      data-tip={`${peers} people on this task`}
      class='liteTip'
    >{`${tick.hours()}:${(tick.minutes()).toString().padStart(2, 0)}:${tick.seconds().toString().padStart(2, 0)}`}</n-num>
  );
};

// export const LuxonTimeString = (num, unit)=> {
//   let dur = Duration.fromObject({ [unit]: num });
//   let str = dur.toFormat(num > 60 ? 'h:mm:ss' : 'm:ss');
//   let hum = dur.toHuman({ listStyle: "long", showZeros: true });
//   return <n-num data-tip={hum} class='liteTip'>{str}</n-num>;
// };
export const TimeString = (num, unit)=> {
  let dur = moment.duration(num, unit);
  let str = num > 60 ? 
    `${dur.hours()}:${(dur.minutes()).toString().padStart(2, 0)}:${dur.seconds().toString().padStart(2, 0)}` : 
    `${dur.minutes().toString().padStart(2, 0)}:${dur.seconds().toString().padStart(2, 0)}`;
  let hum = dur.humanize();
  return <n-num data-tip={hum} class='liteTip'>{str}</n-num>;
};

export const LuxonTestString = ()=> {
  let dur = Duration.fromObject({ 'minutes': -95 });
  // let str = dur.toFormat('h:mm:ss',{ signMode: "negativeLargestOnly" });
  let hum = dur.toHuman({ listStyle: "long", showZeros: true });
  let shftH = dur.shiftTo('hours','minutes','seconds').toHuman({ listStyle: "short", showZeros: false });
  
  let nowtime = DateTime.now();
  
  let datetimecustom = {
    month: 'short', 
    day: 'numeric',
    hour: 'numeric', 
    minute: '2-digit', 
    second: '2-digit', 
  };
    
  return(
    <ul>
      <li><n-num>dur toHuman: {hum}</n-num></li>
      <li><n-num>dur toCustom Human: {shftH}</n-num></li>
      <br />
      
      <br />
      <li><n-num>now toLocaleString Default: {nowtime.toLocaleString()}</n-num></li>
      <li><n-num>now toLocaleString Preset: {nowtime.toLocaleString("DATETIME_MED_WITH_SECONDS")}</n-num></li>
      
      <br />
      <li><n-num>now toLocaleString datetime: {nowtime.toLocaleString(datetimecustom)}</n-num></li>
    
    </ul>
  );
};