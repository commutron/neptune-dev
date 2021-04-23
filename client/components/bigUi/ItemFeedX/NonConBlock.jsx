import React, { useState, Fragment } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { NonConCheck } from '/client/utility/NonConOptions';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const NonConBlock = ({
  entry, seriesId, serial,
  done, iopen, user, canQA, canVerify, canInspect,
  app, ncTypesCombo, flatCheckList, brancheS, cal
})=> {
  
  
  const [ editState, editSet ] = useState(false);
  
  function handleChange(e) {
    const ncKey = entry.key;
    const ref = this.ncRef.value.trim().toLowerCase();
    const type = this.ncType.value.trim();
    const where = this.ncWhere.value.trim().toLowerCase();
    
    const tgood = this.ncType === entry.type || 
                  NonConCheck(this.ncType, flatCheckList);
    
    if( typeof ref !== 'string' || ref.length < 1 ||  !tgood || where.length < 1 ) {
      this.ncRef.reportValidity();
      this.ncType.reportValidity();
      this.ncWhere.reportValidity();
    }else if(entry.ref !== ref || 
             entry.type !== type ||
             entry.where !== where) {  
      Meteor.call('editNCX', seriesId, serial, ncKey, ref, type, where, (error)=> {
        error && console.log(error);
  			editSet(false);
  		});
    }else{editSet(false)}
  }
  
  function handleReInspect(e) {
    const ncKey = entry.key;
    Meteor.call('reInspectNCX', seriesId, ncKey, (error)=> {
			error && console.log(error);
			editSet(false);
		});
  }
  
  function handleTrash(e) {
    const ncKey = entry.key;
    if(!Roles.userIsInRole(Meteor.userId(), 'verify')) {
      toast.warning("'First-off' permission is needed skip a nonconformance");
    }else{
      Meteor.call('trashNCX', seriesId, ncKey, (error)=> {
  			error && console.log(error);
  			editSet(false);
  		});
    }
  }
  
  function handleUnTrash(e) {
    const ncKey = entry.key;
    Meteor.call('unTrashNCX', seriesId, ncKey, (error)=> {
			error && console.log(error);
			editSet(false);
		});
  }
  
  function popNC(e) {
    const yes = window.confirm('Permanently delete this ' + Pref.nonCon + '?');
    if(yes) {
      const ncKey = entry.key;
      const override = !canQA ? prompt("Enter PIN to override", "") : false;
      Meteor.call('removeNCX', seriesId, ncKey, override, (error)=>{
        error && console.log(error);
        editSet(false);
      });
    }else{editSet(false)}
  }
  
  const dt = entry;
                   
  const fx = typeof dt.fix === 'object';
  const ins = typeof dt.inspect === 'object';
  const rjc = !dt.reject || dt.reject.length === 0 ? false : true;
  
  const trashed = !dt.trash ? false : typeof dt.trash === 'object';
  const tSty = trashed ? 'trashStyle' : '';
  const open = trashed ?
               <pre><i className="far fa-trash-alt fa-lg fa-fw" title='Trashed'></i></pre> :
               dt.inspect === false ?
                <i><i className="fas fa-wrench fa-lg fa-fw" title='Awaiting Repair'></i></i> :
                <b><i className="fas fa-check-circle fa-lg fa-fw" title='Good'></i></b>;
  
  let fixed = !fx ? '' : <li>Repaired: <UserNice id={dt.fix.who} /> {cal(dt.fix.time)}</li>;
  let inspected = !ins ? '' : <li>Inspected: <UserNice id={dt.inspect.who} /> {cal(dt.inspect.time)}</li>;
  let snoozed = !dt.snooze ? false : true;
  let inTrash = !trashed ? '' : 
                <Fragment>
                  <li>Trashed: <UserNice id={dt.trash.who} /> {cal(dt.trash.time)}</li>
                  <li><button
                        className='smallAction clearRed blackT inlineButton'
                        disabled={!canQA}
                        onClick={(e)=>popNC(e)}
                      >Permanently Delete</button></li>
                </Fragment>;

  const editAllow = canInspect && iopen;
  const editIndicate = editState && 'editStandout';

	  
  return(
    <n-feed-info-block class={`noncon ${editIndicate} ${tSty}`}>
      <n-feed-left-anchor>{open}</n-feed-left-anchor>
      <n-feed-info-center>
      {editState === true ?
        <n-feed-info-title>
          <input
            type='text'
            id='ncRef'
            className='up miniIn24'
            placeholder='Reference'
            min={1}
            defaultValue={dt.ref}
            required />
            {user.typeNCselection ?
              <input 
                id='ncType'
                type='search'
                defaultValue={dt.type}
                placeholder='Type'
                list='ncTypeList'
                className='miniIn24'
                onInput={(e)=>NonConCheck(e.target, flatCheckList)}
                required
                autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
                disabled={ncTypesCombo.length < 1}/>
            :
              <select 
                id='ncType'
                className='miniIn24'
                required
                disabled={ncTypesCombo.length < 1}
              >
              {ncTypesCombo.map( (entry, index)=>{
                let cd = !user.showNCcodes ? '' :
                         entry.typeCode ? `${entry.typeCode}. ` : `${index + 1}. `;
                if(!entry.key) {
                  return ( 
                    <option 
                      key={index} 
                      value={entry}
                      label={cd + entry}
                    />
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
            }
            <datalist id='ncTypeList'>
              {ncTypesCombo.map( (entry, index)=>{
                let cd = !user.showNCcodes ? '' :
                         entry.typeCode ? `${entry.typeCode}. ` : `${index + 1}. `;
                if(!entry.key) {
                  return ( 
                    <option 
                      key={index} 
                      value={entry}
                      label={cd + entry}
                    />
                  );
                }else if(entry.live === true) {
                  return ( 
                    <option 
                      key={index}
                      data-id={entry.key}
                      value={entry.typeText}
                      label={cd + entry.typeText}
                    />
              )}})}
            </datalist>
            <input 
              id='ncWhere'
              list='ncWhereList'
              className='miniIn18'
              placeholder='Branch'
              defaultValue={dt.where || ''}
              disabled={!canVerify}
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
            
              <span className='rightRow'>
                {ins ?
                  <button
                    className='smallAction clearOrange blackT inlineButton vmarginhalf'
                    onClick={(e)=>handleReInspect(e)}
                    disabled={done}>
                    <i className='med'> ReInspect</i>
                  </button>
                :null}
                {!trashed && !ins ?
                  <button
                    className='smallAction clearOrange blackT inlineButton vmarginhalf'
                    disabled={!canVerify}
                    onClick={(e)=>handleTrash(e)}
                  >Remove</button>
                : trashed &&
                  <button
                    className='smallAction clearOrange blackT inlineButton vmarginhalf'
                    disabled={!canInspect}
                    onClick={(e)=>handleUnTrash(e)}
                  >Restore</button>
                }
                <button
                  className='smallAction clearGreen blackT inlineButton vmarginhalf'
                  onClick={(e)=>handleChange(e)}
                >Save</button>
                
              </span>
            </n-feed-info-title>
          :
            <n-feed-info-title>
              <span className='up'>{dt.ref}</span>
              <span className=''>{dt.type}</span>
              <span className=''>{dt.where}</span>
              <span></span>
              <span><UserNice id={dt.who} /></span>
              <span>{cal(dt.time)}</span>
            </n-feed-info-title>  
          }
        
        <ul>
          {fixed}
          {inspected}
          {snoozed && <li>Snoozed</li>}
          {rjc ?
            dt.reject.map( (entry, index)=>{
              return(
                <ul key={index}>
                  <li colSpan='2'>
                    Attempt: <UserNice id={entry.attemptWho} /> {cal(entry.attemptTime)}
                    <br />
                    Reject: <UserNice id={entry.rejectWho} /> {cal(entry.rejectTime)}
                  </li>
                </ul>
              )})
          : null}
          {inTrash}
        </ul>
        {dt.comm !== '' && <p className='endComment'><i className='far fa-comment'></i> {dt.comm}</p>}
    
      </n-feed-info-center>
      <n-feed-right-anchor>
        <button
          className='miniAction'
          onClick={()=>editSet(!editState)}
          disabled={!editAllow}
          readOnly={true}>
          {editState === true ? 'cancel' : 
          <n-fa1><i className='fas fa-edit fa-lg fa-fw'></i></n-fa1>}
        </button>
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};
  
export default NonConBlock;