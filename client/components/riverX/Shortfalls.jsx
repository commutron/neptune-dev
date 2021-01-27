import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

const Shortfalls = ({ seriesId, shortfalls, lock })=> {
  
  function handleChange(shKey, effect, solve) {
    Meteor.call('setShortX', seriesId, shKey, effect, solve, (error)=> {
      error && console.log(error);
		});
  }
  
  return(
    <Fragment>
      {!shortfalls || shortfalls.map( (entry)=>{
        return (
          <ShortLine
            key={entry.key}
            entry={entry}
            doSet={(a, b)=>handleChange(entry.key, a, b)}
            lock={lock || !Roles.userIsInRole(Meteor.userId(), 'verify')}
          />
        )})}
    </Fragment>
  );
};

const ShortLine = ({ entry, doSet, lock })=>{
  
  const inE = entry.inEffect;
  const reS = entry.reSolve;
  const actionColor = 
    inE === null ? 'yellowList' :
    inE === true ? 'blackList orangeT' :
    !reS ? 'orangeList' :
    reS === true ? 'greenList' :
    'unknown';
  const actionState = 
    inE === null ? <span title={Pref.Pending} className='centre'><i><i className='fas fa-hand-paper fa-lg'></i></i>Decide</span> :
    inE === true ? <span title={Pref.doOmit} className='centre'><b><i className='fas fa-hand-scissors fa-lg'></i></b>Leave</span> :
    !reS ? <span title={Pref.shortageWaiting} className='centre'><em><i className='fas fa-hand-holding fa-lg'></i></em>Wait</span> :
    reS === true ? <span title={Pref.isResolved} className='centre'><ins><i className='fas fa-thumbs-up'></i></ins>Good</span> :
    'unknown';

  return(
    <div className={'shortRow noCopy ' + actionColor }>
      <div className='tribInfo' title={entry.comm}>
        <div className='up numFont'>{entry.partNum} {entry.comm !== '' && <i className='far fa-comment'></i>}</div>
        <div className='up'>{entry.refs.toString()}</div>
      </div>
      <div className='tribAction'>
        <div className='tribActionMain'>
          {actionState}
        </div>
        <div className='tribActionExtra'>
          <ContextMenuTrigger
            id={entry.key}
            holdToDisplay={1}
            renderTag='span'>
            <i className='fas fa-ellipsis-v fa-fw fa-lg'></i>
          </ContextMenuTrigger>
          <ContextMenu id={entry.key}>
            {!Roles.userIsInRole(Meteor.userId(), 'verify') &&
              <MenuItem disabled={true}>"Verify" Permission Required</MenuItem>}
            <MenuItem onClick={()=>doSet(null, null)} disabled={lock}>
              <i className='fas fa-hand-paper fa-lg'></i>  {Pref.shortagePending}
            </MenuItem>
            <MenuItem onClick={()=>doSet(true, false)} disabled={lock}>
              <i className='fas fa-hand-scissors fa-lg'></i>  {Pref.doOmit}
            </MenuItem>
            <MenuItem onClick={()=>doSet(false, null)} disabled={lock}>
              <i className='fas fa-hand-holding fa-lg'></i>  {Pref.shortageWaiting}
            </MenuItem>
            {/* <MenuItem onClick={()=>doSet(false, false)} disabled={lock}>
            <i className='fas fa-hand-rock fa-lg'></i>  {Pref.notResolved}
            </MenuItem>*/}
            <MenuItem onClick={()=>doSet(false, true)} disabled={lock}>
              <i className='fas fa-thumbs-up'></i>  {Pref.isResolved}
            </MenuItem>
          </ContextMenu>
        </div>
      </div>
    </div>
  );
};

export default Shortfalls;