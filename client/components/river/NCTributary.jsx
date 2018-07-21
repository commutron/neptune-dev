import React from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
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
    
  function handleSkip(ncKey) {
    Meteor.call('skipNC', id, ncKey, (error)=> {
			if(error)
        console.log(error);
		});
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
    <InOutWrap type='ncTrans' add='ncTrib'>
      {nonCons.map( (entry)=>{
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
            doSkip={()=> handleSkip(entry.key)}
            doSnooze={()=> handleSnooze(entry.key)}
            doUnSkip={()=> handleUnSkip(entry.key)}
            doComment={(e)=> handleComment(entry.key, e)}
          />
        )})}
    </InOutWrap>
  );
};

const NCStream = ({ entry, id, end, doFix, doInspect, doReject, doSkip, doSnooze, doUnSkip, doComment })=>{
  
  comment = ()=> {
    let val = window.prompt('Add a comment');
    val !== '' ? doComment(val) : null;
  };
    
  const fixed = entry.fix;

  const same = entry.fix.who === Meteor.userId();
  const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
  const lockI = fixed ? !same && inspector ? false : true : false;
  let skip = entry.skip;
  let style = !skip ? 'cap tribRow tribRed noCopy' : 'cap tribRow yellow noCopy';
  
  let tryAgain = !entry.reject ? null :
                 entry.reject.length > 0 ?
                 <i className='badge'>
                  {entry.reject.length + 1}
                 </i>:
                 null;

  return(
    <ContextMenuTrigger id={entry.key} 
      attributes={ {className:style} }>
        <div className='tribCell up noCopy' title={entry.comm}>
          {entry.ref}
        </div>
        <div className='tribCell' title={entry.comm}>
          {entry.type}
        </div>
        <div className='tribCell'>
          {skip ?
            entry.snooze === true ?
              <i><i className='fas fa-clock fa-lg'></i></i>
              :
              <b><i className='fas fa-truck fa-lg'></i></b>
          :
            fixed ?
              <div className='twoSqIcons'>
                <button
                  title={Pref.inspect}
                  ref={(i)=> this.inspectline = i}
                  className='granule riverG'
                  readOnly={true}
                  onClick={doInspect}
                  disabled={lockI}>
                <i className='fas fa-check fa-lg'></i></button>
                <button
                  title={Pref.reject}
                  ref={(i)=> this.rejectline = i}
                  className='granule riverNG'
                  readOnly={true}
                  onClick={doReject}
                  disabled={lockI}>
                <i className='fas fa-times fa-lg'></i></button>
              </div>
          :
              <button
                title={Pref.repair}
                ref={(i)=> this.fixline = i}
                className='pebble'
                readOnly={true}
                onClick={doFix}
                disabled={false}>
              <img src='/repair.svg' className='pebbleSVG' />{tryAgain}</button>
          }
        </div>
      <ContextMenu id={entry.key}>
        <MenuItem onClick={doSnooze} disabled={skip !== false || end}>
          Snooze
        </MenuItem>
        <MenuItem onClick={doSkip} disabled={skip !== false && !entry.snooze}>
          Skip
        </MenuItem>
        <MenuItem onClick={doUnSkip} disabled={!skip}>
          Activate
        </MenuItem>
        <MenuItem onClick={this.comment.bind(this)}>
          Comment
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  );
};


export default NCTributary;