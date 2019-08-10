import React from 'react';
import Pref from '/client/global/pref.js';

const NCFlood = ({ id, live, app, ncListKeys })=> {
  
  const asignedNCLists = app.nonConTypeLists.filter( 
    x => ncListKeys.find( y => y === x.key ) ? true : false );
  
  const ncTypesCombo = Array.from(asignedNCLists, x => x.typeList);
	const ncTypesComboFlat = [].concat(...ncTypesCombo);
  const flatCheckList = ncTypesComboFlat.length > 0 ?
    Array.from(ncTypesComboFlat, x => x.live === true && x.typeText)
    : app.nonConOption;
  
  function handleCheck(e) {
    let match = flatCheckList.find( x => x === e.target.value);
    let message = !match ? 'please choose from the list' : '';
    e.target.setCustomValidity(message);
  }
  
  function handleFloodNC(e) {
    this.go.disabled = true;
    e.preventDefault();
    const type = this.ncType.value.trim().toLowerCase();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    if(refSplit.length > 0 && refSplit[0] !== '') {
      for(let ref of refSplit) {
        ref = ref.replace(",", "");
        if(ref.length < 8) {
          Meteor.call('floodNC', id, ref, type, (error)=>{
            error && console.log(error);
          });
        }else{
          Bert.alert({ 
            title: 'Caution',
            message: "Can't add '" + ref + "', A referance can only be 8 characters long",
            type: 'carrot'
          });
        }
      }
      this.ncRefs.value = '';
      this.go.disabled = false;
      Bert.alert({ 
        title: 'Recording Complete',
        message: "NonConformance has been added to all Work In Progress items",
        type: 'emerald'
      });
      const findBox = document.getElementById('lookup');
      findBox.focus();
    }else{null}
  }

	let lock = !live;
	
  return (
    <fieldset
        disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])}
        className='noBorder nomargin nospace'>
      <form
        className='actionForm'
        onSubmit={(e)=>handleFloodNC(e)}>
        <span>
          <input
            type='text'
            id='ncRefs'
            className='redIn up'
            placeholder={Pref.nonConRef}
            disabled={lock}
            required />
          <label htmlFor='ncRefs'>{Pref.nonConRef}</label>
        </span>
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
            {ncTypesComboFlat.length > 0 ?
              ncTypesComboFlat.map( (entry, index)=>{
                if(entry.live === true) {
                  return ( 
                    <option 
                      key={index}
                      data-id={entry.key}
                      value={entry.typeText}
                    >{entry.typeCode}</option>
                  );
              }})
            :
              app.nonConOption.map( (entry, index)=>{
                return ( 
                  <option
                    key={index}
                    data-id={index + 1 + '.'}
                    value={entry}
                  >{index + 1}</option>
                );
              })}
          </datalist>
        </span>
          <button
            type='submit'
            id='go'
            disabled={lock}
            className='smallAction clearRed bold'
          >Record On All WIP</button>
      </form>
    </fieldset>
  );
};

export default NCFlood;