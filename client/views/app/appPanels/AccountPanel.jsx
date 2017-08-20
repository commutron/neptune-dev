import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import RoleCheck from '/client/components/utilities/RoleCheck.js';

import AccountsUI from '../../../components/bigUi/AccountsUI.jsx';
import RemoveUser from '../../../components/forms/RemoveUser.jsx';
import { AdminDown } from '../../../components/forms/AdminForm.jsx';
import SetPin from '../../../components/forms/SetPin.jsx';
import LogoutOther from '../../../components/tinyUi/LogoutOther.jsx';
import EmailForm from '../../../components/forms/EmailForm.jsx';

export default class AccountPanel extends Component {

  render() {
    
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin') ? Pref.admin : '';
    
    return (
      <div className='card'>
        <div className='split'>
          <div className='half space'>
            <h2>Logged in as: <AccountsUI /></h2>
            <p className='up'>id: {Meteor.user()._id}</p>
            <p className='blueT'>{admin}</p>
            <p>organization: <i className='greenT'>{Meteor.user().org}</i></p>
            <br />
            <LogoutOther />
            <br />
            <EmailForm />
            <br />
            <RemoveUser />
          </div>
          <RoleCheck role='admin'>
            <div className='half space'>
              <SetPin />
              <br />
              <AdminDown />
            </div>
          </RoleCheck>
        </div>
      </div>
    );
  }
}