import React from 'react';
import Pref from '/client/global/pref.js';

import AccountsUI from '../../../components/bigUi/AccountsUI.jsx';
import { AdminDown } from '../../../components/forms/AdminForm.jsx';
import LogoutOther from '../../../components/uUi/LogoutOther.jsx';
import { ChangeAutoScan } from '/client/components/forms/UserForm.jsx';
import { ChangeMinAction } from '/client/components/forms/UserForm.jsx';
import UserSpeedSet from '../../../components/forms/UserSpeedSet.jsx';
import EmailForm from '../../../components/forms/EmailForm.jsx';
import { PermissionHelp } from './AccountsManagePanel';

const AccountPanel = ()=> {
  
  const admin = Roles.userIsInRole(Meteor.userId(), 'admin'); 
  const adminNice = admin ? Pref.admin : '';
  
  return (
    <div className='section'>
      <div className='space balance'>
      
        <div className='centre'>
          <h2>Logged in as: <AccountsUI /></h2>
          <p className='up'>id: {Meteor.user()._id}</p>
          <p className='blueT'>{adminNice}</p>
          <p>organization: <i className='greenT'>{Meteor.user().org}</i></p>
          <br /><br />
          <LogoutOther />
          <br /><br />
          <ChangeAutoScan />
          <br /><br />
          <UserSpeedSet />
          <br /><br />
          <ChangeMinAction />
          <br /><br />
          <EmailForm />
        </div>
        
        <PermissionHelp roles={Meteor.user().roles} admin={admin} />
        
        { admin ?
          <div>
            <AdminDown />
          </div>
        : null }
        
      </div>
    </div>
  );
};

export default AccountPanel;