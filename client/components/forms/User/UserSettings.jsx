import React from 'react';
import Pref from '/client/global/pref.js';

import UsernameChange from './UsernameChange';
import EmailForm from './EmailForm';
import PasswordChange from './PasswordChange';

import { AdminDown } from './AdminForm.jsx';

import IdCardCard from '/client/views/user/IdCardCard';

const UserSettings = ({ app, user, isAdmin, brancheS })=> {
  
  const speedOps = [
    // {value: 250, lock: !isAdmin, name: 'Crazy Fast' },
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
    <div>
      <div className='comfort cardify'>
        <span className='noPrint readPs medBig'>
          <p><b>Username:</b> {user.username}</p>
          <p><b>ID:</b> {Meteor.user()._id}</p>
          <p><b>Organization:</b> <i className='blueT bold'>{Meteor.user().org}</i></p>
          <p><b>Joined:</b> {user.createdAt.toLocaleString()}</p>
        </span>
        
        <IdCardCard user={user} />
      </div>
      
      <div className='cardSelf settingColumn noPrint'>  
        
        <div>
          <h3><i className='fas fa-sliders-h fa-fw gapR'></i>Interface Preferences</h3>
          <div>
            
            <UserColorSetting
              userSetting={Meteor.user().customColor}
              labelText='Custom Colour Theme'
              helpText="Set a custom colour for '--neptuneColor'. Also matches outline, accents and text selction"
            />
            
            <UserToggleSetting
              userSetting={Meteor.user().progType}
              labelText='Prefer Progress By Time'
              yesText='Overview and Streams default to the task time view.'
              noText='Overview and Streams default to the progress view.'
              callMethod='setUserProgPrefer' />
              
            <UserToggleSetting
              userSetting={Meteor.user().miniAction}
              labelText='Prefer Dense View'
              yesText='Overview and Streams default to the minifyed view.'
              noText='Overview and Streams default to the comfort view.'
              callMethod='setUserMiniPrefer' />
              
            <UserToggleSetting
              userSetting={Meteor.user().preferLight}
              labelText='Prefer Light Theme'
              yesText='Overview and Streams default to the light theme.'
              noText='Overview and Streams default to the dark theme.'
              callMethod='setUserLightPrefer' />
            
            <UserToggleSetting
              userSetting={Meteor.user().autoScan}
              labelText='Barcode scan outside of search field'
              yesText='Accepts barcode input no matter the cursor focus.'
              noText='Barcode input is only accepted when the cursor focus is in the searchbox.'
              callMethod='setAutoScan' />
              
            <UserToggleSetting
              userSetting={Meteor.user().scrollInstruct}
              labelText={`Autoscroll To Instruction Section`}
              yesText={`Automatically scrolls the work instruction section that matches the process flow.\n
                        Only occurs on configured work instructions.`}
              noText='Only loads to the top of the work instructions.'
              callMethod='setUserAutoscrollI' />
            
            <UserToggleSetting
              userSetting={Meteor.user().showNCcodes}
              labelText={`Show ${Pref.nonCon} Codes`}
              yesText={`Alphanumeric codes are displayed with each ${Pref.nonCon} type.`}
              noText={`Alphanumeric codes are not dispayed with ${Pref.nonCon} types.`}
              callMethod='setUserNCcodes' />
            
            <UserToggleSetting
              userSetting={Meteor.user().typeNCselection}
              labelText={`Filterable ${Pref.nonCon} Type List`}
              yesText={`Typing into the ${Pref.nonCon} defect type input will filter the selection options.`}
              noText={`The ${Pref.nonCon} defect type input is a fixed dropdown list.`}
              callMethod='setUserNCselection' />
              
            <UserToggleSetting
              userSetting={Meteor.user().ncFocusReset}
              labelText={`Reset focus after ${Pref.nonCon} add`}
              yesText={`After you enter a ${Pref.nonCon}, your cursor focus goes back to the main searchbox.`}
              noText={`After entering a ${Pref.nonCon}, your cursor focus stays with the ${Pref.nonCon} "reference" input.`}
              callMethod='setUserNCFocus' />
            
            <UserToggleSetting
              userSetting={Meteor.user().shFocusReset}
              labelText={`Reset focus after ${Pref.shortfall} add`}
              yesText={`After you enter a ${Pref.shortfall}, your cursor focus returns to the main searchbox.`}
              noText={`After you enter a ${Pref.shortfall}, your cursor focus stays with the ${Pref.nonCon} "reference" input.`}
              callMethod='setUserSHFocus' />
            
            <UserSelectSetting
              userSetting={Meteor.user().unlockSpeed || 2000}
              optionObjArr={speedOps}
              labelText='Step Unlock Speed'
              yesText={`Process flow steps will unlock after an additional ${Meteor.user().unlockSpeed || '2000'} milliseconds.\n
                        Other factors including database and network speed impact the absolute unlock delay.`}
              callMethod='setSpeed' />
            
            <UserSelectSetting
              userSetting={Meteor.user().defaultOverview || false}
              optionObjArr={overOps}
              labelText='Default Overview Area'
              yesText={`The Overview section will default to the ${Meteor.user().defaultOverview || 'All'} ${Pref.branch}`}
              callMethod='setDefaultOverview' />
    
          </div>
        </div>
        
        <div className='minHeight'>
          <h3><i className='fas fa-user-edit fa-fw gapR'></i>Username</h3>
          <UsernameChange />
        </div>
        
        <div className='minHeight'>
          <h3><i className='fas fa-at fa-fw gapR'></i>Email Address</h3>
          <EmailForm user={user} />
        </div>
        
        <div className='minHeight'>
          <h3><i className='fas fa-key fa-fw gapR'></i>Password</h3>
          <PasswordChange />
        </div>

        {isAdmin ?
          <div className='minHeight'>
            <h3><i className='fas fa-meteor fa-fw'></i> Admin Status</h3>
             <AdminDown />
          </div>
        : null}
        
      </div>
      
    </div>
  );
};

