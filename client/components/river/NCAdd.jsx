import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const NCAdd = ({ id, barcode, user, app, ncTypesCombo })=> {
  
  function handleCheck(target) {
    const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);

    let match = flatCheckList.find( x => x === target.value);

    let message = !match ? 'please choose from the list' : '';
    target.setCustomValidity(message);
    return !match ? false : true;
  }
  
  function handleNC(e, andFix) {
    e.preventDefault();
    const type = this.ncType.value.trim();
    
    const tgood = handleCheck(this.ncType);
    
    const where = Session.get('ncWhere') || "";
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    if(tgood && refSplit.length > 0 && refSplit[0] !== '') {
      for(let ref of refSplit) {
        ref = ref.replace(",", "");
        if(ref.length < 8) {
          Meteor.call('addNC', id, barcode, ref, type, where, andFix, (error)=>{
            error && console.log(error);
          });
        }else{
          toast.warn("Can't add '" + ref + "', A referance can only be 7 characters long", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 10000,
            closeOnClick: false
          });
        }
      }
      this.ncRefs.value = '';
      // const findBox = document.getElementById('lookup');
      // findBox.focus();
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
        disabled={lock}
        required />
      <label htmlFor='ncRefs'>{Pref.nonConRef}</label>
    </span>
    {user.typeNCselection ?
      <span>
        <input 
          id='ncType'
          className='redIn'
          type='search'
          placeholder='Type'
          list='ncTypeList'
          onInput={(e)=>handleCheck(e.target)}
          required
          disabled={lock || ncTypesCombo.length < 1}
          autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
        />
          <label htmlFor='ncType'>{Pref.nonConType}</label>
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
            required
            disabled={lock || ncTypesCombo.length < 1}
          >
          <option />
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
                    key={entry.key}
                    data-id={entry.key}
                    value={entry.typeText}
                    label={cd + entry.typeText}
                  />
                );
          }})}
          </select>
          <label htmlFor='ncType'>{Pref.nonConType}</label>
        </span>
      }
      <button
        type='submit'
        id='go'
        disabled={lock}
        className='smallAction clearRed bold'
      >Repair Later</button>
      
      <button
        type='button'
        id='goFix'
        onClick={(e)=>handleNC(e, true)}
        disabled={lock}
        className='smallAction clearRed bold'
      >Repaired Now</button>
          
    </form>
  );
};

export default NCAdd;