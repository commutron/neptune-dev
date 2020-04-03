import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';

const UnitSetWrapper = ({ id, item, noText })=> {
        	    
  const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
    
  return(
    <ModelMedium
      button={Pref.unit + ' set'}
      title={'set ' + Pref.unit}
      color='greenT'
      icon='fa-th'
      lock={!auth}
      noText={noText}>
      <UnitSet
        id={id}
        item={item} />
    </ModelMedium>
  );
};

export default UnitSetWrapper;
      
const UnitSet = ({ id, item, selfclose })=> {
  
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
        	    
  let done = item.finishedAt !== false;
    
  return(
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
  );
};