import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
//import Pref from '/client/global/pref.js';



const PriorityList = ({ pCache, app })=> {

  const [ orderedState, orderedSet ] = useState([]);
  
  useEffect( ()=>{
    if( Array.isArray(pCache) ) {
      let ordered = pCache.sort((p1, p2)=> {
        if (p1.estEnd2fillBuffer < p2.estEnd2fillBuffer) { return -1 }
        if (p1.estEnd2fillBuffer > p2.estEnd2fillBuffer) { return 1 }
        return 0;
      });
      orderedSet(ordered);
    }
  }, []);

  return(
    <div className='max500 space'>
      <h3>Priority List</h3>
      <h5>batch, bffr, remain</h5>
      <ol>
      {orderedState.map( (e, ix)=>{
        return(
          <li key={ix}>{e.batch} = {e.estEnd2fillBuffer.toFixed(2, 10)} / {e.quote2tide} min</li>
      )})}
      </ol>
    </div>
  );
};

export default PriorityList;