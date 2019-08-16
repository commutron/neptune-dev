import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


export const VersionQuoteTimeUpgrade = ({ wID, vKey })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const upgradeForQuoteTime = ()=> {
    if(auth) {
      Meteor.call('addQuoteTime', wID, vKey, (error)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };
  
  return(
    <label>
      <button
        type='submit'
        className='action greenHover'
        onClick={(e)=>upgradeForQuoteTime(e)}
        disabled={!auth}
      >Add Quote Times</button>
    </label>
  );
};


export const VersionQuoteBaseline = ({ wID, vKey })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const addBaseline = (e)=> {
    e.preventDefault();
    const baseTime = e.target.base.value;
    if(auth) {
      Meteor.call('pushBaselineTime', wID, vKey, baseTime, (error)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
      });
      e.target.base.value = '';
    }else{ toast.error('NO Permission'); }
  };
  
  return(
    <form className='inlineForm' onSubmit={(e)=>addBaseline(e)}>
      <input
        type='number'
        id='base'
        title={`update baseline quote\ntime in minutes`}
        className='numberSet numFont'
        pattern='[00000-99999]*'
        maxLength='5'
        minLength='1'
        max='10000'
        min='1'
        inputMode='numeric'
        disabled={!auth}
        required
      />
      <button
        type='submit'
        id='gobase'
        className='action greenHover numberSet'
        disabled={!auth}
      >Update</button>
    </form>
  );
};

export const VersionQuoteScalePer = ({ wID, vKey })=>	{
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  const addScalePer = (e)=> {
    e.preventDefault();
    const scaleTime = e.target.scale.value;
    if(auth) {
      Meteor.call('pushScaleTime', wID, vKey, scaleTime, (error)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
      });
      e.target.scale.value = '';
    }else{ toast.error('NO Permission'); }
  };
  
  return(
    <form className='inlineForm' onSubmit={(e)=>addScalePer(e)}>
      <input
        type='number'
        id='scale'
        title={`update scale (per item) quote\ntime in minutes`}
        className='numberSet numFont'
        pattern='[00000-99999]*'
        maxLength='5'
        minLength='1'
        max='10000'
        min='1'
        inputMode='numeric'
        disabled={!auth}
        required
      />
      <button
        type='submit'
        id='goscale'
        className='action greenHover numberSet'
        disabled={!auth}
      >Update</button>
    </form>
  );
};