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