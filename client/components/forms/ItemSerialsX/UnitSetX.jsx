import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const UnitSetX = ({ seriesId, item, noText })=> {
  const access = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
  return(
    <ModelSmall
      button={Pref.unit + ' set'}
      title={access ? `Set ${Pref.unit}` : Pref.norole}
      color='blueT'
      icon='fa-th'
      lock={!access}
      noText={noText}
    >
      <UnitSetForm
        seriesId={seriesId}
        item={item} 
      />
    </ModelSmall>
  );
};

export default UnitSetX;
      
const UnitSetForm = ({ seriesId, item, selfclose })=> {
  
  function unitSet(e) {
    const bar = item.serial;
    const unit = this.unit.value.trim();
    
    if(unit) {
      Meteor.call('setItemUnitX', seriesId, bar, unit, (error, reply)=>{
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
        	    
  let done = item.completed !== false;
    
  return(
    <div className='centre centreText max300 wide'>
      {done &&
        <p className='bold medBig'
          >This serial number is finished, are you sure you want to adjust how many units were included under this serial?
        </p>}
      <p>
        <input
          type='number'
          id='unit'
          pattern='[0000-9999]*'
          maxLength='4'
          minLength='1'
          max='1000'
          min='1'
          defaultValue={item.units}
          placeholder='1-1000'
          inputMode='numeric'
          required
          onChange={(e)=>unitSet(e)}
        />
        <label htmlFor='unit'>{Pref.unit} Quantity <em>max 1000</em></label>
      </p>
    </div>
  );
};