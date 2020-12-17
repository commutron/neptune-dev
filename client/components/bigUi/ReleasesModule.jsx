import React, { useState, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
// import UserNice from '/client/components/smallUi/UserNice.jsx';
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
          className='action clearGreen centreText big cap'
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


export const ReleaseWrapper = ({ 
  id, batchNum, 
  releasedBool, releaseObj, 
  actionKeyword, actionText, 
  holdText, unholdText, undoText, contextText,
  lockout, isX, children
})=> {
  
  const clear = releasedBool === true;
  const cautionState = clear ? releaseObj.caution ? true : false : false;
  
  function handleRelease(e, caution) {
    const datetime = moment().format();
    if(isX) {
      Meteor.call('addRelease', id, actionKeyword, datetime, caution, (err)=>{
        err && console.log(err);
      });
    }else{
        Meteor.call('addReleaseLEGACY', id, actionKeyword, datetime, caution, (err)=>{
          err && console.log(err);
        });
    }
  }
  
  function handleCancel() {
    if(isX) {
      Meteor.call('cancelRelease', id, actionKeyword, (err)=>{
        err && console.log(err);
      });
    }else{
      Meteor.call('cancelReleaseLEGACY', id, actionKeyword, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  function handleCautionFlip() {
    const newCaution = cautionState ? false : Pref.shortfall;
    if(isX) {
      Meteor.call('cautionFlipRelease', id, actionKeyword, newCaution, (err)=>{
        err && console.log(err);
      });
    }else{
      Meteor.call('cautionFlipReleaseLEGACY', id, actionKeyword, newCaution, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  const isAuth = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  const extraClass = isAuth ? 'noCopy hoverAction' : 'noCopy';
                      
  return(
    <Fragment>
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
        
        {!clear &&
  	      <MenuItem
  	        onClick={(e)=>handleRelease(e, false)}
  	        disabled={lockout}
  	        >{actionText} {contextText}
  	      </MenuItem>
  	    }
  	    
  	    {clear &&
  	      <MenuItem
  	        onClick={(e)=>handleCautionFlip(e)}
  	        disabled={lockout}>
  	        {cautionState ? unholdText : holdText}
  	      </MenuItem>
  	    }
  	    
  	    {!clear &&
  	      <MenuItem
  	        onClick={(e)=>handleRelease(e, Pref.shortfall)}
  	        disabled={lockout}
  	        >{holdText}
  	      </MenuItem>
  	    }
  	    
  	    {clear &&
  	      <MenuItem
  	        onClick={()=>handleCancel()} 
  	        disabled={lockout}
  	        >{undoText}
  	      </MenuItem>
  	    }
  	    {/*
	      <MenuItem
	        onClick={(e)=>handleRelease(e, Pref.shortfall)}
	        disabled={clear || lockout}
	        >{holdText} with {Pref.shortfall}
	      </MenuItem>
	      <MenuItem
	        onClick={(e)=>handleCautionFlip(e)}
	        disabled={!clear || lockout}>
	        {!clear ? 'Change' : cautionState ? 'Disable' : 'Enable'} {Pref.shortfall} caution
	      </MenuItem>
	      <MenuItem
	        onClick={()=>handleCancel()} 
	        disabled={!clear || lockout}
	        >Cancel {actionText}
	      </MenuItem>
	      */}
	      
	    </ContextMenu>
	  </Fragment>
  );
};
