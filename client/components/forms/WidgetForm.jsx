import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '../smallUi/ModelSmall';


const WidgetWrapper = ({ fresh, groupId, now, lockOut })=> {
  const role = fresh ? 'create' : 'edit';
  const access = Roles.userIsInRole(Meteor.userId(), role);
  
  const aT = !access ? Pref.norole : '';
  const lT = lockOut ? `${Pref.group} is hibernated` : '';
  const lead = fresh ? 'New' : 'Edit';
  
  const label = `${lead} ${Pref.widget}`;
  const title = access && !lockOut ? `${lead} ${Pref.widget}` : `${aT}\n${lT}`;
  
  return(
    <ModelSmall
      button={label}
      title={title}
      color='blueT'
      icon='fa-cube'
      lock={!access || lockOut}>
      {fresh ?
        <WidgetNewForm groupId={groupId} />
      :
        <WidgetEditForm id={groupId} now={now} />
      }    
    </ModelSmall>
  );
};

export default WidgetWrapper;

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
    <form className='fitWide' onSubmit={(e)=>save(e)}>
      <p>
        <input
          type='text'
          id='nwNm'
          placeholder='ID ie. A4-R-0221'
          pattern='[A-Za-z0-9 _\-]*'
          autoFocus={true}
          required />
        <label htmlFor='nwNm'>{Pref.widget} ID</label>
      </p>
      <p>
        <input
          type='text'
          id='prodiption'
          placeholder='Description ie. CRC Display'
          className='wide min300'
          required />
        <label htmlFor='prodiption'>{Pref.widget} Description</label>
      </p>
      <br />
      <button
        type='submit'
        className='action nSolid'
        id='go'
        disabled={false}>SAVE</button>
    </form>
  );
};

const WidgetEditForm = ({ id, now })=> {

  function save(e) {
    e.preventDefault();
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.prodiption.value.trim();

    Meteor.call('editWidget', id, newName, desc, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/data/widget?request=' + newName);
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }

  return(
    <form className='fitWide' onSubmit={(e)=>save(e)}>
      <p>
        <input
          type='text'
          id='nwNm'
          defaultValue={now.widget}
          placeholder='ID ie. A4-R-0221'
          pattern='[A-Za-z0-9 _\-]*'
          autoFocus={true}
          required />
        <label htmlFor='nwNm'>{Pref.widget} ID</label>
      </p>
      <p>
        <input
          type='text'
          id='prodiption'
          defaultValue={now.describe}
          placeholder='Description ie. CRC Display'
          className='dbbleWide'
          required />
        <label htmlFor='prodiption'>{Pref.widget} Description</label>
      </p>
      <span className='centre'>
        <button
          type='submit' 
          className='action nSolid'
        >SAVE</button>
      </span>
    </form>
  );
};