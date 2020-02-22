import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const ReleaseAction = ({ 
  id, rType, actionText, contextText, isX
})=> {
  
  const [ datetime, datetimeSet ] = useState( moment().format() );
  
  function handleDatetime(e) {
    const input = this.rDateTime.value;
    datetimeSet( input );
  }
  
  function handleRelease(e, caution) {
    if(isX) {
      Meteor.call('addRelease', id, rType, datetime, caution, (err)=>{
        err && console.log(err);
      });
    }else{
      Meteor.call('addReleaseLEGACY', id, rType, datetime, caution, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  let sty = {
    padding: '10px',
  };
  
  return(
    <div className='actionBox centre greenBorder listSortInput' style={sty}>
      <Flatpickr
        id='rDateTime'
        value={datetime}
        onChange={(e)=>handleDatetime(e)}
        options={{
          defaultDate: datetime,
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
          onClick={(e)=>handleRelease(e, false)}
          title={`Release ${Pref.xBatch} to the floor`}
          className='action clearGreen centreText bigger cap'
          style={sty}
          disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])}
        >{actionText} {contextText}</button>
      </p>
      <button
        onClick={(e)=>handleRelease(e, Pref.shortfall)}
        title={`Release ${Pref.batch} to the floor`}
        className='smallAction clearOrange medBig cap'
        disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])}
      >{actionText} with {Pref.shortfall}</button>
    </div>
  );
};
export default ReleaseAction;

export const ReleaseNote = ({ id, release, xBatch, lockout })=> {
  
  function handleCancel() {
    const rType = release.type;
    Meteor.call('cancelRelease', id, rType, (err)=>{
      err && console.log(err);
    });
  }
  const releaseType = release.type === 'floorRelease' ?
                      'Released to the Floor' : 'Released';
                      
  return(
    <div className='noCopy' title='right-click to cancel'>
      <ContextMenuTrigger id={id+'release'} disable={lockout}>
  			<fieldset className='noteCard'>
          <legend>{releaseType}</legend>
          <p>{moment(release.time).format("ddd, MMM D /YY, h:mm a")}
          <i> by <UserNice id={release.who} /></i></p>
          {release.caution ?
            <p>Caution: {release.caution}</p>
          : null}
        </fieldset>
      </ContextMenuTrigger>
      <ContextMenu id={id+'release'}>
	      <MenuItem
	        onClick={()=>handleCancel()} 
	        disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])}>
	        Cancel Release
	      </MenuItem>
	    </ContextMenu>
	  </div>
  );
};

export const ReleaseWrapper = ({ 
  id, batchNum, 
  releasedBool, releaseObj, 
  actionKeyword, actionText, contextText,
  lockout, isX, children
})=> {
  
  const out = releasedBool === true;
  const cautionState = out ? releaseObj.caution ? true : false : false;
  
  function handleRelease(e, caution) {
    const datetime = moment().format();
    if(isX) {
      Meteor.call('addRelease', id, actionKeyword, datetime, caution, (err)=>{
        err && console.log(err);
      });
    }else{
      // if(actionKeyword === 'floorRelease') {
      //   Meteor.call('releaseToFloor', id, datetime, caution, (err)=>{
      //     err && console.log(err);
      //   }); // DEPRECIATED
      // }else{
        Meteor.call('addReleaseLEGACY', id, actionKeyword, datetime, caution, (err)=>{
          err && console.log(err);
        });
      // }
    }
  }
  
  function handleCancel() {
    if(isX) {
      Meteor.call('cancelRelease', id, actionKeyword, (err)=>{
        err && console.log(err);
      });
    }else{
      // if(actionKeyword === 'floorRelease') {
      //   Meteor.call('cancelFloorRelease', id, (err)=>{
      //     err && console.log(err);
      //   }); // DEPRECIATED
      // }else{
        Meteor.call('cancelReleaseLEGACY', id, actionKeyword, (err)=>{
          err && console.log(err);
        });
      // }
    }
  }
  
  function handleCautionFlip() {
    const newCaution = cautionState ? false : Pref.shortfall;
    if(isX) {
      Meteor.call('cautionFlipRelease', id, actionKeyword, newCaution, (err)=>{
        err && console.log(err);
      });
    }else{
      // if(actionKeyword === 'floorRelease') {
      //   Meteor.call('cautionFlipFloorRelease', id, newCaution, (err)=>{
      //     err && console.log(err);
      //   }); // DEPRECIATED
      // }else{
        Meteor.call('cautionFlipReleaseLEGACY', id, actionKeyword, newCaution, (err)=>{
          err && console.log(err);
        });
      // }
    }
  }
  
  const isAuth = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  const extraClass = isAuth ? 'noCopy hoverAction' : 'noCopy';
                      
  return(
    <React.Fragment>
      <ContextMenuTrigger 
        id={id+'release'+actionKeyword}
        disable={!isAuth}
        renderTag='div'
        holdToDisplay={1}
        attributes={ {className: extraClass } }>
  			{children}
      </ContextMenuTrigger>
      <ContextMenu 
        id={id+'release'+actionKeyword} 
        className='cap noCopy'
        hideOnLeave={true}>
        <MenuItem disabled={true}>
          <em>{Pref.batch} {batchNum}{lockout && ' is complete'}</em>
        </MenuItem>
	      <MenuItem
	        onClick={(e)=>handleRelease(e, false)}
	        disabled={out || lockout}
	        >{actionText} {contextText}
	      </MenuItem>
	      <MenuItem
	        onClick={(e)=>handleRelease(e, Pref.shortfall)}
	        disabled={out || lockout}
	        >{actionText} with {Pref.shortfall}
	      </MenuItem>
	      <MenuItem
	        onClick={(e)=>handleCautionFlip(e)}
	        disabled={!out || lockout}>
	        {!out ? 'Change' : cautionState ? 'Disable' : 'Enable'} {Pref.shortfall} caution
	      </MenuItem>
	      <MenuItem
	        onClick={()=>handleCancel()} 
	        disabled={!out || lockout}
	        >Cancel {actionText}
	      </MenuItem>
	    </ContextMenu>
	  </React.Fragment>
  );
};
