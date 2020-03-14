import React from 'react';
// import { Accounts } from 'meteor/accounts-base'
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { AdminUp } from '../forms/AdminForm.jsx';

const UserManageForm = (props)=> {
  
  function forcePassword(e) {
    e.preventDefault();
    const check = window.confirm('Are you sure you to change this users password?');
    const newPass = prompt('New Password', '');
    const newConfirm = prompt('New Password Again', '');
    const self = Meteor.userId() === props.id;
    if(check && !self && newPass === newConfirm) {
      Meteor.call('forcePasswordChange', props.id, newPass, (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
      });
    }else{
      alert('not allowed');
    }
  }
  
  function hndlRemove(e) {
    const user = props.id;
    const pin = this.pInNum.value;
    Meteor.call('removeFromOrg', user, pin, (err, reply)=>{
      err && console.log(err);
      reply ? toast.success('Saved') : toast.error('Server Error');
    });
  }

  const admin = Roles.userIsInRole(props.id, 'admin');
  const adminFlag = admin ? Pref.admin : '';
                   
  const auths = props.auths;
  const areas = props.areas;

  return(
    <div>
      
      <h3>Username: <i className='biggest'>{props.name}</i></h3>
      <h3 className='clean'>ID: {props.id}</h3>
      <p className='blueT'>{adminFlag}</p>
      <p>organization: <i className='greenT'>{props.org}</i></p>
      
      <div className=''>
        <fieldset className=''>
          <legend>Account Permissions</legend>
          <br />
          <ul>
            {auths.map( (entry, index)=>{
              if(entry === 'peopleSuper') {
                return(
                  <SetCheckSuper
                    key={index}
                    user={props.id}
                    role={entry}
                  />
              )}else{
                return(
                  <SetCheck
                    key={index}
                    user={props.id}
                    role={entry}
                  />
              )}})}
          </ul>
        </fieldset>
        
        <fieldset className=''>
          <legend>Job Areas</legend>
          <br />
          <ul>
            {areas.map( (entry, index)=>{
              return(
                <SetCheck
                  key={index}
                  user={props.id}
                  role={entry}
                />
              )})}
          </ul>
        </fieldset>
      
        <div>
        
          <AdminUp userId={props.id} />
          <br />
          {!admin ?
            <fieldset>
              <legend>Forgot Password</legend>
              <button
                className='smallAction clear redT'
                onClick={(e)=>forcePassword(e)}
              >Change Password</button>
            </fieldset>
          :null}
      
          {props.org && props.id !== Meteor.userId() ?
            // leaving an org is undesirable
            <fieldset>
              <legend>Remove from organization</legend>
              <input
                type='password'
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
                onClick={(e)=>hndlRemove(e)}
                className='smallAction red'
                >Remove from Organization: "{props.org}"
              </button>
            </fieldset>
          : null}
          
        </div>
      </div>
    </div>
  );
};

export default UserManageForm;


const SetCheckSuper = ({ user, role })=>	{
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
                only one user can have a "super" permission at a time`, 
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

const SetCheck = ({ user, role })=> {
  const check = Roles.userIsInRole(user, role);
  
  function change() {
    const flip = check ? 'permissionUnset' : 'permissionSet';
    Meteor.call(flip, user, role, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        console.log("BLOCKED BY SERVER");
      }
    });
  }
  
  const lockout = role === 'active' && 
                  user === Meteor.userId() ?
                  true : false;
    
  return(
    <li>
      <input
        type='checkbox'
        id={role}
        defaultChecked={check}
        onChange={()=>change()}
        readOnly 
        disabled={lockout} />
      <label htmlFor={role}>{role}</label>
      <br />
    </li>
  );
};

export const ChangeAutoScan = ()=> {
  function handle() {
    Meteor.call('setAutoScan', (error)=>{
      if(error)
        console.log(error);
    });
  }
  let current = Meteor.user().autoScan ? 'ON' : 'OFF';
  let color = Meteor.user().autoScan ? 'clearGreen' : 'clearRed';
  return(
    <p>Auto Scan 
      <button
        className={'action clean ' + color}
        onClick={()=>handle()}
      >{current}</button>
    </p>
  );
};

export const ChangeNCcodes = ()=> {
  function handle() {
    Meteor.call('setUserNCcodes', (error)=>{
      if(error)
        console.log(error);
    });
  }
  let current = Meteor.user().showNCcodes ? 'ON' : 'OFF';
  let color = Meteor.user().showNCcodes ? 'clearGreen' : 'clearRed';
  return(
    <p>Use {Pref.nonCon} codes 
      <button
        className={'action clean ' + color}
        onClick={()=>handle()}
      >{current}</button>
    </p>
  );
};

export const ChangeNCselection = ()=> {
  function handle() {
    Meteor.call('setUserNCselection', (error)=>{
      if(error)
        console.log(error);
    });
  }
  let current = Meteor.user().typeNCselection ? 'ON' : 'OFF';
  let color = Meteor.user().typeNCselection ? 'clearGreen' : 'clearRed';
  return(
    <p>Type search {Pref.nonCon} list 
      <button
        className={'action clean ' + color}
        onClick={()=>handle()}
      >{current}</button>
    </p>
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