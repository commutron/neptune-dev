import React, {useState, useEffect, useRef, Fragment} from 'react';
import moment from 'moment';


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

const ClockString = ({ loadTime, doThing })=> {
  const fstring = "MMM Do, h:mm:ss a";
  
  const [ chill ] = useState(Roles.userIsInRole(Meteor.userId(), 'readOnly'));
  
  const [ clockTime, clockTimeSet ] = useState( moment().format(fstring) );
  const [ tickingTime, tickingTimeSet ] = useState( moment.duration() );

  useInterval( ()=> {
    clockTimeSet( moment().format(fstring) );
    tickingTimeSet( tickingTime => tickingTime.add(1, 's') );
    
    if(doThing && tickingTime.asMinutes() > (chill ? 30 : 15)) {
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