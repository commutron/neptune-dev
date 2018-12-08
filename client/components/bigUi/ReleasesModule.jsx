import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import UserName from '/client/components/uUi/UserName.jsx';

const ReleaseAction = ({ id, rType })=> {
  
  function handleRelease(e) {
    e.preventDefault();
    const date = e.target.rdate.value;
    const time = e.target.rtime.value;
    const datetime = date + 'T' + time;
    Meteor.call('addRelease', id, rType, datetime, (err)=>{
      err && console.log(err);
    });
  }
  let sty = {
    padding: '10px',
    borderWidth: '3px'
  };
  const releaseType = rType === 'floorRelease' ? 'the floor' : null;
  
  return(
    <div className='wide actionBox greenBorder' style={sty}>
      <form onSubmit={(e)=>handleRelease(e)} className='centre listSortInput'>
        <p className='centreText big cap greenT'>Release {Pref.xBatch} to {releaseType || 'the floor'}</p>
        <input
          type='date'
          id='rdate'
          defaultValue={moment().format('YYYY-MM-DD')}
          required />
        <input
          type='time'
          id='rtime'
          defaultValue={moment().format('HH:mm')}
          required />
        <p>
          <button
            type='submit'
            title={`Release ${Pref.batch} to the floor`}
            className='roundActionIcon dbblRound clearGreen cap'
            style={sty}
            disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
          ><i className='fas fa-play fa-2x'></i></button>
        </p>
      </form>
    </div>
  );
};
export default ReleaseAction;

export const ReleaseNote = ({ id, release, xBatch })=> {
  
  function handleCancel() {
    if(xBatch) {
      const rType = release.type;
      Meteor.call('cancelRelease', id, rType, (err)=>{
        if(err)
          console.log(err);
      });
    }else{
      Meteor.call('cancelFloorRelease', id, (err)=>{
        if(err)
          console.log(err);
      });
    }
  }
  const releaseType = release.type === 'floorRelease' ?
                      'Released to the Floor' : 'Released';
                      
  return(
    <div className='noCopy'>
      <ContextMenuTrigger id={id+'release'}>
  			<fieldset className='noteCard'>
          <legend>{releaseType || 'Released to the Floor'}</legend>
          {moment(release.time).format("ddd, MMM D /YY, h:mm a")}
          <i> by </i><UserName id={release.who} />
        </fieldset>
      </ContextMenuTrigger>
      <ContextMenu id={id+'release'}>
	      <MenuItem
	        onClick={()=>handleCancel()} 
	        disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}>
	        Cancel Release
	      </MenuItem>
	    </ContextMenu>
	  </div>
  );
};
