import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import AccountsUI from '../../../components/bigUi/AccountsUI.jsx';
import { AdminDown } from '../../../components/forms/AdminForm.jsx';
import SetPin from '../../../components/forms/SetPin.jsx';
import LogoutOther from '../../../components/tinyUi/LogoutOther.jsx';
import EmailForm from '../../../components/forms/EmailForm.jsx';
import { PermissionHelp } from './AccountsManagePanel';

export default class AccountPanel extends Component {

  render() {
    
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin'); 
    const adminNice = admin ? Pref.admin : '';
    
    return (
      <div className='section'>
        <div className='space balance'>
        
          <div>
            <h2>Logged in as: <AccountsUI /></h2>
            <p className='up'>id: {Meteor.user()._id}</p>
            <p className='blueT'>{adminNice}</p>
            <p>organization: <i className='greenT'>{Meteor.user().org}</i></p>
            <br />
            <LogoutOther />
            <br />
            <EmailForm />
          </div>
          
          <PermissionHelp roles={Meteor.user().roles} admin={admin} />
          
          { admin ?
            <div>
              <SetPin />
              <br />
              <AdminDown />
            </div>
          : null }
          
        </div>
      </div>
    );
  }
}