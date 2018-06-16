import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
//import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
//import UserName from '/client/components/uUi/UserName.jsx';

const FloorRelease = ({ id })=> {
  
  function handleRelease(e) {
    e.preventDefault();
    const date = e.target.rdate.value;
    const time = e.target.rtime.value;
    const datetime = date + 'T' + time;
    Meteor.call('releaseToFloor', id, datetime, (err)=>{
      if(err)
        console.log(err);
    });
  }
  let sty = {
    padding: '10px',
    borderWidth: '3px'
  };
  
  return(
    <div className='wide actionBox greenBorder' style={sty}>
      <form onSubmit={(e)=>handleRelease(e)} className='centre listSortInput'>
        <p className='centreText big cap greenT'>Release {Pref.batch} to the floor</p>
        <input
          type='date'
          id='rdate'
          defaultValue={moment().format('YYYY-MM-DD')}
          required />
        <input
          type='time'
          id='rtime'
          defaultValue={moment().format('hh:mm')}
          required />
        <br />
        <button
          type='submit'
          title={`Release ${Pref.batch} to the floor`}
          className='roundActionIcon dbblRound clearGreen cap'
          style={sty}
          disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
        ><i className='fas fa-play fa-2x'></i></button>
      </form>
    </div>
  );
};
  
export default FloorRelease;