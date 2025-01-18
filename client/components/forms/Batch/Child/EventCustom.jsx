import React from 'react';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const EventCustom = ({ batchId })=> {
  
  function save(e) {
    e.preventDefault();
    this.gocevent.disabled = true;
    const title = this.titleVal.value;
    const detail = this.detailVal.value;
   
    Meteor.call('pushCustomEvent', batchId, title, detail, (error, re)=>{
      error && console.log(error);
      re && toast.success('Event Saved');
      // selfclose();
    });
  }
  
  return(
    <ModelNative
      dialogId={batchId+'_event_form'}
      title='Add Custom Event'
      icon='fa-solid fa-location-pin'
      colorT='nT'>

      <form id='ceventSave' className='space centre' onSubmit={(e)=>save(e)}
      >
        <p>
          <span>
            <input
              type='text'
              id='titleVal'
              className='dbbleWide'
              autoFocus={true}
              required />
            <label htmlFor='titleVal'>Title</label>
          </span>
        </p>
        <p>
          <span>
            <textarea
              type='text'
              id='detailVal'
              className='dbbleWide'
              required
            ></textarea>
            <label htmlFor='detailVal'>Details</label>
          </span>
        </p>
      
        <button
          type='submit'
          id='gocevent'
          className='medBig'
          form='ceventSave'
          className='action nSolid'
        >Save</button>
        
      </form>
    </ModelNative>
  );
};

export default EventCustom;