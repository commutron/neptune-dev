import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import Pref from '/client/global/pref.js';

const HomeLogout = ({ currentUser })=> {
  function doLogout() {
	  const tideOut = !currentUser.engaged ? true : 
	    confirm(`You are ${Pref.engaged} on ${currentUser.engaged.tName}`);
		if(tideOut) {
		  Meteor.logout();
	  }
	}
	
	return(
    <span className='navButtonWrap' title={'Sign Out\n' + currentUser.username}>
      <button
        type='button'
        id='homeExitButton'
        className='navButtonWrap'
        onClick={()=>doLogout()}
        readOnly>
        <i className='fas fa-sign-out-alt fa-fw navButtonIcon'></i>
        <i className='navButtonText'>Sign-out</i>
      </button>
    </span>
  );
};

export default HomeLogout;