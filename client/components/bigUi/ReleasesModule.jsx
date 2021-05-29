import React, { useState, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const ReleaseAction = ({ id, rType, actionText, contextText })=> {
  
  const [ datetime, datetimeSet ] = useState( moment().format() );
  
  function handleDatetime(e) {
    const input = this.rDateTime.value;
    datetimeSet( input );
  }
  
  function handleRelease(e, caution) {
    Meteor.call('addRelease', id, rType, datetime, caution, (err)=>{
      err && console.log(err);
    });
  }
  
  let sty = {
    padding: '10px',
    height: 'fit-content'
  };
  
  const access = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  const title = access ? `Release ${Pref.xBatch} to the floor` : Pref.norole;
  
  return(
    <div className='actionBox centre greenBorder listSortInput' style={sty}>
      <Flatpickr
        id='rDateTime'
        value={datetime}
        className='minWide'
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
          title={title}
          className='action clearGreen centreText medBig cap'
          style={sty}
          disabled={!access}
        >{actionText} {contextText}</button>
      </p>
      <button
        onClick={(e)=>handleRelease(e, Pref.shortfall)}
        title={title}
        className='smallAction clearOrange cap'
        disabled={!access}
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
  lockout, children
})=> {
  
  const clear = releasedBool === true;
  const cautionState = clear ? releaseObj.caution ? true : false : false;
  
  function handleRelease(e, caution) {
    const datetime = moment().format();
    Meteor.call('addRelease', id, actionKeyword, datetime, caution, (err)=>{
      err && console.log(err);
    });
  }
  
  function handleCancel() {
    Meteor.call('cancelRelease', id, actionKeyword, (err)=>{
      err && console.log(err);
    });
  }
  
  function handleCautionFlip() {
    const newCaution = cautionState ? false : Pref.shortfall;
    Meteor.call('cautionFlipRelease', id, actionKeyword, newCaution, (err)=>{
      err && console.log(err);
    });
  }
  
  const isAuth = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  const extraClass = isAuth ? 'noCopy overAction' : 'noCopy';
                      
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
          <em>{Pref.xBatch} {batchNum}{lockout && ' is complete'}</em>
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
	    </ContextMenu>
	  </Fragment>
  );
};
