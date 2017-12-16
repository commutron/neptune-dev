import React from 'react';

import AccountsUI from '/client/components/bigUi/AccountsUI.jsx';

const Login = ()=> {
  Session.set('Meteor.loginButtons.dropdownVisible', true);
  return (
    <div>
      <br />
      <br />
        <AccountsUI />
      <br />
      <br />
    </div>
  );
};

export default Login;