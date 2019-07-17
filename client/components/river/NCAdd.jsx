import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const NCAdd = ({ id, barcode, app })=> {
  
  const ncTypesCombo = Array.from(app.nonConTypeLists, x => x.typeList);
	const ncTypesComboFlat = [].concat(...ncTypesCombo);
  const flatCheckList = [...app.nonConOption,
  	    ...Array.from(ncTypesComboFlat, x => x.live === true && x.typeText)];
  	    
  function handleCheck(e) {
    let match = flatCheckList.find( x => x === e.target.value);
    let message = !match ? 'please choose from the list' : '';
    e.target.setCustomValidity(message);
  }
  
  function handleNC(e, andFix) {
    e.preventDefault();
    const type = this.ncType.value.trim().toLowerCase();
    const where = Session.get('ncWhere') || "";
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    if(refSplit.length > 0 && refSplit[0] !== '') {
      for(let ref of refSplit) {
        ref = ref.replace(",", "");
        if(ref.length < 8) {
          Meteor.call('addNC', id, barcode, ref, type, where, andFix, (error)=>{
            error && console.log(error);
          });
        }else{
          toast.warn("Can't add '" + ref + "', A referance can only be 8 characters long", {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      }
      this.ncRefs.value = '';
      const findBox = document.getElementById('lookup');
      findBox.focus();
    }else{null}
  }

	let now = Session.get('ncWhere');
	let lock = now === 'complete';
	
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
    {Roles.userIsInRole(Meteor.userId(), 'nightly') ?
      <span>
        <input 
          id='ncType'
          className='redIn'
          type='search'
          placeholder='Type'
          list='ncTypeList'
          disabled={lock}
          onInput={(e)=>handleCheck(e)}
          required />
          <label htmlFor='ncType'>{Pref.nonConType}</label>
          <datalist id='ncTypeList'>
            {app.nonConOption.map( (entry, index)=>{
              return ( 
                <option
                  key={index}
                  data-id={index + 1 + '.'}
                  value={entry}
                >{index + 1}</option>
              );
            })}
            {ncTypesComboFlat.map( (entry, index)=>{
              if(entry.live === true) {
                return ( 
                  <option 
                    key={index}
                    data-id={entry.key}
                    value={entry.typeText}
                  >{entry.typeCode}</option>
                );
            }})}
          </datalist>
        </span>
      :
        <span>
          <select 
            id='ncType'
            className='cap redIn'
            disabled={lock}
            required >
            {app.nonConOption.map( (entry, index)=>{
              return ( 
                <option key={index} value={entry}>{index + 1}. {entry}</option>
                );
            })}
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