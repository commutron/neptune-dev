import { useRef, useEffect } from 'react';

export default function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function useOldNumber(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef(0);
  
  // Store current value in ref
  useEffect(() => {
    // console.log('old number: ' + value);
    // console.log('old ref: ' + ref.current);
    if(value > ref.current) {
      ref.current = value;
    }
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}