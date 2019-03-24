import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React from 'react';

Accounts.onLogout( ()=>{
  Session.set('redirectAfterLogin', FlowRouter.current().path);
  FlowRouter.go('login');
});

const HomeLogout = ({ currentUser })=> {
  
  function doLogout() {
    if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
  		Meteor.call('logLog', false, ()=>{
  			Meteor.logout();
  		});
    }else{
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
}

export default HomeLogout;