import React from 'react';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const EventCustom = ({ batchId })=> {
  
  function save(e) {
    this.gocevent.disabled = true;
    const title = this.eventtitleVal.value;
    const detail = this.eventdetailVal.value;
   
    Meteor.call('pushCustomEvent', batchId, title, detail, (error, re)=>{
      error && console.log(error);
      re && toast.success('Event Saved');
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
              id='eventtitleVal'
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
              id='eventdetailVal'
              className='dbbleWide'
              required
            ></textarea>
            <label htmlFor='detailVal'>Details</label>
          </span>
        </p>
      
        <button
          type='submit'
          formMethod='dialog'
          id='gocevent'
          className='medBig action nSolid'
          form='ceventSave'
        >Save</button>
        
      </form>
    </ModelNative>
  );
};

export default EventCustom;