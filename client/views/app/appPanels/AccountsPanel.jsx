import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import RoleCheck from '/client/components/utilities/RoleCheck.js';

import AccountsUI from '../../../components/bigUi/AccountsUI.jsx';
import RemoveUser from '../../../components/forms/RemoveUser.jsx';
import UserForm from '../../../components/forms/UserForm.jsx';
import { AdminDown } from '../../../components/forms/AdminForm.jsx';
import SetPin from '../../../components/forms/SetPin.jsx';
import EmailForm from '../../../components/forms/EmailForm.jsx';

export default class PrefPanel extends Component {

  render() {
    
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin') ? Pref.admin : '';
    
    return (
      <SlideDownWrap>
      <div className='card'>
        <div className='split'>
          <div className='half space'>
            <h2>Logged in as: <AccountsUI /></h2>
            <p className='up'>id: {Meteor.user()._id}</p>
            <p className='blueT'>{admin}</p>
            <p>organization: <i className='greenT'>{Meteor.user().org}</i></p>
            <br />
            <EmailForm />
            <br />
            <SetPin />
            <br />
            <RemoveUser />
            <br />
            <AdminDown />
            <hr />
            <br />
          </div>
          <div className='half space'>
            <h3>User Accounts</h3>
            <i>Admins see users in thier organization</i>
            <RoleCheck role='admin'>
              <ul>
                {this.props.users.map( (entry, index)=>{
                  return (
                    <li key={index}>
                      <UserForm
                        id={entry._id}
                        name={entry.username}
                        org={entry.org}
                      />
                    </li>
                    );
                })}
              </ul>
            </RoleCheck>
          </div>
        </div>
      </div>
      </SlideDownWrap>
    );
  }
}