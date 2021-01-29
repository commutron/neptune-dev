import React, { useState, Fragment } from 'react';
import moment from 'moment';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const ShortBlock = ({ seriesId, serial, entry, done, deleteAuth, calString })=> {
  
  const [ editState, editSet ] = useState(false);

  function edit() {
    editSet(!editState);
  }
  
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
          <i><i className="fas fa-check-circle fa-lg fa-fw iG" title='Good'></i></i> :
          <b><i className="far fa-circle fa-lg fa-fw iNG" title='Awaiting Repair'></i></b>;
                
  const editAllow = Roles.userIsInRole(Meteor.userId(), 'verify') && !done;
  const editIndicate = editState ? 'editStandout' : '';     

  return(
    <div className={`feedInfoBlock short ${editIndicate}`}>
      <div className={`feedInfoTitle ${editState ? 'doFlexWrap' : ''}`}>
        {editState === true ?
          <div>
            <input
              type='text'
              id='shPN'
              className='up inlineInput'
              defaultValue={dt.partNum} />
            <input
              type='text'
              id='shRefs'
              className='up inlineInput'
              defaultValue={dt.refs.toString()} />
            <select 
              id='shAct'
              className='inlineSelect'
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
              className='inlineInput'
              placeholder='comment'
              defaultValue={dt.comm}/>
          </div>
        :
          <div>
            <div className='leftAnchor'>{open}</div>
            <div className='up'>{dt.partNum}</div>
            <div className='cap'>{dt.refs.toString().toUpperCase()}</div>
            <div className='cap'>{dt.where}</div>
          </div>
        }
        {editState === true ?
          <div className='rightText'>
            <button
              className='smallAction inlineButton clearRed'
              onClick={(e)=>popSh(e)}
            >Remove</button>
            <button
              className='smallAction inlineButton clearGreen'
              onClick={(e)=>handleChange(e)}
            >Save</button>
            <button
              className='smallAction inlineButton clearBlack'
              onClick={(e)=>edit(e)}
            >Cancel</button>
          </div>
        :
          <div className='rightText'>
            <div><UserNice id={dt.cWho} /></div>
            <div>{moment(dt.cTime).calendar(null, {sameElse: calString})}</div>
            <div className='rightAnchor'>
              <button
                className='miniAction'
                onClick={(e)=>edit(e)}
                disabled={!editAllow}>
                <i className='fas fa-edit fa-lg fa-fw'></i>
              </button>
            </div>
          </div>
        }
      </div>
      <ul className='moreInfoList'>
        <li>Last Updated: <UserNice id={dt.uWho} /> {moment(dt.uTime).calendar(null, {sameElse: calString})}</li>
        <li>{actionState}</li>
      </ul>
      {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
    </div>
  );
};

export default ShortBlock;