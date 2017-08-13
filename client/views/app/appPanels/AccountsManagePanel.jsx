import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import UserForm from '../../../components/forms/UserForm.jsx';

export default class AccountsManagePanel extends Component {

  render() {
    
    return (
      <AnimateWrap type='cardTrans'>
        <div className='card' key={1}>
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
      </AnimateWrap>
    );
  }
}