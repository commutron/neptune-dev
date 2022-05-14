import React from 'react';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';


const EventCustom = ({ batchId })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['edit','run']);

  return(
    <ModelSmall
      button='Add Event'
      title='Add Custom Event'
      color='nT'
      icon='fa-plus-square'
      lock={!access}
      lgIcon={true}
      inLine={true}
      textcolor='blackblackT med'
      overrideStyle={{display: 'flex', alignItems: 'center'}}
    >
      <EventForm 
        batchId={batchId}
      />
    </ModelSmall>
  );
};

export default EventCustom;
  
const EventForm = ({ batchId, selfclose })=> {
  
  function save(e) {
    e.preventDefault();
    this.gocevent.disabled = true;
    const title = this.titleVal.value;
    const detail = this.detailVal.value;
   
    Meteor.call('pushCustomEvent', batchId, title, detail, (error, re)=>{
      error && console.log(error);
      re && toast.success('Event Saved');
      selfclose();
    });
  }
  
  return(
    <div>
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
    </div>
  );
};