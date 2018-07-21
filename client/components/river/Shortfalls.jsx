import React from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

const Shortfalls = ({ id, shortfalls, lock })=> {
  
  function handleChange(shKey, effect, solve) {
    Meteor.call('setShort', id, shKey, effect, solve, (error)=> {
      error && console.log(error);
		});
  }
  
  return(
    <div>
      <InOutWrap type='ncTrans' add='shortGrid'>
        {!shortfalls || shortfalls.map( (entry)=>{
          return (
            <ShortLine
              key={entry.key}
              entry={entry}
              doSet={(a, b)=>handleChange(entry.key, a, b)}
              lock={lock}
            />
          )})}
      </InOutWrap>
    </div>
  );
};

const ShortLine = ({ entry, doSet, lock })=>{
  
  const inE = entry.inEffect;
  const reS = entry.reSolve;
  const actionColor = 
    inE === null ? 'orangeList' :
    inE === true ? 'black orangeT' :
    reS === null ? 'orangeList' :
    reS === false ? 'orangeList' :
    reS === true ? 'greenList' :
    'unknown';
  const actionState = 
    inE === null ? <span title={Pref.Pending}><i><i className='fas fa-hand-paper fa-lg'></i></i> Decide</span> :
    inE === true ? <span title={Pref.doOmit}><b><i className='fas fa-hand-peace fa-lg'></i></b> Leave</span> :
    reS === null ? <span title={Pref.shortageWaiting}><em><i className='fas fa-hand-holding fa-lg'></i></em> Wait</span> :
    reS === false ? <span title={Pref.notResolved}><strong><i className='fas fa-hand-rock fa-lg'></i> Have</strong></span> :
    reS === true ? <span title={Pref.isResolved}><ins><i className='fas fa-thumbs-up'></i></ins> Good</span> :
    'unknown';

  return(
    <ContextMenuTrigger id={entry.key} 
      attributes={ {className:'shortRow noCopy ' + actionColor } }>
        <div className='shortCell up' title={entry.comm}>
          {entry.partNum}
        </div>
        <div className='shortCell up' title={entry.comm}>
          {entry.refs.toString()}
        </div>
        <div className='shortCell'>
          {actionState}
        </div>
      <ContextMenu id={entry.key}>
        <MenuItem onClick={()=>doSet(null, null)} disabled={lock}>
          <i className='fas fa-hand-paper fa-lg'></i>  {Pref.shortagePending}
        </MenuItem>
        <MenuItem onClick={()=>doSet(true, false)} disabled={lock}>
          <i className='fas fa-hand-peace fa-lg'></i>  {Pref.doOmit}
        </MenuItem>
        <MenuItem onClick={()=>doSet(false, null)} disabled={lock}>
          <i className='fas fa-hand-holding fa-lg'></i>  {Pref.shortageWaiting}
        </MenuItem>
        <MenuItem onClick={()=>doSet(false, false)} disabled={lock}>
          <i className='fas fa-hand-rock fa-lg'></i>  {Pref.notResolved}
        </MenuItem>
        <MenuItem onClick={()=>doSet(false, true)} disabled={lock}>
          <i className='fas fa-thumbs-up'></i>  {Pref.isResolved}
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  );
};

export default Shortfalls;