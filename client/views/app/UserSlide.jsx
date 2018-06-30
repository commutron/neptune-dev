import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import AccountsUI from '/client/components/bigUi/AccountsUI.jsx';
import { AdminDown } from '/client/components/forms/AdminForm.jsx';
import LogoutOther from '/client/components/uUi/LogoutOther.jsx';
import { ChangeAutoScan } from '/client/components/forms/UserManageForm.jsx';
import { ChangeMinAction } from '/client/components/forms/UserManageForm.jsx';
import UserSpeedSet from '/client/components/forms/UserSpeedSet.jsx';
//import EmailForm from '/client/components/forms/EmailForm.jsx';
import { PermissionHelp } from '/client/views/app/appPanels/AccountsManagePanel';

export default class UserSlide extends Component	{
  
  constructor() {
    super();
    this.state = {
      show: false
   };
    this.reveal = this.reveal.bind(this);
  }
  reveal() {
    this.setState({ show: !this.state.show });
  }

  render() {
    
    const user = this.props.user;
    
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin'); 
    
    return (
      <span className=''>
        <span className='navButtonWrap' title={user.username + "'s\n" + 'preferences'}>
          <button
            type='button'
            className='navButtonWrap'
            onClick={this.reveal}
            readOnly>
            <i className='fas fa-id-card fa-fw navButtonIcon'></i>
            <i className='navButtonText'>{user.username}</i>
          </button>
        </span>
      
      
      {this.state.show &&
        <AnimateWrap type='modelTrans' el='span'>
          <div className='overlay invert' key={1}>
            <div className='popup'>
              <div className='popupHead'>
                <span>
                  <i className='fas fa-user-astronaut fa-lg'></i>
                  <i className='breath'></i>
                  {user.username}
                </span>
                <button
                  className='action clearRed rAlign'
                  onClick={this.reveal}
                  title='close'
                ><i className='fas fa-times fa-lg'></i></button>
              </div>
              <div className='popupContent'>
                <div className='balance'>
      
                  <div className='centre'>
                    <h2>Logged in as: <AccountsUI /></h2>
                    <p className='clean'>id: {Meteor.user()._id}</p>
                    <p>organization: <i className='greenT'>{Meteor.user().org}</i></p>
                    <p><LogoutOther /></p>
                    <p><ChangeAutoScan /></p>
                    <p><ChangeMinAction /></p>
                    <p><UserSpeedSet /></p>
                    <p>{/*<EmailForm />*/}</p>
                    
                    { admin ?
                    <div>
                      <AdminDown />
                    </div>
                  : null }
                  
                  
                  </div>
                  
                  <PermissionHelp roles={Meteor.user().roles} admin={admin} />
                  
                </div>
              </div>
            </div>
          </div>
        </AnimateWrap>
        }
      </span>
    );
  }
}