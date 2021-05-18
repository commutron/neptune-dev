import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const ItemIncompleteX = ({ seriesId, item, app, noText })=> {
  
  const done = item.completed;
  const access = Roles.userIsInRole(Meteor.userId(), ['qa', 'run']);
  const aT = !access ? Pref.norole : '';
  const lT = done ? `${Pref.item} ${Pref.isDone}` : '';
  const title = access && !done ? `Force Finish Incomplete ${Pref.item}` : `${aT}\n${lT}`;
  
	return(
    <ModelMedium
      button='Force Finish'
      title={title}
      color='darkOrangeT'
      icon='fa-flag-checkered'
      lock={!access || done}
      noText={noText}>
      <ItemIncompleteForm
        seriesId={seriesId}
        item={item}
        app={app} />
  	</ModelMedium>
  );
};

export default ItemIncompleteX;     
	        
const ItemIncompleteForm = ({ seriesId, item, app, selfclose })=> {
  
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
          selfclose();
        }else{
          console.log('BLOCKED BY SERVER METHOD');
          toast.error('Server Error');
          this.inFinGo.disabled = false;
        }
      });
    }
  }
  	
	return(
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
          className='action orangeHover orangeBorder'
          disabled={false}
          >Finish {item.serial}</button>
      </p>
    </form>
  );
};