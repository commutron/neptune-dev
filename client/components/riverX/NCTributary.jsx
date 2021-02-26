import React, { useState, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

const NCTributary = ({ seriesId, serial, nonCons, sType })=> {

  function handleAction(ncKey, ACT, extra) {
    Meteor.call('runNCAction', seriesId, ncKey, ACT, extra, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
  
  const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
  const verifier = Roles.userIsInRole(Meteor.userId(), 'verify');
  
  return(
    <Fragment>
      {nonCons.map( (entry, index)=>{
        sType === 'finish' && entry.snooze === true ?
          handleAction(entry.key, 'WAKE') : null;
        return(
          <NCStream
            key={entry.key}
            entry={entry}
            seriesId={seriesId}
            end={sType === 'finish'}
            doAction={(act, extra)=> handleAction(entry.key, act, extra)}
            inspector={inspector}
            verifier={verifier}
          />
        )})}
    </Fragment>
  );
};

export default NCTributary;

const NCStream = ({ entry, seriesId, end, doAction, inspector, verifier })=>{
  
  const [ selfLock, selfLockSet ] = useState(false);
  
  const handleComment = ()=> {
    let val = window.prompt('Add a comment');
    val !== '' ? doAction('COMM', val) : null;
  };
  
  function handleClick(ACT, extra) {
    selfLockSet(true);
    doAction(ACT, extra);
  }
    
  const fixed = entry.fix;
  const same = entry.fix.who === Meteor.userId();
  
  const lockI = fixed ? !same && inspector ? false : true : false;
  let snooze = entry.snooze;
  let style = !snooze ? 'cap tribRow tribRed noCopy' : 'cap tribRow yellowList noCopy';

  const smple = window.innerWidth <= 1200;

  return(
    <div className={style}>
      <div className='tribInfo' title={entry.comm}>
        <div className='up numFont'>{entry.ref} {entry.comm !== '' && <i className='far fa-comment'></i>}</div>
        <div>{entry.type}</div>
      </div>
      <div className='tribAction'>
      <div className='tribActionMain'>
          {snooze ?
            <span className='centre'>
              <i className='far fa-clock fa-lg'></i>
              <i>{smple ? null : 'Snoozing'}</i>
            </span>
          :
            fixed ?
              <button
                title='All Correct'
                id='inspectline'
                className='ncAct riverG'
                onClick={()=>handleClick('INSPECT')}
                readOnly={true}
                disabled={lockI || selfLock}>
                <img src='/inspectMini.svg' className='pebbleSVG' /><br />
                <i>{smple ? null : 'OK'}</i>
              </button>
          :
              <button
                id='fixline'
                className='ncAct riverInfo'
                onClick={()=>handleClick('FIX')}
                readOnly={true}
                disabled={fixed === true || selfLock}>
                <img src='/repair.svg' className='pebbleSVG' /><br />
                <i>{smple ? null : 'Repair'}</i>
              </button>
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
            <MenuItem 
              onClick={()=>handleClick('INSPECT')} 
              disabled={!verifier}>
              Inspected, no repair required
            </MenuItem> }
            <MenuItem 
              onClick={()=>handleClick('REJECT', [entry.fix.time, entry.fix.who])} 
              disabled={lockI || !fixed}>
              {Pref.reject}
            </MenuItem>      
            <MenuItem 
              onClick={()=>handleClick('SNOOZE')}
              disabled={snooze !== false || end}>
              Snooze, repair later
            </MenuItem>
            <MenuItem 
              onClick={()=>handleClick('WAKE')} 
              disabled={!snooze}>
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