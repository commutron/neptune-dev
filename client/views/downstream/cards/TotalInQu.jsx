import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
// import Pref from '/client/global/pref.js';

const TotalInQu = ({ ////////////  NO LONGER USES HOT ENOUGH DATA \\\\\\\\\\\
  traceDT,
  app, isNightly
})=> {
 
  const unfinTrace = traceDT.filter( t => t.completed === false );
  
  const [ numState, numSet ] = useState(false);
  
  function inHours(minNum) {
    return moment.duration(minNum, "minutes").asHours().toFixed(2, 10);
  }
  
  function reduceCacheTo(objArray) {
    const q2tArr = Array.from(objArray, x => 
                      typeof x.quote2tide === 'number' && x.quote2tide );
    const q2tTotal = q2tArr.reduce( (arr, x)=> !isNaN(x) && x > 0 ? arr + x : arr, 0 );
    const totalMin = Math.round(q2tTotal);
    
    return totalMin;              
  }
    
  useEffect( ()=> {
    
    let kitTime = [];
    let openTime = [];
    for( let pB of unfinTrace ) {
      if(!pB) {
        null;
      }else{
        if(!pB.onFloor) {
          kitTime.push(pB);
        }else{
          openTime.push(pB);
        }
      }
    }
    
    const liveMinutes = reduceCacheTo(unfinTrace);
    const liveHours = inHours(liveMinutes);
    
    const kitMinutes = reduceCacheTo(kitTime);
    const kitHours = inHours(kitMinutes);
    
    const openMinutes = reduceCacheTo(openTime);
    const openHours = inHours(openMinutes);
    
    numSet([
      ['All Live', liveMinutes, liveHours],
      ['In Kitting', kitMinutes, kitHours],
      ['Released', openMinutes, openHours],
    ]);
  }, [traceDT, app]);

  return(
    <div className='max400 space line2x'>
      <h3>Bulk Time</h3>
      <dl>
      {!numState ? '...' :
        numState.map( (entry, index)=>{
        return(
        <Fragment key={index}>
          <dt>{entry[0]}: {entry[1]} minutes</dt>
          <dd>({entry[2]} hours)</dd>
        </Fragment>
        );
      })}
      </dl>
    </div>
  );
};

export default TotalInQu;