import React, {Component} from 'react';
// import { Accounts } from 'meteor/accounts-base'
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';
import { AdminUp } from '../forms/AdminForm.jsx';

export default class UserForm extends Component {
  
  forcePassword(e) {
    e.preventDefault();
    const check = window.confirm('Are you sure you to change this users password?');
    const newPass = prompt('New Password', '');
    const newConfirm = prompt('New Password Again', '');
    const self = Meteor.userId() === this.props.id;
    if(check && !self && newPass === newConfirm) {
      Meteor.call('forcePasswordChange', this.props.id, newPass, (error, reply)=>{
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning);
      });
    }else{
      alert('not allowed');
    }
  }
  
  
  hndlRemove() {
    const user = this.props.id;
    const pin = this.pIn.value;
    Meteor.call('removeFromOrg', user, pin, (err, reply)=>{
      if (err)
        console.log(err);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.warning);
      }
    });
  }

  render() {
    
    const active = Roles.userIsInRole(this.props.id, 'active') ? 'whiteT' : 'whiteT fade';
    const admin = Roles.userIsInRole(this.props.id, 'admin');
    const adminFlag = admin ? Pref.admin : '';
                     
    const roles = this.props.roles;

    return (
      <Model
        button={<i className='big'>{this.props.name}</i>}
        title={this.props.name + ' account profile'}
        color={active}
        icon='hide'>
        <h2 className='low'>{this.props.name}</h2>
        <p className='up'>id: {this.props.id}</p>
        <p className='blueT'>{adminFlag}</p>
        <p>organization: <i className='greenT'>{this.props.org}</i></p>
        <br />
        
        <div className='balance'>
          <fieldset className='min300'>
            <legend>Permissions</legend>
            <br />
            <ul>
              {roles.map( (entry, index)=>{
                return(
                  <SetCheck
                    key={index}
                    user={this.props.id}
                    role={entry}
                  />
                )})}
            </ul>
          </fieldset>
        
          <div>
          
            <AdminUp userId={this.props.id} />
            <br />
            {!admin ?
              <fieldset>
                <legend>Forgot Password</legend>
                <button
                  className='smallAction clear redT'
                  onClick={this.forcePassword.bind(this)}
                >Change Password</button>
              </fieldset>
            :null}
        
            {this.props.org && this.props.id !== Meteor.userId() ?
              // leaving an org is undesirable
              <fieldset>
                <legend>Remove from organization</legend>
                <input
                    type='password'
                    ref={(i)=> this.pIn = i}
                    id='pInNum'
                    pattern='[0000-9999]*'
                    maxLength='4'
                    minLength='4'
                    cols='4'
                    placeholder='Admin PIN'
                    inputMode='numeric'
                    autoComplete='new-password'
                    required
                  />
                <button 
                  onClick={this.hndlRemove.bind(this)}
                  className='smallAction red'
                  >Remove from Organization: "{this.props.org}"
                </button>
              </fieldset>
            : null}
            
          </div>
        </div>
      </Model>
          
      );
  }
}

class SetCheck extends Component	{
  
  change() {
    const check = Roles.userIsInRole(this.props.user, this.props.role);
    const flip = check ? 'permissionUnset' : 'permissionSet';
    Meteor.call(flip, this.props.user, this.props.role, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert('saved', 'success');
      }else{
        console.log("BLOCKED BY SERVER");
      }
    });
  }
  
  render() {
    
    const check = Roles.userIsInRole(this.props.user, this.props.role);
    const lockout = this.props.role === 'active' && 
                    this.props.user === Meteor.userId() ?
                    true : false;
    
    return(
      <li>
        <input
          type='checkbox'
          id={this.props.role}
          defaultChecked={check}
          onChange={this.change.bind(this)}
          readOnly 
          disabled={lockout} />
        <label htmlFor={this.props.role}>{this.props.role}</label>
        <br />
      </li>
      );
  }
}

export const ChangeAutoScan = ()=> {
  function handle() {
    Meteor.call('setAutoScan', (error)=>{
      if(error)
        console.log(error);
    });
  }
  let current = Meteor.user().autoScan ? 'OFF' : 'ON';
  let color = Meteor.user().autoScan ? 'clearRed' : 'clearGreen';
  return(
    <button
      className={'action clean ' + color}
      onClick={()=>handle()}
    >Turn Auto Scan {current}</button>
  );
};

export const ChangeMinAction = ()=> {
  function handle() {
    Meteor.call('setMinAction', (error)=>{
      if(error)
        console.log(error);
    });
  }
  let current = Meteor.user().miniAction ? 'OFF' : 'ON';
  let color = Meteor.user().miniAction ? 'clearRed' : 'clearGreen';
  return(
    <button
      className={'action clean ' + color}
      onClick={()=>handle()}
    >Turn Mini Actions {current}</button>
  );
};