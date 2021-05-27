import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';


const WidgetNewWrapper = ({ groupId, lock })=> {
  const access = Roles.userIsInRole(Meteor.userId(), 'create');
  const aT = !access ? Pref.norole : '';
  const lT = lock ? `${Pref.group} is hibernated` : '';
  const title = access && !lock ? `New ${Pref.widget}` : `${aT}\n${lT}`;
  return(
    <ModelMedium
      button={'new ' + Pref.widget}
      title={title}
      color='greenT'
      icon='fa-cube'
      lock={!access || lock}>
      <WidgetNewForm
        groupId={groupId}
      />
    </ModelMedium>
  );
};

export default WidgetNewWrapper;

const WidgetNewForm = ({ groupId })=> {

  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.prodiption.value.trim();
    
    Meteor.call('addNewWidget', newName, groupId, desc, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/data/widget?request=' + newName);
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
          pattern='[A-Za-z0-9 _-]*'
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