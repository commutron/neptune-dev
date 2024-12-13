import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/layouts/Models/ModelSmall';

const RemoveRapid = ({ batchId, rapidId, lockOut })=> (
  <ModelSmall
    button='Delete'
    title={`Delete ${Pref.rapidExd}`}
    color='redT gap'
    icon='fa-trash'
    lock={lockOut}
  >
    <RemoveRapidForm
      batchId={batchId}
      rapidId={rapidId}
    />
  </ModelSmall>
);

export default RemoveRapid;  
      
const RemoveRapidForm = ({ batchId, rapidId })=> {
  
  function handleRemove(e) {
    e.preventDefault();
    this.cutRapGo.disabled = true;
    const confirm = this.orgPINrapid.value;
    
    if(confirm) {
      Meteor.call('deleteExtendRapid', rapidId, batchId, confirm,
      (error, re)=>{
        error && console.log(error);
        re ? toast.success('success') : toast.error('unsuccessful');
      });
    }
  }

  return(
    <div className='actionBox centre centreText space2vsq'>
      <p><b>This cannot be undone.</b></p>
      <form onSubmit={(e)=>handleRemove(e)} className='centre'>
        <div className='max250'>
          <p>Enter the Org PIN to confirm.</p>
          <span className='inlineForm'>
            <input
              id='orgPINrapid'
              autoComplete="false"
              className='noCopy miniIn12 interSelect centreText'
              pattern='[\d\d\d\d]*'
              maxLength='4'
              minLength='4'
              placeholder='PIN'
              required 
            />
            <button
              className='smallAction redHover'
              type='submit'
              id='cutRapGo'
              disabled={false}
            >DELETE</button>
          </span>
        </div>
      </form>
    </div>
  );
};