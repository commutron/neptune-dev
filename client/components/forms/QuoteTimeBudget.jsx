import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


export const TimeBudgetUpgrade = ({ bID, isX })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const upgradeForQuoteTime = ()=> {
    if(auth) {
      Meteor.call('upBatchXTimeBudget', bID, (error)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };
  
  if(!isX) {
    return null;
  }
  
  return(
    <label>
      <button
        type='submit'
        title={auth ? 'upgrade' : Pref.norole}
        className='action greenHover'
        onClick={(e)=>upgradeForQuoteTime(e)}
        disabled={!auth}
      >Add Time Budget</button>
    </label>
  );
};

export const WholeTimeBudget = ({ bID, isX, lockOut })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const addTimeInHours = (e)=> {
    e.preventDefault();
    const inHours = parseFloat( e.target.hourNum.value );
    const inMinutes = moment.duration(inHours, 'hours').asMinutes();
    if(auth) {
      if(isX) {
        Meteor.call('pushBatchXTimeBudget', bID, inMinutes, (error)=>{
          if(error) {
            console.log(error);
            toast.error('Server Error');
          }
        });
      }else{
        Meteor.call('pushBatchTimeBudget', bID, inMinutes, (error)=>{
          if(error) {
            console.log(error);
            toast.error('Server Error');
          }
        });
      }
      e.target.hourNum.value = '';
    }else{ toast.error('NO Permission'); }
  };
  
  const aT = !auth ? Pref.norole : '';
  const lT = lockOut ? `${Pref.xBatch} is locked` : '';
  const title = auth && !lockOut ? `update quoted time budget\n in hours to 2 decimal places` : `${aT}\n${lT}`;
  
  return(
    <form 
      title={title}
      className='inlineForm'
      onSubmit={(e)=>addTimeInHours(e)}
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
        className='action clearGreen numberSet minIn7'
        disabled={!auth || lockOut}
      >Update {Pref.timeBudget}</button>
    </form>
  );
};