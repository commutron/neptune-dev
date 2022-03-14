import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { UserSelectSetting } from './UserSettings';
import { AdminUp } from './AdminForm';

const UserManageForm = ({ 
  userObj, id, name, org, 
  auths, areas, brancheS
})=> {
  
  const [ confirmState, confirmSet ] = useState(false);
  
  function forcePassword(e) {
    e.preventDefault();
    const newPass = this.forcepass.value.trim();
    const self = Meteor.userId() === id;
    if(!self && newPass) {
      Meteor.call('forcePasswordChange', id, newPass, (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
      });
    }else{
      toast.error('Not Allowed. Permission insufficient or PIN incorrect');
    }
    confirmSet(false);
  }

  const admin = Roles.userIsInRole(id, 'admin');
  const adminFlag = admin ? Pref.admin : '';

  const reqBrancheS = brancheS.filter( x => x.reqUserLock === true );
  
  const proTimeOps = [
    {value: 1, name: '100%' },
    {value: 0.8, name: '80%' },
    {value: 0.6, name: '60%' },
    {value: 0.5, name: '50%' },
    {value: 0.4, name: '40%' },
    {value: 0.2, name: '20%' },
    {value: 0, name: '0%' }
  ];
  const proTime = userObj.proTimeShare ? userObj.proTimeShare[0] : 1;
  const email = userObj.emails && userObj.emails[0] ? userObj.emails[0].address : '';
  
  return(
    <div>
      
      <span className='noPrint readPs'>
        <p><b>Username:</b> {name}</p>
        <p><b>Email:</b> {email}</p>
        <p><b>ID:</b> {id}</p>
        <p><b>{adminFlag}</b></p>
        <p><b>Organization:</b> <i className='blueT bold'>{org}</i></p>
        <p><b>Joined:</b> {userObj.createdAt.toLocaleString()}</p>
      </span>
      
      <div className='grid min300 max400'>
      {!userObj.proTimeShare ? null :
        <UserSelectSetting
          userSetting={proTime.timeAsDecimal}
          optionObjArr={proTimeOps}
          labelText='Production Time in a Day'
          yesText='The expected percentage on a "regular" day based on role. Used to messure potential capacity.'
          callMethod='updateProductionPercent'
          userID={id} />
      }
      </div>
      
      <div className='balance'>
        <fieldset className='readlines min200'>
          <legend>Account Permissions</legend>
          <dl>
            {auths.map( (entry, index)=>{
              if(entry === 'peopleSuper') {
                return(
                  <SetCheckSuper
                    key={index+'au'}
                    user={id}
                    role={entry}
                    roleName={entry}
                  />
              )}else{
                return(
                  <SetCheck
                    key={index+'au'}
                    user={id}
                    role={entry}
                    roleName={entry}
                  />
              )}})}
          </dl>
        </fieldset>
        
        <fieldset className='readlines min200'>
          <legend>Job Areas</legend>
          <dl>
            {areas.map( (entry, index)=>{
              return(
                <SetCheck
                  key={index+'ar'}
                  user={id}
                  role={entry}
                  roleName={entry}
                />
              )})}
          </dl>
        </fieldset>
        
        <fieldset className='readlines min200'>
          <legend>Task {Pref.branches}</legend>
          <dl>
            {reqBrancheS.map( (entry, index)=>{
              return(
                <SetCheck
                  key={index+'br'}
                  user={id}
                  role={'BRK'+entry.brKey}
                  roleName={entry.branch}
                />
              )})}
          </dl>
        </fieldset>
      </div>
      
      <div>
        <AdminUp userId={id} />
        <br />
        {!admin ?
          <fieldset>
            <legend>Forgot Password</legend>
            {!confirmState ?
              <button
                className='smallAction clearRed'
                onClick={(e)=>confirmSet(true)}
              >Change Password</button>
            :
              <div>
                <p><input
                  type='password'
                  id='forcepass'
                  className='showValid'
                  placeholder='password'
                  pattern='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
                  minLength='6'
                  autoComplete='new-password'
                  required
                /></p>
                <p><b>Are you sure? </b></p>
                <p><button
                  className='action clearBlue'
                  onClick={(e)=>forcePassword(e)}
                >YES, change password</button></p>
                <p><button
                  className='action clearBlack'
                  onClick={(e)=>confirmSet(false)}
                >NO</button></p>
              </div>
            }
          </fieldset>
        :null}
      </div>
        
    </div>
  );
};

export default UserManageForm;


const SetCheckSuper = ({ user, role, roleName })=>	{
  const check = Roles.userIsInRole(user, role);
  
  function changeSuper() {
    const flip = check ? 'superUserDisable' : 'superUserEnable';
    Meteor.call(flip, user, role, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast(`NOT ALLOWED.\nOnly ${Pref.allowedSupers} user(s) can have a "super" permission at a time`, 
          { autoClose: false });
        console.log("BLOCKED BY SERVER");
      }
    });
  }
  return(
    <dd>
      <label htmlFor={role} className='middle'>
        <input
          type='checkbox'
          id={role}
          title="only one user can have a 'super' permission at a time"
          defaultChecked={check}
          onChange={()=>changeSuper()}
          readOnly
      />{roleName}*</label>
    </dd>
  );
};

const SetCheck = ({ user, role, roleName })=> {
  const check = Roles.userIsInRole(user, role);
  
  function change() {
    const flip = check ? 'permissionUnset' : 'permissionSet';
    Meteor.call(flip, user, role, (error, reply)=>{
      error && console.log(error);
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
    <dd>
      <label htmlFor={role} className='middle'>
        <input
          type='checkbox'
          id={role}
          defaultChecked={check}
          onChange={()=>change()}
          readOnly 
          disabled={lockout} 
      />{roleName}</label>
    </dd>
  );
};
