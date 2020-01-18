import { useRef, useEffect } from 'react';

export default function useTimeOut(callback, delay) {

  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
  	//Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({delay});
  	
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = Meteor.setTimeout(tick, delay);
      return () => Meteor.clearTimeout(id);
    }
  }, [delay]);
  
}