import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const UnitSetAll = ({ block, bdone, sqty, vqty, seriesId, noText })=> {
  const access = Roles.userIsInRole(Meteor.userId(), ['edit', 'qa']);
  return(
    <ModelSmall
      button={Pref.unit + ' Set All'}
      title={access ? `Set all ${Pref.unit}s` : Pref.norole}
      color='blueT'
      icon='fa-table'
      lock={!access || block}
      noText={noText}
    >
      <UnitSetAllForm
        seriesId={seriesId}
        bdone={bdone}
        sqty={sqty}
        vqty={vqty}
      />
    </ModelSmall>
  );
};

export default UnitSetAll;
      
const UnitSetAllForm = ({ seriesId, bdone, sqty, vqty, selfclose })=> {
  
  function handleUnits(e) {
    e.preventDefault();
    this.setallgo.disabled = true;
    
    toast.warn('Please Wait For Confirmation...', {
      toastId: ( seriesId + 'unitset' ),
      autoClose: false
    });
    
    const unit = this.unit.value.trim();
    
    Meteor.call('setAllItemUnits', seriesId, unit, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.update(( seriesId + 'unitset' ), {
          render: `All ${Pref.unit}s Saved`,
          type: toast.TYPE.SUCCESS,
          autoClose: 3000
        });
      }else{
        toast.update(( seriesId + 'unitset' ), {
          render: "Server Error",
          type: toast.TYPE.ERROR,
          autoClose: false
        });
      }
    });
  }
    
  return(
    <div className='centre centreText max400 wide'>
      <p className='med'>This will change all {sqty} {Pref.item} {Pref.unit}s</p>
      {bdone &&
        <p className='bold med'>This {Pref.xBatch} complete, are you sure?</p>}
      {sqty > 200 &&
        <p className='bold med'
          >You will be changing {sqty} {Pref.items} at once. This might cause delays for other users.</p>}
      <form onSubmit={(e)=>handleUnits(e)}>
        <p>
          <input
            type='number'
            id='unit'
            className='max100'
            pattern='[0000-9999]*'
            maxLength='4'
            minLength='1'
            max={Pref.unitLimit}
            min='1'
            defaultValue={vqty}
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