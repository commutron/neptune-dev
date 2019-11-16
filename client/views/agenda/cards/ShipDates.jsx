import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
//import Pref from '/client/global/pref.js';


const ShipDates = ({ pCache, app })=> {

  const [ orderedState, orderedSet ] = useState([]);
  
  useEffect( ()=>{
    if( Array.isArray(pCache) ) {
      let ordered = pCache.sort((p1, p2)=> {
        if (p1.shipTime < p2.shipTime) { return -1 }
        if (p1.shipTime > p2.shipTime) { return 1 }
        return 0;
      });
      orderedSet(ordered);
    }
  }, []);

  return(
    <div className='max500 space'>
      <h3>Ship Due Dates</h3>
      <h5>batch, ship</h5>
      <ol>
      {orderedState.map( (e, ix)=>{
        return(
          <li key={ix}>{e.batch} = {moment(e.shipTime).format('dd MMM DD')}</li>
      )})}
      </ol>
    </div>
  );
};

export default ShipDates;