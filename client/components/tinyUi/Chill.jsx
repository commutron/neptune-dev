import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

function brr() {
  Meteor.logout();
}

const Chill = ({ name })=> {
  let shortname = name ? name.split('.')[0] : '';
  return (
    <span className='actionIconWrap' title='Sign Out'>
      <input
        type='button'
        id='exitToggle'
        title='logout'
        onClick={brr}
        readOnly />
        <label htmlFor='exitToggle' id='exitSwitch' className='navIcon'>
          <i className='fa fa-user-times fa-lg' aria-hidden='true'></i>
          <span className='icontext cap'>{shortname}</span>
        </label>
    </span>
  );
};

export default Chill;