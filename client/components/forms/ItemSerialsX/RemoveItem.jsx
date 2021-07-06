import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';


const RemoveItem = ({ batchId, batch, seriesId, serial, check, verify, lockOut })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), 'remove');
  const aT = !access ? Pref.norole : '';
  const lT = lockOut ? lockOut : '';
  const title = access && !lockOut ? `Delete "${serial}"` : `${aT}\n${lT}`;
  
  return(
    <ModelMedium
      button='Delete'
      title={title}
      color='redT'
      icon='fa-minus-circle'
      lock={!access || lockOut}
    >
      <RemoveItemForm
        batchId={batchId}
        batch={batch}
        seriesId={seriesId}
        serial={serial}
        check={check}
        verify={verify}
      />
    </ModelMedium>
  );  
};

export default RemoveItem;  
      
const RemoveItemForm = ({ batchId, batch, seriesId, serial, check, verify })=> {
  
  function handleRemove(e) {
    e.preventDefault();
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
              className='noCopy miniIn12 interSelect centreText gap redHover'
              pattern='[\d\d\d\d]*'
              maxLength='4'
              minLength='4'
              placeholder='PIN'
              required />
          </p>
        }
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