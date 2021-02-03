import { useRef, useEffect } from 'react';

export default function useTimeOut(callback, delay) {
  
  const thingMounted = useRef(true);
  
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
  	//Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({delay});
  	
    function tick() {
      if(thingMounted.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = Meteor.setTimeout(tick, delay);
      return () => {
        Meteor.clearTimeout(id);
        thingMounted.current = false;
      };
    }
  }, [delay]);
  
}