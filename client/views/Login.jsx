import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import Pref from '/client/global/pref.js';

import AccountsUI from '/client/components/bigUi/AccountsUI/AccountsUI.jsx';
import NavButton from '/client/components/smallUi/NavButton/NavButton.jsx';
import { NavPlaceholder } from '/client/components/smallUi/NavButton/NavButton.jsx';
import Spin from '/client/components/tinyUi/Spin.jsx';

const Login = ({ login, uID, username, timeClock })=> {
  
  if(Meteor.loggingIn()) {
    return(
      <div className='centrecentre'>
        <Spin color={true} />
      </div>
    );
  }
  
  return(
    <div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        newestOnTop />
      <div className='centre'>
        <AccountsUI
          login={login}
          uID={uID}
          username={username} />
      
        <div className='homeNaviMini'>

          {!login ?
            <NavPlaceholder 
              title='Account' 
              icon="fas fa-user-astronaut fa-flip-horizontal" /> :
            <NavButton 
              title='Account' 
              icon='fa-user-astronaut fa-flip-horizontal' 
              link='/user' /> }
      
          {!login || !timeClock ?   
            <NavPlaceholder 
              title={Pref.timeClock} 
              icon='fas fa-clock' /> :
            <NavButton
              title={Pref.timeClock} 
              icon='fa-clock' 
              link={timeClock} 
              blank={true} /> }
           
        </div>
    
      </div>
    
    </div>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let uID = login ? Meteor.userId() : false;
  let user = login ? Meteor.user() : false;
  let username = user ? user.username : false;
  const app = login ? AppDB.findOne() : false;
  const timeClock = app ? app.timeClock : false;
  return {
    login: login,
    uID: uID,
    username: username,
    timeClock: timeClock
  };
})(Login);