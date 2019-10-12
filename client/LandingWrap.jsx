import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//import Pref from '/client/global/pref.js';

import Spin from '/client/components/uUi/Spin.jsx';

import HomeLogout from '/client/components/tinyUi/HomeLogout.jsx';
//import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import NavButton from '/client/components/smallUi/NavButton/NavButton.jsx';
import { NavButtonShell } from '/client/components/smallUi/NavButton/NavButton.jsx';
//import { NavPlaceholderShell } from '/client/components/smallUi/NavButton/NavButton.jsx';
import { NavPlaceholder } from '/client/components/smallUi/NavButton/NavButton.jsx';

const StartView = ({ready, readyUsers, user, org, app}) =>	{
  
  if(!ready || !readyUsers || !user || !org || !app) {
    return (
      <div className='centreSpash'>
        <Spin color={true} message='Just a moment'/>
      </div>
    );
  }
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isReadOnly = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  
  return(
    <div className='homeNavi'>
      {isReadOnly ?
        <NavPlaceholder title='Production' icon="fas fa-paper-plane" /> :
        <NavButton title='Production' icon='fa-paper-plane' link='/production' /> }
      <NavPlaceholder title='' icon="fas fa-map" />
      <NavButton title='Overview' icon={`fas ${isNightly?'fa-meteor':'fa-globe'}`} link='/overview' />
      <NavButton title='Explore' icon='fa-rocket' link='/data' />
      
      <NavButton title='Pisces' icon='fa-file-alt' link={app.instruct || ''} blank={true} />
      <NavButton title='Parts Search' icon='fa-microchip' link='/starfish' />
      <NavButtonShell title='People' link='/people'
        icon={
          <span className="fa-stack fa-fw navButtonIcon navButtonLayerCorrect">
            <i className="fas fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 left-10 down-1"></i>
            <i className="fas fa-user-astronaut fa-stack-1x"></i>
            <i className="fas fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 right-10 down-1"></i>
          </span>
        } />
      {isAdmin ?
        <NavButton title='Settings' icon='fa-sliders-h' link='/app' />
      : <NavPlaceholder title='Settings' icon='fas fa-sliders-h'/>}
      
      <NavButton title='Help' icon='fa-question' link={app.help || ''} blank={true} />
      <NavButton title='Time Clock' icon='fa-clock' link={app.timeClock || ''} blank={true} />
      <NavButton title={user.username} icon='fa-user-astronaut fa-flip-horizontal' link='/user' />
      <HomeLogout currentUser={user.username} />
    
    </div>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  
  //console.log(Meteor.status());
  
  if(!login) {
    return {
      ready: appSub.ready(),
      readyUsers: false,
      login: Meteor.userId(),
    };
  }else{
    return {
      ready: appSub.ready(),
      readyUsers: usersSub.ready(),
      login: Meteor.userId(),
      user: user,
      org: org,
      app: AppDB.findOne({org: org}),
    };
  }
})(StartView);