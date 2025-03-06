import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import Pref from '/public/pref.js';

import AccountsUI from '/client/components/bigUi/AccountsUI/AccountsUI.jsx';
import NavButton from '/client/layouts/NavButton/NavButton.jsx';
import { NavPlaceholder } from '/client/layouts/NavButton/NavButton.jsx';
import Spin from '/client/components/tinyUi/Spin.jsx';
import { MetaLink } from '/client/views/app/appSlides/MetaSlide';

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
      <div className='centre darkTheme'>
        <AccountsUI
          login={login}
          uID={uID}
          username={username} />
      
        <div className='homeNaviMini' data-station={localStorage.getItem("local_station") || ''}>

          {!login || !timeClock ?   
            <NavPlaceholder 
              title={Pref.timeClock} 
              icon='fa-solid fa-clock' /> :
            <NavButton
              title={Pref.timeClock} 
              icon='fa-solid fa-clock' 
              link={timeClock} 
              blank={true} /> }
        
          {!login ?
            <NavPlaceholder 
              title='Account' 
              icon="fa-solid fa-user-astronaut fa-flip-horizontal" /> :
            <NavButton 
              title='Account' 
              icon='fa-solid fa-user-astronaut fa-flip-horizontal' 
              link='/user' /> }
        </div>
        
        <MetaLink />
        
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