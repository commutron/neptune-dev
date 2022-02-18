import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium';
import { toCap } from '/client/utility/Convert';

const QuoteTimeBudget = ({ bID, lockOut })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  return(
    <ModelMedium
      button={Pref.timeBudget}
      title={Pref.timeBudget}
      color='blueT'
      icon='fa-hourglass-half gapR'
      lgIcon={true}
      inline={true}
      lock={!access}>
      <QuoteTimeBudgetForm
        bID={bID}
        auth={access}
        lockOut={lockOut}
      />
    </ModelMedium>
  );
};

export default QuoteTimeBudget;

const QuoteTimeBudgetForm = ({ bID, auth, lockOut, selfclose })=> {

  const setTimeInHours = (e)=> {
    e.preventDefault();
    const inHours = parseFloat( e.target.hourNum.value );
    const inMinutes = moment.duration(inHours, 'hours').asMinutes();
    if(auth) {
      Meteor.call('pushBatchXTimeBudget', bID, inMinutes, (error)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }else{
          selfclose();
        }
      });
      e.target.hourNum.value = '';
    }else{ toast.error('NO Permission'); }
  };
  
  const aT = !auth ? Pref.norole : '';
  const lT = lockOut ? `${Pref.xBatch} is locked` : '';
  const title = auth && !lockOut ? `update quoted time budget\n in hours to 2 decimal places` : `${aT}\n${lT}`;
  
  return(
    <div className='centre'>
      <p>{toCap(Pref.timeBudget)}</p>
      <form 
        title={title}
        className='inlineForm'
        onSubmit={(e)=>setTimeInHours(e)}
      >
        <input
          type='number'
          id='hourNum'
          className='numberSet miniIn8'
          pattern="^\d*(\.\d{0,2})?$"
          maxLength='7'
          minLength='1'
          max='10000'
          min='0.01'
          step=".01"
          inputMode='numeric'
          disabled={!auth || lockOut}
          required
        />
        <button
          type='submit'
          id='goscale'
          className='action clearBlue numberSet minIn7'
          disabled={!auth || lockOut}
        >Update {Pref.timeBudget}</button>
      </form>
    </div>
  );
};
