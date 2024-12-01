import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
      
const UnitSet = ({ seriesId, item, access })=> {
  
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
    <ModelNative
      dialogId={item.serial+'_unit_form'}
      title={access ? `Set ${Pref.unit}` : Pref.norole}
      icon='fa-solid fa-th'
      colorT='blueT'
      dark={false}>
    
      <div className='centre centreText min200 max400 wide'>
        {done &&
          <p className='bold medBig'
            >This serial number is finished, are you sure you want to adjust how many units were included under this serial?
          </p>}
        <p>
          <input
            type='number'
            id='unit'
            className='miniIn12'
            pattern='[0000-9999]*'
            maxLength='4'
            minLength='1'
            max={Pref.unitLimit}
            min='1'
            defaultValue={item.units}
            placeholder={`1-${Pref.unitLimit}`}
            inputMode='numeric'
            required
            onChange={(e)=>unitSet(e)}
          />
          <label htmlFor='unit'>{Pref.unit} Quantity <em>max {Pref.unitLimit}</em></label>
        </p>
      </div>
    </ModelNative>
  );
};

export default UnitSet;