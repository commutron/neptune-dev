import React, { Fragment, useState, useEffect } from 'react';

const PartialCard = ({ orb })=> {
  
  const [ lookup, lookupSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('proLookupPartial', orb, (err, re)=>{
      err && console.log(err);
      if(re) {
        const reS = re.sort((a,b)=> a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
        lookupSet(reS);
        if(reS.length === 1) {
          Meteor.setTimeout(()=> Session.set('now', reS[0][0]), 500);
        }
      }
    });
  }, [orb]);
  
  return(
    <div className='centre bottomLine borderGray vmarginhalf spacehalf min200 max600'>
      {!lookup ? <em>...</em> :
        lookup.length === 1 ? <em>~ Partial Match Auto Redirect ~</em> :
        lookup.length === 0 ? null :
        <Fragment>
          <p className='med wide centreText bottomLine borderGray'>Possible partial matches</p>
          <div className='vmarginquarter'>
            {lookup.map( (e, ix)=>(
              <button 
                key={ix}
                className='action whiteSolid margin5 spacehalf'
                onClick={()=>Session.set('now', e[0])}
              >{e[0]} {e[1] && " - "+e[1].join(" ")}</button>
            ))}
          </div>
        </Fragment>
      }
   </div>
  );
};

export default PartialCard;