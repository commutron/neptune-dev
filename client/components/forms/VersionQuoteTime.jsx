import React from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

// Cleanup Function - Limited Use

export const VersionQuoteTimeClear = ({ wID, vKey })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const downgradeQuoteTime = ()=> {
    if(auth) {
      Meteor.call('clearQuoteTime', wID, vKey, (error)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };
  
  return(
    <label>
      <button
        type='submit'
        className='action greenHover'
        onClick={(e)=>downgradeQuoteTime(e)}
        disabled={!auth}
      >Clear Quote Times</button>
    </label>
  );
};