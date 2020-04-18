import React, { useState } from 'react';
import moment from 'moment';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const ShortBlock = ({ id, serial, entry, done })=> {
  
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
      case Pref.doOmit :
        effect = true;
        break;
      case Pref.shortageWaiting :
        effect = false;
        solve = null;
        break;
      case Pref.notResolved :
        effect = false;
        solve = false;
        break;
      case Pref.isResolved :
        effect = false;
        solve = true;
        break;
      default:
        null;
    }
    const comm = this.shCm.value.trim();
    
    Meteor.call('editShort', id, serial, shKey, partNum, refs, effect, solve, comm, (error)=> {
      error && console.log(error);
			editSet(false);
		});
  }
  
  function popSh(e) {
    let check = 'Are you sure you want to remove this ' + Pref.shortfall;
    const yes = window.confirm(check);
    if(yes) {
      const shKey = entry.key;
      const override = !Roles.userIsInRole(Meteor.userId(), ['qa', 'remove', 'run']) ? 
                        prompt("Enter PIN to override", "") : false;
      Meteor.call('removeShort', id, shKey, override, (error)=>{
        error && console.log(error);
        editSet(false);
      });
    }else{editSet(false)}
  }
  
  
  const dt = entry;
  
  const inE = dt.inEffect;
  const reS = dt.reSolve;
  const actionState = inE === null ? Pref.shortagePending : // Don't have a thing, what to do?
                      inE === true ? Pref.doOmit : // Leave thing out, Continue and Ship

                      reS === null ? Pref.shortageWaiting : // Waiting to be Able to Resolve
                      reS === false ? Pref.notResolved : // Can be Resolved but is Not Yet
                      reS === true ? Pref.isResolved : // Problem is Resolved
                      'unknown';
    
  const open = inE === true || reS === true ?
                <i><i className="fas fa-check-circle fa-lg fa-fw iG" title='Good'></i></i> :
                <b><i className="fas fa-wrench fa-lg fa-fw iNG" title='Awaiting Repair'></i></b>;
                
  const editAllow = Roles.userIsInRole(Meteor.userId(), 'verify') && !done;
  const editIndicate = editState ? 'editStandout' : '';     

  return(
    <div className={`infoBlock short ${editIndicate}`}>
      <div className='blockTitle cap'>
        {editState === true ?
          <div>
            <input
              type='text'
              id='shPN'
              className='up orangeIn inlineInput'
              defaultValue={dt.partNum} />
            <input
              type='text'
              id='shRefs'
              className='up orangeIn inlineInput'
              defaultValue={dt.refs.toString()} />
            <select 
              id='shAct'
              className='orangeIn inlineSelect'
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
              className='orangeIn inlineInput'
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
              className='miniAction inlineButton greenT'
              onClick={(e)=>handleChange(e)}
            >Save</button>
            <button
              className='miniAction inlineButton redT'
              onClick={(e)=>popSh(e)}
            >Remove</button>
            <button
              className='miniAction inlineButton'
              onClick={(e)=>edit(e)}
            >Cancel</button>
          </div>
        :
          <div className='rightText'>
            <div><UserNice id={dt.cWho} /></div>
            <div>{moment(dt.cTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
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
        <li>Last Updated: <UserNice id={dt.uWho} /> {moment(dt.uTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>
        <li>{actionState}</li>
      </ul>
      {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
    </div>
  );
};

export default ShortBlock;



