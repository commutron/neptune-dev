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

// const ClockString = ({ doThing })=> {
//   const fstring = "MMM d, h:mm:ss a";
  
//   const [ chill ] = useState(Roles.userIsInRole(Meteor.userId(), 'readOnly'));
  
//   const [ clockTime, clockTimeSet ] = useState( DateTime.now().toFormat(fstring) );
//   const [ tickingTime, tickingTimeSet ] = useState( Duration.fromObject({}) );

//   useInterval( ()=> {
//     clockTimeSet( DateTime.now().toFormat(fstring) );
//     tickingTimeSet( tickingTime => tickingTime.plus({ seconds: 1}) );
    
//     if(doThing && tickingTime.as('minutes') > (chill ? Pref.noiseChill : Pref.noiseUpdate)) {
//       tickingTimeSet( Duration.fromObject() );
//       doThing(); }
//   },1000);
      
//   return(
//     <Fragment>
//       <span className='grayT'>Updated {tickingTime.toHuman()} ago</span>
//       <span className='grayT'>{clockTime}</span>
//     </Fragment>
//   );
// };
const ClockString = ({ doThing })=> {
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
  let dur = Duration.fromObject({ 'minutes': 95 });
  let str = dur.toFormat('h:mm:ss');
  let hum = dur.toHuman({ listStyle: "long", showZeros: true });
  
  let nowtime = DateTime.now();
  return(
    <ul>
      <li><n-num>{str}</n-num></li>
      <li><n-num>{hum}</n-num></li>
      <li><n-num>{nowtime.toFormat("MMM d, h:mm:ss a")}</n-num></li>
      <li><n-num>{nowtime.toString()}</n-num></li>
      <li><n-num>{nowtime.toLocaleString()}</n-num></li>
    </ul>
  );
};