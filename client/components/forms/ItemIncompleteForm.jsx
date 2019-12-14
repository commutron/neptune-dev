import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const ItemIncompleteForm = ({ id, item, app, noText })=> {
  
  function handleFinish(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchId = id;  
    const bar = item.serial;
    const comm = this.scomment.value.trim().toLowerCase();
    
    if(Roles.userIsInRole(Meteor.userId(), ['qa', 'run'])) {
      Meteor.call('finishIncompleteItem', batchId, bar, comm, (error, reply)=> {
        if(error)
          console.log(error);
        if(reply) {
          toast.success('Item Finished');
        }else{
          console.log('BLOCKED BY SERVER METHOD');
          toast.error('Server Error');
        }
      });
    }
  }
		
	let done = item.finishedAt !== false &&
	  item.history.find( x => x.key === 'f1n15h1t3m5t3p' );
  	
	return (
	  <ModelMedium
      button='Force Finish'
      title={`Force Finish ${Pref.item} Incomplete`}
      color='orangeT'
      icon='fa-flag-checkered'
      lock={!Roles.userIsInRole(Meteor.userId(), ['qa', 'run']) || done}
      noText={noText}>
    	<form className='centre' onSubmit={(e)=>handleFinish(e)}>
  	    <p>Skip the remaining flow and finish this item.
  	      <b> This will result in an incomplete record.</b></p>
	      <p>
          <textarea
            id='scomment'
            className=''
            placeholder='user discretion'
            rows='3'
            required></textarea>
          <label htmlFor='scomment'>reason for an irregular finish</label>
        </p>
        <p>
          <button 
            type="submit"
            id='go'
            className='action orangeHover orangeBorder'
            disabled={false}
            >Finish {item.serial}</button>
        </p>
      </form>
    </ModelMedium>
  );
};

export default ItemIncompleteForm;