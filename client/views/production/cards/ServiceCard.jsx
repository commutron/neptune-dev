import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

const ServiceCard = ({ equipData })=> {
  
  // const [ lookup, lookupSet ] = useState(false);
  
  // useEffect( ()=>{
  //   Meteor.call('proLookupPartial', orb, (err, re)=>{
  //     err && console.log(err);
  //     if(re) {
  //       const reS = re.sort((a,b)=> a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
  //       lookupSet(reS);
  //     }
  //   });
  // }, []);
  
  return(
    <div className='centre pop vmargin space min200 max875'>
      <p className='med wide bottomLine cap'>{Pref.equip}</p>
      <div className='centreRow vmarginhalf'>
      {equipData.map( (e, ix)=>(
          <button 
            key={ix}
            className='action whiteSolid margin5'
            onClick={()=>Session.set('now', e[0])}
          >{e.alias}</button>
        ))
      }
    </div>
   </div>
  );
};

export default ServiceCard;