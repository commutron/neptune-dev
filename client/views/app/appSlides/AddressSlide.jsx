import React from 'react';
import Pref from '/client/global/pref.js';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const AddressSlide = ({app})=> {
  
  return (
    <div>
      <h2 className='cap'>{Pref.instruct} root address</h2>
      <i>The root address for embeded work instructions</i>
      <AppSetSimple
        title='address'
        action='setInstruct'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <p>current: <i className='clean'>{app.instruct}</i></p>
      
      <h2 className='cap'>{Pref.helpDocs} address</h2>
      <i>The address for Neptune documentation</i>
      <AppSetSimple
        title='address'
        action='setHelpDocs'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <p>current: <i className='clean'>{!app.helpDocs ? null : app.helpDocs}</i></p>
      
      <h2 className='cap'>{Pref.timeClock} address</h2>
      <i>For a 3rd party, employee time tracker</i>
      <AppSetSimple
        title='address'
        action='setTimeClock'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <p>current: <i className='clean'>{app.timeClock}</i></p>
    </div>
  );
};

export default AddressSlide;