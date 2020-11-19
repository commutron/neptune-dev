import React, {useState, useEffect, useRef, Fragment} from 'react';
import moment from 'moment';
// import 'moment-timezone';


function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
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

const ClockString = ({ loadTime, doThing })=> {
  // var options = {
  //   month: 'short',
  //   day: 'long',
  //   hour: 'numeric',
  //   minute: '2-digit',
  //   second: '2-digit'
  // };
  // new Date().toLocaleTimeString('en-CA', options) );
  const fstring = "MMM Do, h:mm:ss a";
  
  const [ clockTime, clockTimeSet ] = useState( moment().format(fstring) );
  const [ tickingTime, tickingTimeSet ] = useState( moment.duration() );

  useInterval( ()=> {
    clockTimeSet( moment().format(fstring) );
    tickingTimeSet( tickingTime => tickingTime.add(1, 's') );
    
    if(doThing && tickingTime.asMinutes() > 10) { 
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