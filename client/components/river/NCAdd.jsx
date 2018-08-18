import React from 'react';
import Pref from '/client/global/pref.js';

const NCAdd = ({ id, barcode, app })=> {

  function handleNC(e, andFix) {
    e.preventDefault();
    const type = this.ncType.value.trim().toLowerCase();
    const where = this.discStp.value.trim().toLowerCase();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    if(refSplit.length > 0 && refSplit[0] !== '') {
      for(let ref of refSplit) {
        ref = ref.replace(",", "");
        Meteor.call('addNC', id, barcode, ref, type, where, andFix, (error)=>{
          if(error)
            console.log(error);
        });
      }
      this.discStp.value = Session.get('nowStep');
      this.ncRefs.value = '';
      const findBox = document.getElementById('lookup');
      findBox.focus();
    }else{null}
  }

	let now = Session.get('nowStep');
	let lock = now === 'done';
	
  return (
    <form
      className='actionForm'
      onSubmit={(e)=>handleNC(e, false)}>
    
    <span>
      <select
        id='discStp'
        className='cap redIn'
        defaultValue={now}
        disabled={lock}
        required>
        <optgroup label='auto'>
          <option value={now} className='nowUp'>{now}</option>
        </optgroup>
        <optgroup label={Pref.ancillary}>
          {app.ancillaryOption.map( (entry, index)=>{
            return (
              <option key={index} value={entry}>{entry}</option>
              );
          })}
        </optgroup>
      </select>
    </span>
    <span>
      <input
        type='text'
        id='ncRefs'
        className='redIn up'
        placeholder={Pref.nonConRef}
        disabled={lock}
        required />
    </span>
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
    </span>  
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