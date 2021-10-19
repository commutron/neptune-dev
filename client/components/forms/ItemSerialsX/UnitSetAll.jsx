import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const UnitSetAll = ({ block, bdone, bqty, seriesId, noText })=> {
  const access = Roles.userIsInRole(Meteor.userId(), ['edit', 'qa']);
  return(
    <ModelSmall
      button={Pref.unit + ' Set All'}
      title={access ? `Set All ${Pref.unit}s` : Pref.norole}
      color='blueT'
      icon='fa-table'
      lock={!access || block}
      noText={noText}
    >
      <UnitSetAllForm
        seriesId={seriesId}
        bdone={bdone}
        bqty={bqty}
      />
    </ModelSmall>
  );
};

export default UnitSetAll;
      
const UnitSetAllForm = ({ seriesId, bdone, bqty, selfclose })=> {
  
  function handleUnits(e) {
    e.preventDefault();
    this.setallgo.disabled = true;
    
    const unit = this.unit.value.trim();
    
    Meteor.call('setAllItemUnits', seriesId, unit, (error, reply)=>{
      if(error)
      console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
    
  return(
    <div className='centre centreText max300 wide'>
      <p className='medBig'>This will change all {bqty} {Pref.item} {Pref.unit}s</p>
      {bdone &&
        <p className='bold medBig'>This {Pref.xBatch} complete, are you sure?</p>}
      {bqty > 250 &&
        <p className='bold medBig'
          >You will be changing {bqty} {Pref.items} at once. This might cause delays for other users.</p>}
      <form onSubmit={(e)=>handleUnits(e)}>
        <p>
          <input
            type='number'
            id='unit'
            pattern='[0000-9999]*'
            maxLength='4'
            minLength='1'
            max={Pref.unitLimit}
            min='1'
            placeholder={`1-${Pref.unitLimit}`}
            inputMode='numeric'
            required
          />
          <label htmlFor='unit'>{Pref.unit} Quantity <em>max {Pref.unitLimit}</em></label>
        </p>
        <p>
          <button
            id='setallgo'
            className='action clearBlue'
          >Set All</button>
        </p>
      </form>
    </div>
  );
};