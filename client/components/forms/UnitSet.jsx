import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const UnitSet = ({ id, item, noText })=> {
  
  function unitSet(e) {
    const bar = item.serial;
    const unit = this.unit.value.trim();
    
    if(unit) {
      Meteor.call('setItemUnit', id, bar, unit, (error, reply)=>{
        if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
      });
    }else{null}
  }
        	    
  const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
  let done = item.finishedAt !== false;
    
  return(
    <ModelMedium
      button={Pref.unit + ' set'}
      title={'set ' + Pref.unit}
      color='greenT'
      icon='fa-th'
      lock={!auth}
      noText={noText}>
      <p className='centre centreTrue'>
      {done &&
        <b className='big'>
          This serial number is finished, are you sure you want to adjust how many units were included under this serial?
        </b>}
      <br />
      <input
        type='number'
        id='unit'
        pattern='[000-999]*'
        maxLength='3'
        minLength='1'
        max='100'
        min='1'
        defaultValue={item.units}
        placeholder='1-999'
        inputMode='numeric'
        required
        onChange={(e)=>unitSet(e)}
      />
      <label htmlFor='unit'>{Pref.unit} Quantity <em>max 999</em></label>
    </p>
  </ModelMedium>
  );
};

export default UnitSet;