import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { NonConCheck, onFire } from '/client/utility/NonConOptions';
import { PopContextButton, PopContextMenu } from '/client/layouts/Models/Popover';

const NCAdd = ({ seriesId, serial, units, user, ncTypesCombo, brancheS })=> {
  
  const [ brOvrd, brOvrdSet ] = useState(false);
  
  const station = localStorage.getItem("local_station");
  
  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
  function handleNC(e, andFix) {
    e.preventDefault();
    const uMulti = units > 1 ? this.ncMulti.value : undefined;
    const type = this.ncType.value.trim();
      
    const tgood = NonConCheck(this.ncType, flatCheckList);
    
    const where = brOvrd || Session.get('ncWhere') || "";
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refCut = refEntry.replace(Pref.listCut, "|");
    const refSplit = refCut.split("|");
    
    if(tgood && refSplit.length > 0 && refSplit[0] !== '') {
      Session.set('ncAddTypeSticky', type);
      for(let ref of refSplit) {
        if(ref.length > 0 && ref.length < 8) {
          Meteor.call('addNCX', seriesId, serial, ref, uMulti, type, where, station, andFix, 
          (error)=>{
            error && console.log(error);
          });
        }else{
          toast.warn("Can't add '" + ref + "', A reference can only be 7 characters long", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 10000,
            closeOnClick: false
          });
        }
      }
      this.ncRefs.value = '';
      units > 1 ? this.ncMulti.value = 1 : null;
      brOvrdSet(false);
      if(user.ncFocusReset) {
        document.getElementById('lookup').focus();
      }else{
        document.getElementById('ncRefs').focus();
      }
    }else{
      this.ncRefs.reportValidity();
      this.ncType.reportValidity();
    }
  }

	let now = Session.get('ncWhere');
	let lock = now === 'isC0mpl3t3d';
	
  return (
    <form
      className='actionForm'
      onSubmit={(e)=>handleNC(e, false)}>
    
    <span>
      <input
        type='text'
        id='ncRefs'
        className='redIn up'
        placeholder='R1 C122 X_8'
        title='Location reference required'
        disabled={lock}
        autoFocus
        required />
      <label htmlFor='ncRefs' className='whiteT'>{Pref.nonConRef}</label>
    </span>
    
    {units > 1 &&
      <span>
        <input
          type='number'
          id='ncMulti'
          title={`${Pref.nonCon} occurs on how many ${Pref.unit}s?`}
          className='redIn up'
          pattern='[0-9]*'
          maxLength='4'
          max={units}
          min={1}
          defaultValue={1}
          disabled={lock}
          required />
        <label htmlFor='ncMulti' className='whiteT'>{Pref.unit}s</label>
      </span>
    }
    {user.typeNCselection ?
      <span>
        <input 
          id='ncType'
          className='redIn'
          type='search'
          placeholder='Type'
          list='ncTypeList'
          onInput={(e)=>NonConCheck(e.target, flatCheckList)}
          defaultValue={Session.get('ncAddTypeSticky')}
          required
          disabled={lock || ncTypesCombo.length < 1}
          autoComplete={onFire()}
        />
          <label htmlFor='ncType' className='whiteT'>{Pref.nonConType}</label>
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
                    key={entry.key}
                    data-id={entry.key}
                    value={entry.typeText}
                    label={cd + entry.typeText}
                  />
                );
            }})}
          </datalist>
        </span>
        :
        <span>
          <select 
            id='ncType'
            className='redIn'
            defaultValue={Session.get('ncAddTypeSticky')}
            required
            disabled={lock || ncTypesCombo.length < 1}
          >
          <option />
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
                  key={entry.key}
                  data-id={entry.key}
                  value={entry.typeText}
                  label={cd + entry.typeText}
                />
              );
          }})}
          </select>
          <label htmlFor='ncType' className='whiteT'>{Pref.nonConType}</label>
        </span>
      }
      
      <PopContextButton
  			targetid='branchOverrideButton'
  			extraClass={`inherit ${brOvrd ? 'redGlow' : ''}`}
  			icon='fas fa-sitemap medBig darkgrayT'
  			title={`Override auto-${Pref.branch}\nWill effect place in ${Pref.flow}`}
  		/>
  		<PopContextMenu targetid='branchOverrideButton' extraClass='forcetop popDark cap'>
  		  <span className='medSm darkCard darkgrayT nomargin wide centreText'>Where Override</span>
        {brancheS.map((b,x)=> (
          <button 
            type='button'
            title={now == b.branch ? 'auto-selection' : ''}
            key={x}
            style={
              now == b.branch ? !brOvrd ?
                {backgroundColor: 'var(--pomegranatetrans)'} : 
                {borderColor: 'var(--pomegranatetrans)'} : null}
            className={(brOvrd||now) == b.branch ? 'redGlow':''}
            onClick={()=>brOvrdSet(b.branch == now ? false : b.branch)}
            popovertarget='branchOverrideButton' 
            popovertargetaction="hide"
          >{b.branch}</button>
        ))}
      </PopContextMenu>
      
      <NCdo
        type='submit'
        id='goNcAdd'
        text='Repair Later'
        onclick={null}
        lock={lock}
      />
      
      <NCdo
        type='button'
        id='goNcFixAdd'
        text='Repaired Now'
        onclick={(e)=>handleNC(e, true)}
        lock={lock}
      />
          
    </form>
  );
};

export default NCAdd;

const NCdo = ({ type, id, text, onclick, lock })=> (
  <button
    type={type || 'button'}
    id={id}
    onClick={onclick}
    disabled={lock}
    className='smallAction redHover bold transparent'
  >{text}</button>
);