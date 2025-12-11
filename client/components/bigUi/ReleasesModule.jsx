import React, { useState, Fragment } from 'react';
import moment from 'moment';
import Pref from '/public/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const ReleaseAction = ({ id, createdAt, rType, actionText, contextText, qtReq })=> {
  
  const [ datetime, datetimeSet ] = useState( moment().format() );
  
  function handleDatetime(e) {
    const input = this.relmanualDateTime.value;
    datetimeSet( moment(input).format() );
  }
  
  function handleRelease(e, caution) {
    Meteor.call('addRelease', id, rType, datetime, caution, (err)=>{
      err && console.log(err);
    });
  }
  
  let sty = {
    padding: '10px',
    height: 'fit-content',
    border: contextText ? '0' : '3px solid var(--peterriver)'
  };
  
  const access = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  const title = access ? `${Pref.release} ${Pref.xBatch} to the ${Pref.floor}` : Pref.norole;
  
  return(
    <div className='centre listSortInput' style={sty} disabled={qtReq}>
      {qtReq && 
        <span className='borderBlack bottomLine centreText'>
          <strong className='med'>Quote Time Budget Required</strong><br />
          <small>(Total & Tasks are mandatory when serialized)</small>
        </span>}
      <Flatpickr
        id='relmanualDateTime'
        value={datetime}
        className='minWide'
        onChange={(e)=>handleDatetime(e)}
        disabled={!access || !createdAt || qtReq}
        required
        options={{
          defaultDate: datetime,
          minDate: createdAt,
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
          className='action blueSolid cap'
          style={sty}
          disabled={!access || qtReq}
        >{actionText} {contextText}</button>
      </p>
      <button
        onClick={(e)=>handleRelease(e, Pref.shortfall)}
        title={title}
        className='action orangeSolid cap'
        disabled={!access || qtReq}
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
  lockout, qtReq, isAuth, children
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
          <em>{Pref.xBatch} {batchNum}</em>
        </MenuItem>
        
        {qtReq &&
          <MenuItem disabled={true}>
            <strong className='yellowT'>Quote Time Budget Required. (Total & Tasks)</strong>
          </MenuItem>
        }
        
        {!clear &&
  	      <MenuItem
  	        onClick={(e)=>handleRelease(e, false)}
  	        disabled={lockout}
  	        ><i className='fas fa-check-square fa-fw gapR'></i>{actionText} {contextText}
  	      </MenuItem>
  	    }
  	    
  	    {clear &&
  	      <MenuItem
  	        onClick={(e)=>handleCautionFlip(e)}
  	        disabled={lockout}
  	       >{cautionState ?
  	          <n-fa0><i className='fas fa-check-square fa-fw gapR'></i>{unholdText}</n-fa0> :
  	          <n-fa1><i className='far fa-minus-square fa-fw gapR'></i>{holdText}</n-fa1>}
  	      </MenuItem>
  	    }
  	    
  	    {!clear &&
  	      <MenuItem
  	        onClick={(e)=>handleRelease(e, Pref.shortfall)}
  	        disabled={lockout}
  	        ><i className='far fa-minus-square fa-fw gapR'></i>{holdText}
  	      </MenuItem>
  	    }
  	    
  	    {clear &&
  	      <MenuItem
  	        onClick={()=>handleCancel()} 
  	        disabled={lockout}
  	        ><i className='fas fa-ban fa-fw gapR'></i>{undoText}
  	      </MenuItem>
  	    }
	    </ContextMenu>
	  </Fragment>
  );
};
