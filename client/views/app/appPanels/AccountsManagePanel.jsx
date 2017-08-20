import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import UserForm from '../../../components/forms/UserForm.jsx';

export default class AccountsManagePanel extends Component {

  render() {
    
    return (
      <div className='card'>
        <div className='split'>
          <div className='half space'>
            <h3>User Accounts</h3>
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
          </div>
          <div className='half space'>
            
          </div>
        </div>
      </div>
    );
  }
}