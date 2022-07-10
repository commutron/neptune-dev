import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

const PartialCard = ({ orb })=> {
  
  const [ lookup, lookupSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('proLookupPartial', orb, (err, re)=>{
      err && console.log(err);
      if(re) {
        const reS = re.sort((a,b)=> a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
        lookupSet(reS);
      }
    });
  }, []);
  
  return(
    <div className='centre pop vmargin space min200 max875'>
      <p className='med wide bottomLine'>Possible {Pref.xBatch} matches</p>
      <div className='centreRow vmarginhalf'>
      {!lookup ? <em>...</em>
      : lookup.length > 0 ?
        lookup.map( (e, ix)=>(
          <button 
            key={ix}
            className='action whiteSolid margin5'
            onClick={()=>Session.set('now', e[0])}
          >{e[0]} - {e[1].join(" ")}</button>
        ))
      : <p className='centreText'>No Partial Matches Found</p>
      }
    </div>
   </div>
  );
};

export default PartialCard;