import React from 'react';
// import { Accounts } from 'meteor/accounts-base'
import Pref from '/client/global/pref.js';
// import { toast } from 'react-toastify';

import UsernameChange from './UsernameChange';
import PasswordChange from './PasswordChange';

import { AdminDown } from './AdminForm.jsx';


const UserSettings = ({ app, user, isAdmin, brancheS })=> {
  
  const sup = Roles.userIsInRole(Meteor.userId(), ['admin', 'nightly']);
  
  const speedOps = [
    {value: 100, lock: !sup, name: 'Too Fast' },
    {value: 250, lock: !sup, name: 'Crazy Fast' },
    {value: 500, name: 'Very Fast' },
    {value: 1000, name: 'Fast' },
    {value: 1500, name: 'Medium' },
    {value: 2000, name: 'Slow' }
  ];
  
  const overTopOp = [{ value: false, name: 'All' }];
  const overBrOps = Array.from(brancheS, x => {
    return { value: x.branch, name: x.branch };
  });
  const overOps = [...overTopOp,...overBrOps];
  
  return(
    <div className='comfort'>
      
      <div className=''>
        <h3 className='clean'>Username: {user.username}</h3>
        <h3 className='clean'>ID: {Meteor.user()._id}</h3>
        <h3>Organization: <i className='greenT'>{Meteor.user().org}</i></h3>
        <hr />
        
        <div className='grid vspace'>
        
          <UserToggleSetting
            userSetting={Meteor.user().miniAction}
            labelText='Prefer Mini / Dense'
            callMethod='setUserMiniPrefer' />
            
          <UserToggleSetting
            userSetting={Meteor.user().preferLight}
            labelText='Prefer Light Theme'
            callMethod='setUserLightPrefer' />
            
          <UserToggleSetting
            userSetting={Meteor.user().autoScan}
            labelText='Auto Scan'
            callMethod='setAutoScan' />
            
          <UserToggleSetting
            userSetting={Meteor.user().scrollInstruct}
            labelText={`Autoscroll To Instruction Section`}
            callMethod='setUserAutoscrollI' />
          
          <UserToggleSetting
            userSetting={Meteor.user().showNCcodes}
            labelText={`Show ${Pref.nonCon} Codes`}
            callMethod='setUserNCcodes' />
            
          <UserToggleSetting
            userSetting={Meteor.user().typeNCselection}
            labelText={`Search ${Pref.nonCon} Type List`}
            callMethod='setUserNCselection' />
          
          <UserSelectSetting
            userSetting={Meteor.user().unlockSpeed || 2000}
            optionObjArr={speedOps}
            labelText='Step Unlock Speed'
            callMethod='setSpeed' />
            
          <UserSelectSetting
            userSetting={Meteor.user().defaultOverview || false}
            optionObjArr={overOps}
            labelText='Default Overview Area'
            callMethod='setDefaultOverview' />
  
        </div>
      </div>
      
      <div>
        
        <fieldset>
          <UsernameChange />
          <hr />
          <PasswordChange />
          <hr />
          { isAdmin ? <AdminDown /> : null }
        </fieldset>
      
      </div>
      
    </div>
  );
};

export default UserSettings;


const UserToggleSetting = ({ userSetting, labelText, callMethod })=> {
  function handle() {
    Meteor.call(callMethod, (error)=>{
      if(error)
        console.log(error);
    });
  }
  let color = userSetting ? 'greenT' : 'grayT';
  let icon = userSetting ? 
              <em><i className='fas fa-check-circle fa-3x'></i></em> : 
              <b><i className='far fa-check-circle fa-3x'></i></b>;
  return(
    <div className='gridRow'>
      <div className='gridCell line4x'>{labelText}</div>
      <div className='gridCell'>
      <button
        className={'iconAction ' + color}
        onClick={()=>handle()}
      >{icon}</button>
      </div>
    </div>
  );
};

export const UserSelectSetting = ({ 
  userSetting, optionObjArr, labelText, callMethod,
  userID
})=> {
  
  function handleUpdate(value) {
    Meteor.call(callMethod, value, userID);  
  }

  return(
    <div className='gridRow'>
      <div className='gridCell line4x'>{labelText}</div>
      <div className='gridCell'>
        <select
          id='speedSetting'
          className='tableAction'
          onChange={(e)=>handleUpdate(e.target.value)}
          defaultValue={userSetting}
          required>
        {optionObjArr.map( (e, ix)=>(
          <option key={ix} value={e.value} disabled={e.lock}>{e.name}</option>
        ))}
        </select>
      </div>
    </div>
  );
};