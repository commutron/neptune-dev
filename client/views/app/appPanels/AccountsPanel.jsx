import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import RoleCheck from '/client/components/utilities/RoleCheck.js';

import RemoveUser from '../../../components/forms/RemoveUser.jsx';
import UserForm from '../../../components/forms/UserForm.jsx';
import AdminForm from '../../../components/forms/AdminForm.jsx';
import SetPin from '../../../components/forms/SetPin.jsx';

export default class PrefPanel extends Component {

  render() {
    
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin') ? 'Administrator' : '';
    const power = Roles.userIsInRole(Meteor.userId(), 'power') ? 'Poweruser' : '';
    
    return (
      <SlideDownWrap>
      <div className='card'>
        <div className='split'>
          <div className='half space'>
            <h2>Logged in as: {Meteor.user().username}</h2>
            <p className='up'>id: {Meteor.user()._id}</p>
            <p className='greenT'>{admin}</p>
            <p className='blueT'>{power}</p>
            <p className='cap'>organization: {Meteor.user().org}</p>
            <br />
            <SetPin />
            <br />
            <RemoveUser />
            <br />
            <AdminForm />
            <hr />
            <br />
          </div>
          <div className='half space'>
            <h3>User Accounts</h3>
            <i>powerusers see users in thier organization, administrators see all users</i>
            <RoleCheck role={['power', 'admin']}>
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