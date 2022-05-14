import React, { useState, Fragment } from 'react';
import './style.css';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { NonConCheck, onFire } from '/client/utility/NonConOptions';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const NonConBlock = ({
  entry, seriesId, serial, units,
  done, iopen, user, canQA, canVerify, canInspect,
  app, ncTypesCombo, flatCheckList, brancheS, cal
})=> {
  
  const [ editState, editSet ] = useState(false);
  const [ confirmState, confirmSet ] = useState(false);
  
  function handleChange(e) {
    const ncKey = entry.key;
    const ref = this.ncRef.value.trim().toLowerCase();
    const multi = units > 1 ? this.ncMulti.value : undefined;
    const type = this.ncType.value.trim();
    const where = this.ncWhere.value.trim().toLowerCase();
    
    const tgood = this.ncType === entry.type || 
                  NonConCheck(this.ncType, flatCheckList);
    
    if( typeof ref !== 'string' || ref.length < 1 ||  !tgood || where.length < 1 ) {
      this.ncRef.reportValidity();
      this.ncType.reportValidity();
      this.ncWhere.reportValidity();
    }else if(entry.ref !== ref || 
             entry.multi !== multi ||
             entry.type !== type ||
             entry.where !== where) {  
      Meteor.call('editNCX', seriesId, serial, ncKey, ref, multi, type, where, 
      (error)=> {
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
    const ncKey = entry.key;
    Meteor.call('removeNCX', seriesId, ncKey, (error)=>{
      error && console.log(error);
      confirmSet(false);
      editSet(false);
    });
  }
  
  const dt = entry;
                   
  const fx = typeof dt.fix === 'object';
  const ins = typeof dt.inspect === 'object';
  const rjc = !dt.reject || dt.reject.length === 0 ? false : true;
  
  const trashed = !dt.trash ? false : typeof dt.trash === 'object';
  const tSty = trashed ? 'trashStyle' : '';
  const open = trashed ?
               <n-fa1><i className="far fa-trash-alt fa-lg fa-fw" title='Trashed'></i></n-fa1> :
               dt.inspect === false ?
                <n-fa2><i className="fas fa-wrench fa-lg fa-fw" title='Awaiting Repair'></i></n-fa2> :
                <n-fa3><i className="fas fa-check-circle fa-lg fa-fw" title='Good'></i></n-fa3>;
  
  let fixed = !fx ? '' : <dd>Repaired: <UserNice id={dt.fix.who} /> {cal(dt.fix.time)}</dd>;
  let inspected = !ins ? '' : <dd>Inspected: <UserNice id={dt.inspect.who} /> {cal(dt.inspect.time)}</dd>;
  let snoozed = !dt.snooze ? false : true;
  let inTrash = !trashed ? '' : 
                <Fragment>
                  <dt>Trashed: <UserNice id={dt.trash.who} /> {cal(dt.trash.time)}</dt>
                  <dd><button
                        className='smallAction redHover blackT inlineButton'
                        disabled={!canQA}
                        onClick={(e)=>confirmSet(true)}
                      >Permanently Delete</button>
                  </dd>
                  {confirmState &&
                    <dd><b>Are you sure? </b><button
                        className='smallAction redHover blackT inlineButton'
                        disabled={!canQA}
                        onClick={(e)=>popNC(e)}
                      >YES</button>
                      <button
                        className='smallAction blackHover inlineButton'
                        disabled={!canQA}
                        onClick={(e)=>confirmSet(false)}
                      >NO</button>
                    </dd>
                  }
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
            className='up miniIn12'
            placeholder='Reference'
            min={1}
            defaultValue={dt.ref}
            required />
            {units > 1 &&
              <input
                type='number'
                id='ncMulti'
                title={`${Pref.nonCon} occurs on how many ${Pref.unit}s?`}
                className='up miniIn8'
                pattern='[0-9]*'
                maxLength='4'
                max={units}
                min={1}
                defaultValue={dt.multi || 1}
                required
                placeholder={Pref.unit+'s'} />
            }
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
                autoComplete={onFire()}
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
                    className='smallAction orangeHover blackT inlineButton vmarginhalf'
                    onClick={(e)=>handleReInspect(e)}
                    disabled={done}>
                    <i className='med'> ReInspect</i>
                  </button>
                :null}
                {!trashed && !ins ?
                  <button
                    className='smallAction orangeHover blackT inlineButton vmarginhalf'
                    disabled={!canVerify}
                    onClick={(e)=>handleTrash(e)}
                  >Remove</button>
                : trashed &&
                  <button
                    className='smallAction orangeHover blackT inlineButton vmarginhalf'
                    disabled={!canInspect}
                    onClick={(e)=>handleUnTrash(e)}
                  >Restore</button>
                }
                <button
                  className='smallAction greenHover blackT inlineButton vmarginhalf'
                  onClick={(e)=>handleChange(e)}
                >Save</button>
                
              </span>
            </n-feed-info-title>
          :
            <n-feed-info-title>
              <span className='up'>{dt.ref}{dt.multi > 1 && <sup> x{dt.multi}</sup>}</span>
              <span className=''>{dt.type}</span>
              <span className=''>{dt.where}</span>
              <span></span>
              <span><UserNice id={dt.who} /></span>
              <span>{cal(dt.time)}</span>
            </n-feed-info-title>  
          }
        
        <dl>
          {fixed}
          {inspected}
          {snoozed && <li>Snoozed</li>}
          {rjc ?
            dt.reject.map( (entry, index)=>{
              return(
                <dl key={index}>
                  <dd>
                    Attempt: <UserNice id={entry.attemptWho} /> {cal(entry.attemptTime)}
                  </dd>
                  <dd>
                    Reject: <UserNice id={entry.rejectWho} /> {cal(entry.rejectTime)}
                  </dd>
                </dl>
              )})
          : null}
          {inTrash}
        </dl>
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