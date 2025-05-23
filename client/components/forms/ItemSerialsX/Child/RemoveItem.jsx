import React from 'react';
// import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const RemoveItem = ({ batchId, batch, seriesId, serial, check, verify })=> {
  
  function handleRemove() {
    this.cutGo.disabled = true;
    const confirm = this.confirmInput.value.trim();
    
    const pinVal = this.orgPINitem ? this.orgPINitem.value : undefined;
    
    Meteor.call('deleteItemX', batchId, seriesId, serial, confirm, pinVal,
    (err, reply)=>{
      err && console.log(err);
      if(reply === 'inUse') {
        toast.warning('You cannot do this, entry is in use');
      }else if(reply) {
        toast.success('Item removed');
        FlowRouter.go(`/data/batch?request=${batch}`);
      }else{
        toast.error('Rejected by Server');
        this.cutGo.disabled = false;
      }
    });
  }
  
  let checkshort = check.split('T')[0];

  return(
    <ModelNative
      dialogId={serial+'_remove_form'}
      title={`Delete "${serial}"`}
      icon='fa-solid fa-minus-circle'
      colorT='redT'
      dark={false}>
      
    <div className='actionBox centre centreText space2vsq'>
      <p><b>Are you sure you want to try to delete "{serial}"?</b></p>
      <p><b>This cannot be undone and could cause unexpected consequences.</b></p>
      <form onSubmit={(e)=>handleRemove(e)} className='centre'>
        <p className='max250'>
          <span>Enter "<i className='noCopy'>{checkshort + ' '}</i>" to confirm.</span>
          <br />
          <input
          type='text'
          id='confirmInput'
          placeholder={checkshort}
          autoFocus={true}
          className='noCopy'
          required />
        </p>
        {verify &&
          <p className='max250'>
            <span>Deleting a serial number with history requires the Org PIN</span>
            <br />
            <input
              id='orgPINitem'
              autoComplete="false"
              className='noCopy miniIn12 interSelect centreText gap redT'
              pattern='[\d\d\d\d]*'
              maxLength='4'
              minLength='4'
              placeholder='PIN'
              required />
          </p>
        }
        <button
          className='action redSolid'
          type='submit'
          formMethod='dialog'
          id='cutGo'
          disabled={false}>DELETE</button>
      </form>
      <br />
    </div>
    </ModelNative>
  );
};

export default RemoveItem;