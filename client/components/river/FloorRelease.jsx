import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

const FloorRelease = ({ id })=> {
  
  function handleRelease() {
    Meteor.call('releaseToFloor', id, (err)=>{
      if(err)
        console.log(err);
    });
  }
  let sty = {
    padding: '10px',
    borderWidth: '3px'
  };
  
  return(
    <div className='wide centre'>
      <p>
        <button
          title={`Release ${Pref.batch} to the floor`}
          className='action medBig clearGreen cap'
          style={sty}
          onClick={()=>handleRelease()}
          disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
        ><i className='fas fa-play fa-2x fa-fw'></i>
        <br />Release {Pref.batch} to the floor</button>
      </p>
    </div>
  );
};
  
export default FloorRelease;