import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import Pref from '/client/global/pref.js';

const HomeLogout = ({ currentUser })=> {

	function doLogout() {
	  const tideOut = !Meteor.user().engaged ? true : 
	    confirm(`You are currently ${Pref.engaged} with a ${Pref.batch}`);
		if(tideOut) {
		  if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
    	  const sessionID = Meteor.connection._lastSessionId;
    	  const agent = window.navigator.userAgent;
      	Meteor.call('logLogInOut', false, agent, sessionID);
  	  }
		  Meteor.logout();
	  }
	}
  
	return(
    <span className='navButtonWrap' title={'Sign Out\n' + currentUser}>
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