import React, { useState, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

const NCTributary = ({ id, serial, nonCons, sType })=> {

  function handleFix(ncKey) {
    Meteor.call('fixNC', id, ncKey, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }

  function handleInspect(ncKey) {
    Meteor.call('inspectNC', id, ncKey, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
    
  function handleReject(ncKey, fixTime, fixWho) {
    Meteor.call('rejectNC', id, ncKey, fixTime, fixWho, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
	
	function handleSnooze(ncKey) {
    Meteor.call('snoozeNC', id, ncKey, (error)=> {
			if(error)
        console.log(error);
		});
	}
	
	function handleUnSkip(ncKey) {
    Meteor.call('UnSkipNC', id, ncKey, (error)=> {
      if(error)
        console.log(error);
		});
  }
  
  function handleComment(ncKey, com) {
    Meteor.call('commentNC', id, ncKey, com, (error)=> {
      if(error)
        console.log(error);
		});
  }
  
  return(
    <Fragment>
      {nonCons.map( (entry, index)=>{
        sType === 'finish' && entry.snooze === true ?
          handleUnSkip(entry.key) : null;
        return (
          <NCStream
            key={entry.key}
            entry={entry}
            id={id}
            end={sType === 'finish'}
            doFix={()=> handleFix(entry.key)}
            doInspect={()=> handleInspect(entry.key)}
            doReject={()=> handleReject(entry.key, entry.fix.time, entry.fix.who)}
            doSnooze={()=> handleSnooze(entry.key)}
            doUnSkip={()=> handleUnSkip(entry.key)}
            doComment={(e)=> handleComment(entry.key, e)}
          />
        )})}
    </Fragment>
  );
};

export default NCTributary;

const NCStream = ({ 
  entry, id,
  end, 
  doFix, doInspect, doReject, doSnooze, doUnSkip, doComment
})=>{
  
  const [ selfLock, selfLockSet ] = useState(false);
  
  const handleComment = ()=> {
    let val = window.prompt('Add a comment');
    val !== '' ? doComment(val) : null;
  };
  
  function handleClick(e, doThing) {
    selfLockSet(true);
    doThing();
  }
    
  const fixed = entry.fix;

  const same = entry.fix.who === Meteor.userId();
  const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
  const verifier = Roles.userIsInRole(Meteor.userId(), 'verify');
  const lockI = fixed ? !same && inspector ? false : true : false;
  let skip = entry.skip;
  let style = !skip ? 'cap tribRow tribRed noCopy' : 'cap tribRow yellowList noCopy';

  const smple = window.innerWidth <= 1200;

  return(
    <div className={style}>
      <div className='tribInfo' title={entry.comm}>
        <div className='up numFont'>{entry.ref} {entry.comm !== '' && <i className='far fa-comment'></i>}</div>
        <div>{entry.type}</div>
      </div>
      <div className='tribAction'>
      <div className='tribActionMain'>
          {skip ?
            <span className='centre'>
              <i className='far fa-clock fa-lg'></i>{smple ? null : 'Later'}
            </span>
          :
            fixed ?
              <button
                title='All Correct'
                id='inspectline'
                className='ncAct riverG'
                onClick={(e)=>handleClick(e, doInspect)}
                readOnly={true}
                disabled={lockI || selfLock}>
              <img src='/inspectMini.svg' className='pebbleSVG' /><br />{smple ? null : 'OK'}</button>
          :
              <button
                id='fixline'
                className='ncAct riverInfo'
                onClick={(e)=>handleClick(e, doFix)}
                readOnly={true}
                disabled={fixed === true || selfLock}>
              <img src='/repair.svg' className='pebbleSVG' /><br />{smple ? null : 'Repair'}</button>
          }
        </div>
        <div className='tribActionExtra'>
          <ContextMenuTrigger
            id={entry.key}
            holdToDisplay={1}
            renderTag='span'>
            <i className='fas fa-ellipsis-v fa-fw fa-lg'></i>
          </ContextMenuTrigger>
        
          <ContextMenu id={entry.key}>
          {!fixed &&
            <MenuItem onClick={doInspect} disabled={!verifier}>
              Inspected, no repair required
            </MenuItem> }
            <MenuItem onClick={doReject} disabled={lockI || !fixed}>
              {Pref.reject}
            </MenuItem>      
            <MenuItem onClick={doSnooze} disabled={skip !== false || end}>
              Snooze, repair later
            </MenuItem>
            <MenuItem onClick={doUnSkip} disabled={!skip}>
              Wake Up, repair now
            </MenuItem>
            <MenuItem onClick={(e)=>handleComment(e)}>
              {entry.comm !== '' ? 'Change' : 'Add'} Comment
            </MenuItem>
          </ContextMenu>
        </div>
      </div>
    </div>
  );
};