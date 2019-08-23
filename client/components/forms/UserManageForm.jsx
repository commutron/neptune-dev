import React, {Component} from 'react';
// import { Accounts } from 'meteor/accounts-base'
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';
import { AdminUp } from '../forms/AdminForm.jsx';

export default class UserManageForm extends Component {
  
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
        reply ? toast.success('Saved') : toast.error('Server Error');
      });
    }else{
      alert('not allowed');
    }
  }
  
  forceTideStop() {
    if( Roles.userIsInRole(Meteor.userId(), 'admin') ) {
      Meteor.call('forceStopUserTide', this.props.id, (error, reply)=>{
        if(error)
          console.log(error);
      });
    }
  }
  
  hndlRemove() {
    const user = this.props.id;
    const pin = this.pIn.value;
    Meteor.call('removeFromOrg', user, pin, (err, reply)=>{
      if (err)
        console.log(err);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }

  render() {
    
    const active = Roles.userIsInRole(this.props.id, 'active') ? 'blackT' : 'blackT fade';
    const admin = Roles.userIsInRole(this.props.id, 'admin');
    const adminFlag = admin ? Pref.admin : '';
                     
    const roles = this.props.roles;

    return (
      <Model
        button={<i className='big'>{this.props.name}</i>}
        title={this.props.name + "'s account permissions"}
        color={active}
        icon='hide'>
        <h2 className='low'>{this.props.name}</h2>
        <p className='clean'>id: {this.props.id}</p>
        <p className='blueT'>{adminFlag}</p>
        <p>organization: <i className='greenT'>{this.props.org}</i></p>
        <br />
        
        <div className='balance'>
          <fieldset className='min300'>
            <legend>Permissions</legend>
            <br />
            <ul>
              {roles.map( (entry, index)=>{
                if(entry === 'peopleSuper') {
                  return(
                    <SetCheckSuper
                      key={index}
                      user={this.props.id}
                      role={entry}
                    />
                )}else{
                  return(
                    <SetCheck
                      key={index}
                      user={this.props.id}
                      role={entry}
                    />
                )}})}
            </ul>
          </fieldset>
        
          <div>
          
            <div>
              <button
                className='smallAction clear redT'
                onClick={this.forceTideStop.bind(this)}
                disabled={!Roles.userIsInRole(Meteor.userId(), 'admin')}
              >Force Tide Stop</button>
            </div>
          
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


const SetCheckSuper = ({user, role})=>	{
  const check = Roles.userIsInRole(user, role);
  
  function changeSuper() {
    const flip = check ? 'superUserDisable' : 'superUserEnable';
    Meteor.call(flip, user, role, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast(`NOT ALLOWED. This requires authorization, \n 
                an admin cannot assign themselves a "super" permission \n
                and only one user can have a "super" permission at a time`, 
          { autoClose: false });
        console.log("BLOCKED BY SERVER");
      }
    });
  }
  return(
    <li>
      <input
        type='checkbox'
        id={role}
        title="only one user can have a 'super' permission at a time"
        defaultChecked={check}
        onChange={()=>changeSuper()}
        readOnly />
      <label htmlFor={role}>{role}*</label>
      <br />
    </li>
  );
};

class SetCheck extends Component	{
  
  change() {
    const check = Roles.userIsInRole(this.props.user, this.props.role);
    const flip = check ? 'permissionUnset' : 'permissionSet';
    Meteor.call(flip, this.props.user, this.props.role, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
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