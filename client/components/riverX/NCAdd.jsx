import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { NonConCheck } from '/client/utility/NonConOptions';

const NCAdd = ({ seriesId, barcode, user, app, ncTypesCombo })=> {
  
  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
  function handleNC(e, andFix) {
    e.preventDefault();
    const type = this.ncType.value.trim();
    
    const tgood = NonConCheck(this.ncType, flatCheckList);
    
    const where = Session.get('ncWhere') || "";
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refCut = refEntry.replace(Pref.listCut, "|");
    const refSplit = refCut.split("|");
    
    if(tgood && refSplit.length > 0 && refSplit[0] !== '') {
      for(let ref of refSplit) {
        if(ref.length < 8) {
          Meteor.call('addNCX', seriesId, barcode, ref, type, where, andFix, (error)=>{
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
      <label htmlFor='ncRefs' className='whiteT'>{Pref.nonConRef}</label>
    </span>
    {user.typeNCselection ?
      <span>
        <input 
          id='ncType'
          className='redIn'
          type='search'
          placeholder='Type'
          list='ncTypeList'
          onInput={(e)=>NonConCheck(e.target, flatCheckList)}
          required
          disabled={lock || ncTypesCombo.length < 1}
          autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
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