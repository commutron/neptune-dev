import React from 'react';
import Pref from '/client/global/pref.js';


const RapidClose = ({ rapidData, seriesId })=> {

  let lock = !Roles.userIsInRole(Meteor.userId(), ['qa', 'run']);
  
  function handleClose() {
    const rapId = rapidData._id;
    
    Meteor.call('setRapidClose', rapId, (error)=>{
      if(error)
        console.log(error);
    });
  }
  
  return(
    <div className='borderTeal endBox'>
      <p>Ready to Close</p>
      
      <button
      className='action medBig clearTeal'
        onClick={(e)=>handleClose(e)}
        title={lock ? 'Requires "Run" or "QA" access' : ''}
        disabled={lock}
      >Close
      </button>
    </div>
  );
};

export default RapidClose;