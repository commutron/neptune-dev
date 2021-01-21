import React from 'react';
//import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';


const RemoveItem = ({ batchId, batch, seriesId, serial, check, lockOut })=> (
  <ModelMedium
    button='Delete'
    title={`delete "${serial}"`}
    color='redT'
    icon='fa-minus-circle'
    lock={!Roles.userIsInRole(Meteor.userId(), 'remove') || lockOut}
  >
    <RemoveItemForm
      batchId={batchId}
      batch={batch}
      seriesId={seriesId}
      serial={serial}
      check={check}
    />
  </ModelMedium>
);  

export default RemoveItem;  
      
const RemoveItemForm = ({ batchId, batch, seriesId, serial, check })=> {
  
  function handleRemove(e) {
    e.preventDefault();
    this.cutGo.disabled = true;
    const confirm = this.confirmInput.value.trim();
    
    Meteor.call('deleteItemX', batchId, seriesId, serial, confirm, (err, reply)=>{
      err && console.log(err);
      if(reply === 'inUse') {
        toast.warning('Cannot do this, entry is in use');
      }else if(reply) {
        toast.success('Entry removed');
        FlowRouter.go(`/data/batch?request=${batch}`);
      }else{
        toast.error('Rejected by Server');
        this.cutGo.disabled = false;
      }
    });
  }
  
  let checkshort = check.split('T')[0];

  return(
    <div className='actionBox redT'>
      <br />
      <p>Are you sure you want to try to delete "{serial}"?</p>
      <p>This cannot be undone and could cause unexpected consequences.</p>
      <br />
      <p>Enter "<i className='noCopy'>{checkshort + ' '}</i>" to confirm.</p>
      <br />
      <form onSubmit={(e)=>handleRemove(e)} className='inlineForm'>
        <input
          type='text'
          id='confirmInput'
          placeholder={checkshort}
          autoFocus={true}
          className='noCopy redIn'
          required />
        <button
          className='smallAction clearRed'
          type='submit'
          id='cutGo'
          disabled={false}>DELETE</button>
      </form>
      <br />
    </div>
  );
};