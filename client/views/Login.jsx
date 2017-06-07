import React, {Component} from 'react';

import AccountsUI from '../components/bigUi/AccountsUI.jsx';

export default class Login extends Component	{

  render() {
    
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
  }
}