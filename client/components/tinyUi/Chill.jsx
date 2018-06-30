import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React from 'react';
//import AccountsUI from '/client/components/bigUi/AccountsUI.jsx';

Accounts.onLogout( ()=>{
  Session.set('redirectAfterLogin', FlowRouter.current().path);
  FlowRouter.go('login');
});

function brr() {
  Meteor.logout();
}

const Chill = ()=> {
  return (
    <span className='actionIconWrap' title='Sign Out'>
      <input
        type='button'
        id='exitToggle'
        title='logout'
        onClick={()=>brr()}
        readOnly />
        <label htmlFor='exitToggle' id='exitSwitch' className='navIcon'>
          <i className='fas fa-sign-out-alt fa-lg' aria-hidden='true'></i>
          <span className='icontext cap'>Sign-out</span>
        </label>
    </span>
  );
};

export default Chill;


export const ChillHome = ({ currentUser })=> (
  <span className='navButtonWrap' title={'Sign Out\n' + currentUser}>
    <button
      type='button'
      id='homeExitButton'
      className='navButtonWrap'
      onClick={()=>brr()}
      readOnly>
      <i className='fas fa-sign-out-alt fa-fw navButtonIcon'></i>
      <i className='navButtonText'>Sign-out</i>
    </button>
  </span>
);