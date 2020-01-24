import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// requires
// id={widget._id} now={widget}

const WidgetEditForm = (props)=> {

  function save(e) {
    e.preventDefault();
    const wId = props.id;
    const newName = this.nwNm.value.trim().toLowerCase();
    const desc = this.prodiption.value.trim();

    Meteor.call('editWidget', wId, newName, desc, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
        FlowRouter.go('/data/widget?request=' + newName);
      }else{
        toast.error('Server Error');
      }
    });
  }

  return(
    <Model
      button={'Edit ' + Pref.widget}
      title={'edit ' + Pref.widget}
      color='greenT'
      icon='fa-cube'
      lock={!Roles.userIsInRole(Meteor.userId(), 'edit')}
      noText={props.noText}>
      <form className='centre' onSubmit={(e)=>save(e)}>
        <p>
          <input
            type='text'
            id='nwNm'
            defaultValue={props.now.widget}
            placeholder='ID ie. A4-R-0221'
            autoFocus={true}
            required />
          <label htmlFor='nwNm'>{Pref.widget} ID</label>
        </p>
        <p>
          <input
            type='text'
            id='prodiption'
            defaultValue={props.now.describe}
            placeholder='Description ie. CRC Display'
            required />
          <label htmlFor='prodiption'>{Pref.widget} Description</label>
        </p>
        <br />
        <button type='submit' className='action clearGreen'>SAVE</button>
      </form>
    </Model>
  );
};

export default WidgetEditForm;