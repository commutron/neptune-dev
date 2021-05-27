import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';


const RevolvingPINCheck = ({ isAdmin, isPeopleSuper })=> {
  
  const [ result, resultSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('revealPIN', (err, reply)=>{
      err && console.log(err);
      if(reply) {
        resultSet(reply);
      }
    });
  }, []);
  
  if(!isAdmin && !isPeopleSuper) {
    return(
      <div className='centre centreText space5x5'>
        <h3>ADMIN or PEOPLESUPER Access Is Required</h3>
      </div>
    );
  }
  
  return(
    <div className='centre centreText space5x5'>
      <h3>Org PIN for {moment().format('dddd MMMM Do YYYY')}</h3>
      <p>Automatically Changes Daily</p>
      <div className='hiddenPrime showOnHover'>
        <i className='hiddenPIN numFont noCopy'>{result ? result  : '0000'}</i>
      </div>
      <p>Hover within to reveal</p>
    </div>
  );
};

export default RevolvingPINCheck;