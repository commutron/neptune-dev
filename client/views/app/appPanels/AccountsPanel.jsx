import React, {Component} from 'react';

import RemoveUser from '../../../components/forms/RemoveUser.jsx';
import UserForm from '../../../components/forms/UserForm.jsx';
import OrgForm from '../../../components/forms/OrgForm.jsx';
import AdminForm from '../../../components/forms/AdminForm.jsx';
import SetPin from '../../../components/forms/SetPin.jsx';

export default class PrefPanel extends Component {

  render() {
    
    const admin = Meteor.user().admin ? 'Administrator' : '';
    const power = Meteor.user().power ? 'Poweruser' : '';

    return (
      <div className='card'>
        <div className='split'>
          <div className='half space'>
            <h2>Logged in as: {Meteor.user().username}</h2>
            <p className='up'>id: {Meteor.user()._id}</p>
            <p className='greenT'>{admin}</p>
            <p className='blueT'>{power}</p>
            <p>Organization: {Meteor.user().org}</p>
            <br />
            <SetPin />
            <br />
            <OrgForm
              org={Meteor.user().org}
              startup={false}
            />
            <RemoveUser />
            <br />
            <AdminForm />
            <hr />
            
            <br />
          </div>
          <div className='half space'>
            <h3>User Accounts</h3>
            <i>powerusers see users in thier organization, administrators see all users</i>
            {Meteor.user().power || Meteor.user().admin ?
              <ul>
                {this.props.users.map( (entry, index)=>{
                  return (
                    <li key={index}>
                      <UserForm
                        id={entry._id}
                        name={entry.username}
                        org={entry.org}
                        active={entry.active}
                        admin={entry.admin}
                        power={entry.power}
                        inspector={entry.inspector}
                        tester={entry.tester}
                        creator={entry.creator}
                      />
                    </li>
                    );
                })}
              </ul>
              :
              <i>blocked</i>}
          </div>
        </div>
      </div>
      );
  }
}