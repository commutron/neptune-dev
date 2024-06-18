import React from 'react';

import UsernameChange from './UsernameChange';
import EmailForm from './EmailForm';
import PasswordChange from './PasswordChange';

import { AdminDown } from './AdminForm.jsx';

import IdCardCard from './IdCardCard/IdCardCard';

const UserCred = ({ user, isAdmin })=> {

  return(
    <div>
      <div className='cardSelf settingColumn noPrint'>  
        
        <span className='rowWrap gapsC w100 contrast'>
          <p><b>Username:</b> {user.username}</p>
          <p><b>ID:</b> {Meteor.user()._id}</p>
          {/*<i><b>Organization:</b> <i className='blueT bold'>{Meteor.user().org}</i></i>*/}
          <p><b>Joined:</b> {user.createdAt.toLocaleString()}</p>
        </span>
      
        <div id='userbdg' className='minHeight'>
          <h3><i className='fas fa-id-badge fa-fw gapR'></i>Generate ID Badge</h3>
          <IdCardCard user={user} />
        </div>
        
        <div id='usernamechng' className='minHeight'>
          <h3><i className='fas fa-user-edit fa-fw gapR'></i>Username</h3>
          <UsernameChange />
        </div>
        
        <div id='emailchng' className='minHeight'>
          <h3><i className='fas fa-at fa-fw gapR'></i>Email Address</h3>
          <EmailForm user={user} />
        </div>
        
        <div id='passwordchng' className='minHeight'>
          <h3><i className='fas fa-key fa-fw gapR'></i>Password</h3>
          <PasswordChange />
        </div>

        {isAdmin ?
          <div id='adminpwr' className='minHeight'>
            <h3><i className='fas fa-meteor fa-fw'></i> Admin Status</h3>
             <AdminDown />
          </div>
        : null}
        
      </div>
      
    </div>
  );
};

export default UserCred;