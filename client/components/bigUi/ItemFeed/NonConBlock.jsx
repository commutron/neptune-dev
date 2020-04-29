import React, { useState, Fragment } from 'react';
import moment from 'moment';
import './style.css';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const NonConBlock = ({
  entry, id, serial,
  done, user, app, ncTypesCombo, brancheS
})=> {
  
  const deleteAuth = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']);
  
  const [ editState, editSet ] = useState(false);
  
  function edit() {
    editSet(!editState);
  }
  
  function handleCheck(target, dflt) {
    const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
    let match = target.value === dflt || 
                flatCheckList.find( x => x === target.value);
    let message = !match ? 'please choose from the list' : '';
    target.setCustomValidity(message);
    return !match ? false : true;
  }
  
  function handleChange(e) {
    const ncKey = entry.key;
    const ref = this.ncRef.value.trim().toLowerCase();
    const type = this.ncType.value.trim();
    const where = this.ncWhere.value.trim().toLowerCase();
    
    const tgood = handleCheck(this.ncType, entry.type);
    
    if( typeof ref !== 'string' || ref.length < 1 ||  !tgood || where.length < 1 ) {
      this.ncRef.reportValidity();
      this.ncType.reportValidity();
      this.ncWhere.reportValidity();
    }else if(entry.ref !== ref || 
             entry.type !== type ||
             entry.where !== where) {  
      Meteor.call('editNC', id, serial, ncKey, ref, type, where, (error)=> {
        error && console.log(error);
  			editSet(false);
  		});
    }else{editSet(false)}
  }
  
  function handleReInspect(e) {
    const ncKey = entry.key;
    Meteor.call('reInspectNC', id, ncKey, (error)=> {
			error && console.log(error);
			edit();
		});
  }
  
  function handleTrash(e) {
    const ncKey = entry.key;
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) {
      toast.warning("'First-off' permission is needed skip a nonconformance");
    }else{
      Meteor.call('trashNC', id, ncKey, (error)=> {
  			error && console.log(error);
  			edit();
  		});
    }
  }
  
  function handleUnTrash(e) {
    const ncKey = entry.key;
    Meteor.call('unTrashNC', id, ncKey, (error)=> {
			error && console.log(error);
			edit();
		});
  }
  
  function popNC(e) {
    const yes = window.confirm('Permanently delete this ' + Pref.nonCon + '?');
    if(yes) {
      const ncKey = entry.key;
      const override = !deleteAuth ? 
                        prompt("Enter PIN to override", "") : false;
      Meteor.call('ncRemove', id, ncKey, override, (error)=>{
        error && console.log(error);
        editSet(false);
      });
    }else{editSet(false)}
  }
  
  const smEstr = "ddd, MMM D /YY, h:mm A";
  const dt = entry;
                   
  const fx = typeof dt.fix === 'object';
  const ins = typeof dt.inspect === 'object';
  const rjc = !dt.reject || dt.reject.length === 0 ? false : true;
  const skp = typeof dt.skip === 'object';
  
  const trashed = !dt.trash ? false : typeof dt.trash === 'object';
  const tSty = trashed ? 'trashStyle' : '';
  const open = trashed ?
               <pre><i className="far fa-trash-alt fa-lg fa-fw" title='Trashed'></i></pre> :
               dt.inspect === false ?
                <i><i className="fas fa-wrench fa-lg fa-fw iNG" title='Awaiting Repair'></i></i> :
                <b><i className="fas fa-check-circle fa-lg fa-fw iG" title='Good'></i></b>;
  
  let fixed = !fx ? '' : <li>Repaired: <UserNice id={dt.fix.who} /> {moment(dt.fix.time).calendar(null, {sameElse: smEstr})}</li>;
  let inspected = !ins ? '' : <li>Inspected: <UserNice id={dt.inspect.who} /> {moment(dt.inspect.time).calendar(null, {sameElse: smEstr})}</li>;
  let skipped = !skp ? '' : <li>Skipped: <UserNice id={dt.skip.who} /> {moment(dt.skip.time).calendar(null, {sameElse: smEstr})}</li>;
  let snoozed = !dt.snooze ? false : true;
  let inTrash = !trashed ? '' : 
                <Fragment>
                  <li>Trashed: <UserNice id={dt.trash.who} /> {moment(dt.trash.time).calendar(null, {sameElse: smEstr})}</li>
                  <li><button
                        className='miniAction redT inlineButton'
                        disabled={!deleteAuth}
                        onClick={(e)=>popNC(e)}
                      >Permanently Delete</button></li>
                </Fragment>;

  const editAllow = Roles.userIsInRole(Meteor.userId(), 'inspect') && !done;
  const editIndicate = editState && 'editStandout';

	  
  return(
    <div className={`infoBlock noncon ${editIndicate} ${tSty}`}>
      <div className='blockTitle cap'>
        {editState === true ?
          <div>
            <input
              type='text'
              id='ncRef'
              className='redIn up inlineInput'
              min={1}
              defaultValue={dt.ref}
              required />
            {user.typeNCselection ?
              <span>
                <input 
                  id='ncType'
                  className='redIn inlineSelect'
                  type='search'
                  defaultValue={dt.type}
                  placeholder='Type'
                  list='ncTypeList'
                  onInput={(e)=>handleCheck(e.target, dt.type)}
                  required
                  autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
                  disabled={ncTypesCombo.length < 1}/>
                  <datalist id='ncTypeList'>
                    {ncTypesCombo.map( (entry, index)=>{
                      if(!entry.key) {
                        return ( 
                          <option 
                            key={index} 
                            value={entry}
                          >{index + 1}. {entry}</option>
                        );
                      }else if(entry.live === true) {
                        let cd = user.showNCcodes ? `${entry.typeCode}. ` : '';
                        return ( 
                          <option 
                            key={index}
                            data-id={entry.key}
                            value={entry.typeText}
                            label={cd + entry.typeText}
                          />
                    )}})}
                  </datalist>
              </span>
              :
              <span>
                <select 
                  id='ncType'
                  className='redIn'
                  required
                  disabled={ncTypesCombo.length < 1}
                >
                {ncTypesCombo.map( (entry, index)=>{
                  if(!entry.key) {
                    return ( 
                      <option 
                        key={index} 
                        value={entry}
                      >{entry}</option>
                    );
                  }else if(entry.live === true) {
                    let cd = user.showNCcodes ? `${entry.typeCode}. ` : '';
                    return ( 
                      <option 
                        key={entry.key}
                        data-id={entry.key}
                        value={entry.typeText}
                        label={cd + entry.typeText}
                      />
                    );
                }})}
                </select>
              </span>
            }
            <input 
              id='ncWhere'
              className='redIn inlineSelect'
              list='ncWhereList'
              defaultValue={dt.where || ''}
              disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'edit', 'qa'])}
              required />
              <datalist id='ncWhereList'>
                <option value={dt.where || ''}>{dt.where || ''}</option>
                <optgroup label={Pref.branches}>
                  {brancheS.map( (entry, index)=>{
                    return(
                      <option 
                        key={`${index}pos${entry.position}`}
                        value={entry.branch}
                      >{entry.branch}</option>
                  )})}
                </optgroup>
                <optgroup label={Pref.ancillary}>
                  {app.ancillaryOption.map( (entry, index)=>{
                    return (
                      <option key={index} value={entry}>{entry}</option>
                      );
                  })}
                </optgroup>
              </datalist>
            </div>
          :
            <div>
              <div className='leftAnchor'>{open}</div>
              <div className='up'>{dt.ref}</div>
              <div className=''>{dt.type}</div>
              <div className=''>{dt.where}</div>
            </div>
          }
          {editState === true ?
            <div className='rightText'>
              {ins ?
                <button
                  className='miniAction yellowT inlineButton'
                  onClick={(e)=>handleReInspect(e)}
                  disabled={done}>
                  <i className='fas fa-redo fa-lg'></i>
                  <i className='med'> ReInspect</i>
                </button>
              :null}
              {!trashed ?
                <button
                  className='miniAction yellowT inlineButton'
                  disabled={!Roles.userIsInRole(Meteor.userId(), 'verify')}
                  onClick={(e)=>handleTrash(e)}
                >Remove</button>
              :
                <button
                  className='miniAction yellowT inlineButton'
                  disabled={!Roles.userIsInRole(Meteor.userId(), 'inspect')}
                  onClick={(e)=>handleUnTrash(e)}
                >Restore</button>
              }
              <button
                className='miniAction greenT inlineButton'
                onClick={(e)=>handleChange(e)}
              >Save</button>
              <button
                className='miniAction inlineButton'
                onClick={()=>edit()}
              >Cancel</button>
            </div>
          :
            <div className='rightText'>
              <div><UserNice id={dt.who} /></div>
              <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
              <div className='rightAnchor'>
                <button
                  className='miniAction'
                  onClick={()=>edit()}
                  disabled={!editAllow}
                  readOnly={true}>
                  <i className='fas fa-edit fa-lg fa-fw'></i>
                </button>
              </div>
            </div>
          }
        </div>
      <ul className='moreInfoList'>
        {fixed}
        {inspected}
        {snoozed && <li>Snoozed</li>}
        {skipped}
        {rjc ?
          dt.reject.map( (entry, index)=>{
            return(
              <ul key={index}>
                <li colSpan='2'>
                  Attempt: <UserNice id={entry.attemptWho} /> {moment(entry.attemptTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}
                  <br />
                  Reject: <UserNice id={entry.rejectWho} /> {moment(entry.rejectTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}
                </li>
              </ul>
            )})
        : null}
        {inTrash}
      </ul>
      {dt.comm !== '' && <p className='endComment'><i className='far fa-comment'></i> {dt.comm}</p>}

    </div>
  );
};
  
export default NonConBlock;