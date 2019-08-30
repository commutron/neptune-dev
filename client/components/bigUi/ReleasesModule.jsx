import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const ReleaseAction = ({ id, rType })=> {
  
  function handleRelease(e) {
    e.preventDefault();
    const datetime = e.target.rDateTime.value || moment().format();
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
        <Flatpickr
          id='rDateTime'
          value={moment().format()}
          options={{
            defaultDate: moment().format(),
            maxDate: moment().format(),
            minuteIncrement: 1,
            enableTime: true,
            time_24hr: false,
            altInput: true,
            altFormat: "Y-m-d G:i K",
          }}
        />
        <p>
          <button
            type='submit'
            title={`Release ${Pref.batch} to the floor`}
            className='action clearGreen centreText bigger cap'
            style={sty}
            disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
          >Release {Pref.xBatch} to {releaseType || 'the floor'}</button>
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
          <i> by <UserNice id={release.who} /></i>
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
