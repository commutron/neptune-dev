import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


export const TimeBudgetUpgrade = ({ bID, isX })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const upgradeForQuoteTime = ()=> {
    if(auth) {
      if(isX) {
        Meteor.call('upBatchXTimeBudget', bID, (error)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
      });
      }else{
        Meteor.call('upBatchTimeBudget', bID, (error)=>{
          if(error) {
            console.log(error);
            toast.error('Server Error');
          }
        });
      }
    }else{ toast.error('NO Permission'); }
  };
  
  return(
    <label>
      <button
        type='submit'
        className='action greenHover'
        onClick={(e)=>upgradeForQuoteTime(e)}
        disabled={!auth}
      >Add Time Budget</button>
    </label>
  );
};

export const WholeTimeBudget = ({ bID, isX })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const addTimeInHours = (e)=> {
    e.preventDefault();
    const inHours = parseFloat( e.target.hourNum.value );
    const inMinutes = moment.duration(inHours, 'hours').asMinutes();
    //const niceMinutes = Math.round(inMinutes);
    const clientTZ = moment.tz.guess();
    if(auth) {
      if(isX) {
        Meteor.call('pushBatchXTimeBudget', bID, inMinutes, clientTZ, (error)=>{
          if(error) {
            console.log(error);
            toast.error('Server Error');
          }
        });
      }else{
        Meteor.call('pushBatchTimeBudget', bID, inMinutes, clientTZ, (error)=>{
          if(error) {
            console.log(error);
            toast.error('Server Error');
          }
        });
      }
      e.target.hourNum.value = '';
    }else{ toast.error('NO Permission'); }
  };
  
  return(
    <form className='inlineForm' onSubmit={(e)=>addTimeInHours(e)}>
      <input
        type='number'
        id='hourNum'
        title={`update quoted time budget\n in hours to 2 decimal places`}
        className='numberSet miniIn8'
        pattern="^\d*(\.\d{0,2})?$"
        maxLength='6'
        minLength='1'
        max='1000'
        min='0.01'
        step=".01"
        inputMode='numeric'
        disabled={!auth}
        required
      />
      <button
        type='submit'
        id='goscale'
        className='action clearGreen numberSet minIn7'
        disabled={!auth}
      >Update {Pref.timeBudget}</button>
    </form>
  );
};