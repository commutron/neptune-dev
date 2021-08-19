import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import AppSetSimple from '/client/components/forms/AppSetSimple';

const AddressSlide = ({ app })=> {
  
  function handleAppParts(val) {
    Meteor.call('setPartsGlobal', val, (error, reply)=>{
      error && console.log(error);
      reply && toast.success('Saved');
    });
  }
  
  return(
    <div className='space3v autoFlex'>
      <div>
        <h2 className='cap'>{Pref.instruct} root address</h2>
        <i>The root address for embeded work instructions</i>
        <AppSetSimple
          title='address'
          action='setInstruct'
          rndmKey={Math.random().toString(36).substr(2, 5)} />
        <p>current: <i className='clean'>{app.instruct}</i></p>
      </div>
      <div>
        <h2 className='cap'>{Pref.helpDocs} address</h2>
        <i>The address for Neptune documentation</i>
        <AppSetSimple
          title='address'
          action='setHelpDocs'
          rndmKey={Math.random().toString(36).substr(2, 5)} />
        <p>current: <i className='clean'>{!app.helpDocs ? null : app.helpDocs}</i></p>
      </div>
      <div>
        <h2 className='cap'>{Pref.timeClock} address</h2>
        <i>For a 3rd party, employee time tracker</i>
        <AppSetSimple
          title='address'
          action='setTimeClock'
          rndmKey={Math.random().toString(36).substr(2, 5)} />
        <p>current: <i className='clean'>{app.timeClock}</i></p>
      </div>
      <div>
        <h2 className='cap'>Parts Search</h2>
        <p>Enable/Disable Parts Search Module and Variants Assembly Lists</p>
        <p className='beside'>
          <input
            type='checkbox'
            id='appPartsDo'
            className='medBig'
            defaultChecked={app.partsGlobal}
            onChange={()=>handleAppParts(!app.partsGlobal)}
            required
          />
          <label htmlFor='appPartsDo'>Enable Parts Search Module</label>
        </p>
      </div>
    </div>
  );
};

export default AddressSlide;