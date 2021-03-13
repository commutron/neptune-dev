import React, { useState } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const ShortBlock = ({ seriesId, serial, entry, done, rapIs, deleteAuth, cal })=> {
  
  const [ editState, editSet ] = useState(false);

  
  function handleChange() {
    const shKey = entry.key;
    const partNum = this.shPN.value.trim();
    const refs = this.shRefs.value.trim().toLowerCase()
                  .replace(",", " ").split(/\s* \s*/);
    let effect = null;
    let solve = null;
    const act = this.shAct.value;
    switch(act) {
      case Pref.doOmit : // Leave thing out, Continue and Ship
        effect = true; 
        break;
      case Pref.shortageWaiting : // Waiting to be Able to Resolve
        effect = false;
        solve = null;
        break;
      case Pref.notResolved : // Can be Resolved but is Not Yet
        effect = false;
        solve = false;
        break;
      case Pref.isResolved : // Problem is Resolved
        effect = false;
        solve = true;
        break;
      default:
        null; // Don't have a thing, what to do?
    }
    const comm = this.shCm.value.trim();
    
    Meteor.call('editShortX', seriesId, serial, shKey, partNum, refs, effect, solve, comm, 
    (error)=> {
      error && console.log(error);
			editSet(false);
		});
  }
  
  function popSh(e) {
    let check = 'Are you sure you want to remove this ' + Pref.shortfall;
    const yes = window.confirm(check);
    if(yes) {
      const shKey = entry.key;
      const override = !deleteAuth ? 
                        prompt("Enter PIN to override", "") : false;
      Meteor.call('removeShortX', seriesId, shKey, override, (error)=>{
        error && console.log(error);
        editSet(false);
      });
    }else{editSet(false)}
  }
  
  
  const dt = entry;
  
  const inE = dt.inEffect;
  const reS = dt.reSolve;
  const actionState = inE === null ? Pref.shortagePending : 
                      inE === true ? Pref.doOmit : 
                      reS === null ? Pref.shortageWaiting : 
                      reS === false ? Pref.notResolved : 
                      reS === true ? Pref.isResolved : 
                      'unknown';
    
  const open = inE === true || reS === true ?
          <i><i className="fas fa-check-circle fa-lg fa-fw" title='Good'></i></i> :
          <b><i className="far fa-circle fa-lg fa-fw" title='Awaiting Repair'></i></b>;
                
  const editAllow = Roles.userIsInRole(Meteor.userId(), 'verify') && (!done || rapIs) ;
  const editIndicate = editState ? 'editStandout' : '';     

  return(
    <n-feed-info-block class={`short ${editIndicate}`}>
      <n-feed-left-anchor>{open}</n-feed-left-anchor>
      <n-feed-info-center>
      {editState === true ?
        <n-feed-info-title>
          <input
            type='text'
            id='shPN'
            className='up miniIn24'
            placeholder='References'
            defaultValue={dt.partNum} />
          <input
            type='text'
            id='shRefs'
            className='up miniIn24'
            placeholder='Part Number'
            defaultValue={dt.refs.toString()} />
          <select 
            id='shAct'
            className='miniIn24'
            defaultValue={actionState}
            required>
            <option value={Pref.shortagePending}>{Pref.shortagePending}</option>
            <option value={Pref.doOmit}>{Pref.doOmit}</option>
            <option value={Pref.shortageWaiting}>{Pref.shortageWaiting}</option>
            <option value={Pref.isResolved}>{Pref.isResolved}</option>
          </select>
          <input
            type='text'
            id='shCm'
            className='miniIn24'
            placeholder='comment'
            defaultValue={dt.comm}/>
              
          <span className='rightRow'> 
            <button
              className='smallAction inlineButton vmarginhalf clearRed blackT'
              onClick={(e)=>popSh(e)}
            >Remove</button>
            <button
              className='smallAction inlineButton vmarginhalf clearGreen blackT'
              onClick={(e)=>handleChange(e)}
            >Save</button>
          </span>
          
        </n-feed-info-title>
      :
        <n-feed-info-title class='doFlexWrap'>
          
          <span className='up'>{dt.partNum}</span>
          <span className='cap'>{dt.refs.toString().toUpperCase()}</span>
          <span className='cap'>{dt.where}</span>
          <span></span>
          <span><UserNice id={dt.cWho} /></span>
          <span>{cal(dt.cTime)}</span>

        </n-feed-info-title>
      }

      <ul>
        <li>Last Updated: <UserNice id={dt.uWho} /> {cal(dt.uTime)}</li>
        <li>{actionState}</li>
      </ul>
      {dt.comm !== '' && <p>{dt.comm}</p>}
    
    </n-feed-info-center>
    <n-feed-right-anchor>
      <button
        className='miniAction'
        onClick={(e)=>editSet(!editState)}
        disabled={!editAllow}>
        {editState === true ? 'cancel' : 
          <n-fa1><i className='fas fa-edit fa-lg fa-fw'></i></n-fa1>}
      </button>
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default ShortBlock;