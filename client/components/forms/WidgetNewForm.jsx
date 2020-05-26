import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';


const WidgetEditWrapper = ({ groupId, endTrack })=> (
  <ModelMedium
    button={'new ' + Pref.widget}
    title={'new ' + Pref.widget}
    color='greenT'
    icon='fa-cube'
    lock={!Roles.userIsInRole(Meteor.userId(), 'create')}>
    <WidgetNewForm
      groupId={groupId}
      endTrack={endTrack} 
    />
  </ModelMedium>
);

export default WidgetEditWrapper;

const WidgetNewForm = ({ groupId, endTrack })=> {

  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.prodiption.value.trim();
    
    Meteor.call('addNewWidget', newName, groupId, desc, endTrack, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/data/widget?request=' + newName);
        toast.success('Saved');
      }else{
        toast.error('Server Error');
        this.go.disabled = false;
      }
    });
  }

  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <p>
        <input
          type='text'
          id='nwNm'
          placeholder='ID ie. A4-R-0221'
          className='wide'
          autoFocus={true}
          required />
        <label htmlFor='nwNm'>{Pref.widget} ID</label>
      </p>
      <p>
        <input
          type='text'
          id='prodiption'
          placeholder='Description ie. CRC Display'
          className='wide'
          required />
        <label htmlFor='prodiption'>{Pref.widget} Description</label>
      </p>
      <br />
      <button
        type='submit'
        className='action clearGreen'
        id='go'
        disabled={false}>SAVE</button>
    </form>
  );
};