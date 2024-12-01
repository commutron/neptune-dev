import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const ItemIncomplete = ({ seriesId, item, access })=> {
  
  function handleFinish(e) {
    e.preventDefault();
    this.inFinGo.disabled = true;
    const bar = item.serial;
    const comm = this.fincomment.value.trim();
    
    if(Roles.userIsInRole(Meteor.userId(), ['qa', 'run'])) {
      Meteor.call('finishIncompleteItemX', seriesId, bar, comm, (error, reply)=> {
        if(error)
          console.log(error);
        if(reply) {
          toast.success('Item Finished');
          // selfclose();
        }else{
          console.log('BLOCKED BY SERVER METHOD');
          toast.error('Server Error');
          this.inFinGo.disabled = false;
        }
      });
    }
  }
  	
	return(
	  <ModelNative
      dialogId={item.serial+'_incomplete_form'}
      title={`Force Finish Incomplete ${Pref.item}`}
      icon='fa-solid fa-flag-checkered'
      colorT='darkOrangeT'
      dark={false}>
	    
  	<form className='centre' onSubmit={(e)=>handleFinish(e)}>
	    <p>Skip the remaining flow and finish this item.
	      <b> This will result in an incomplete record.</b></p>
      <p>
        <textarea
          id='fincomment'
          placeholder='user discretion'
          rows='3'
          required></textarea>
        <label htmlFor='scomment'>reason for an irregular finish</label>
      </p>
      <p>
        <button 
          type="submit"
          id='inFinGo'
          className='action orangeSolid'
          disabled={false}
          >Finish {item.serial}</button>
      </p>
    </form>
    </ModelNative>
  );
};

export default ItemIncomplete;