export default UserSettings;

const UserColorSetting = ({ userSetting, labelText, helpText, callMethod })=> {
  function handle(val) {
    Meteor.call('setColor', val, (error)=>{
      error && console.log(error);
    });
  }
  
  return(
    <div className='bigInfoBox' 
      data-describe={helpText}>
      <div>{labelText}</div>
      <div>
        <span className='middle'>
          <button
            className='roundAction colorSwatch gapR'
            title='Reset'
            onClick={()=> { handle(null); this.userColor.value = '#007fff' }}
          ><i className='fas fa-times-circle mini15x'></i></button>
          <input 
            id='userColor'
            type='color'
            className='colorSwatch'
            title='Set Colour'
            defaultValue={userSetting || '#007fff'}
            onChange={(e)=>handle(e.target.value)}
          />
        </span>
      </div>
    </div>
  );
};

const UserToggleSetting = ({ userSetting, labelText, yesText, noText, callMethod })=> {
  function handle() {
    Meteor.call(callMethod, (error)=>{
      error && console.log(error);
    });
  }
  let color = userSetting ? 'blueT' : 'grayT';
  let icon = userSetting ? 
              <n-fa0><i className='fas fa-check-circle fa-2x'></i></n-fa0> : 
              <n-fa1><i className='far fa-check-circle fa-2x'></i></n-fa1>;
  return(
    <div className='bigInfoBox' 
      data-describe={userSetting ? yesText : noText}>
      <div>{labelText}</div>
      <div>
        <button
          className={color}
          onClick={()=>handle()}
        >{icon}</button>
      </div>
    </div>
  );
};

export const UserSelectSetting = ({ 
  userSetting, optionObjArr, labelText, yesText, callMethod, userID
})=> {
  
  function handleUpdate(value) {
    Meteor.call(callMethod, value, userID);  
  }

  return(
    <div className='bigInfoBox' 
      data-describe={yesText}>
      <div>{labelText}</div>
      <div>
        <select
          id='speedSetting'
          className='miniIn18'
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