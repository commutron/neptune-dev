import React from 'react';
import Pref from '/client/global/pref.js';

const NCFlood = ({ id, live, app })=> {

  function handleFloodNC(e) {
    this.go.disabled = true;
    e.preventDefault();
    const type = this.ncType.value.trim().toLowerCase();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    if(refSplit.length > 0 && refSplit[0] !== '') {
      for(let ref of refSplit) {
        ref = ref.replace(",", "");
        if(ref.length < 9) {
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
    <form
      className='actionForm'
      onSubmit={(e)=>handleFloodNC(e)}>
      <fieldset
        disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])}
        className='noBorder'>
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
          >Record On All WIP</button>
      </fieldset>
    </form>
  );
};

export default NCFlood;