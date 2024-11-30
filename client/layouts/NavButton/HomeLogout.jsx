import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import { toast } from 'react-toastify';
import Pref from '/public/pref.js';
import './style';

const HomeLogout = ({ currentUser })=> {
  function doLogout() {
    if(currentUser.engaged) {
      toast.warning(`You are ${Pref.engaged} on ${Meteor.user().engaged.tName}\nCLICK TO SIGN OUT IMMEDIATELY`, 
        { autoClose: 10000,
         onClose: ()=> Meteor.logout()
        });
    }else{
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