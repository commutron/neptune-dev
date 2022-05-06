import React, { Fragment } from 'react';
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
    inE === null ? 
      <span title={Pref.Pending} className='centre'>
        <n-fa1><i className='fas fa-hand-paper fa-lg'></i></n-fa1>
        <i>Decide</i>
      </span> :
    inE === true ? 
      <span title={Pref.doOmit} className='centre'>
        <n-fa2><i className='fas fa-hand-scissors fa-lg'></i></n-fa2>
        <i>Leave</i>
      </span> :
    !reS ? 
      <span title={Pref.shortageWaiting} className='centre'>
        <n-fa3><i className='fas fa-hand-holding fa-lg'></i></n-fa3>
        <i>Wait</i>
      </span> :
    reS === true ? 
      <span title={Pref.isResolved} className='centre'>
        <n-fa4><i className='fas fa-thumbs-up'></i></n-fa4>
        <i>Good</i>
      </span> :
    'unknown';

  return(
    <n-short-row class={'noCopy ' + actionColor}>
      <n-trib-info title={entry.comm}>
        <div className='up numFont'>{entry.partNum} {entry.comm !== '' && <i className='fas fa-comment'></i>}</div>
        <div className='up'
          >{entry.refs.toString()}{entry.multi > 1 && <sup> x{entry.multi}</sup>}
        </div>
      </n-trib-info>
      <n-trib-action>
        <n-trib-action-main>
          {actionState}
        </n-trib-action-main>
        <n-trib-action-extra>
          <ContextMenuTrigger
            id={entry.key}
            holdToDisplay={1}
            renderTag='span'>
            <i className='fas fa-ellipsis-v fa-lg'></i>
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
        </n-trib-action-extra>
      </n-trib-action>
    </n-short-row>
  );
};

export default Shortfalls;