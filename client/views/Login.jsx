import React from 'react';

import AccountsUI from '/client/components/bigUi/AccountsUI.jsx';

const Login = ()=> {
  Session.set('Meteor.loginButtons.dropdownVisible', true);
  return (
    <div className='centre'>
      <br />
      <br />
        <AccountsUI />
      <br />
      <br />
    </div>
  );
};

export default Login;