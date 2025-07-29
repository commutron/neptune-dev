import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/public/pref.js';
import Spin from '/client/components/tinyUi/Spin';

import { PlainFrame } from '/client/layouts/MainLayouts';

import HomeLogout from '/client/layouts/NavButton/HomeLogout';
import NavButton, { NavButtonShell, NavBar, NavPlaceholder } from '/client/layouts/NavButton/NavButton';

const StartView = ({user, app}) =>	{
  
  if( !user || !app ) {
    return(
      <PlainFrame title={Pref.neptuneIs} container='splashContainer'>
        <div className='centreSpash'>
          <Spin color={true} message='Just a moment'/>
        </div>
      </PlainFrame>
    );
  }
  
	const usernice = user.username.replace(Pref.usrCut, " ");
	
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isReadOnly = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  // const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  // const isKit = Roles.userIsInRole(Meteor.userId(), 'kitting');
  
  return(
    <PlainFrame title={Pref.neptuneIs} container='splashContainer'>
      <div className='homeNavi' data-station={localStorage.getItem("local_station") || ''}>
        {isReadOnly ?
          <NavPlaceholder 
            title='Production'
            icon='fa-regular fa-paper-plane' /> :
          <NavButton
            title='Production' 
            icon='fa-regular fa-paper-plane'
            link='/production' /> }
        
        <NavButton title='Process' icon='fa-solid fa-location-arrow' link='/kiosk' />
        
        <NavButton title='Equipment' icon='fa-solid fa-robot fa-xs' link='/equipment' shrink='1' />
        
        <NavButton title='Explore' icon='fa-solid fa-rocket' link='/data' />
        
        <NavButton title={Pref.upstream} icon='fa-solid fa-satellite-dish' link='/upstream' />
        
        <NavButton title='Overview' icon='fa-solid fa-globe' link='/overview' />
        
        <NavButtonShell title='People' link='/people'
          icon={
            <span className='fa-stack fa-fw navButtonIcon navButtonLayerCorrect'>
              <i className="fa-solid fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 left-10 down-1"></i>
              <i className="fa-solid fa-user-astronaut fa-stack-1x"></i>
              <i className="fa-solid fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 right-10 down-1"></i>
            </span>
          } />
          
        <NavButton title={Pref.downstream} icon='fa-solid fa-satellite' link='/downstream' />
        
        <NavButton title={Pref.docs} icon='fa-solid fa-file-invoice' link={app.instruct || ''} blank={true} />
        
        {!app.timeClock || app.timeClock.trim() === '' ?  
          <NavPlaceholder 
            title={Pref.timeClock} 
            icon='fa-regular fa-clock' /> :
          <NavButton
            title={Pref.timeClock} 
            icon='fa-solid fa-clock' 
            link={app.timeClock || ''} 
            blank={true} /> }
        
        <NavButton title={usernice} icon='fa-solid fa-user-astronaut fa-flip-horizontal' link='/user' />
        
        <HomeLogout currentUser={user} />
        
        <NavBar 
          title='Help' 
          icon='fa-solid fa-question-circle' 
          link={app.helpDocs || ''} 
          blank={true}
          span={isAdmin ? '2' : '4'}
        />
        
        {isAdmin ?
          <NavBar 
            title='Settings' 
            icon='fa-solid fa-sliders-h' 
            link='/app'
            span='2'
          />
        : null}
      </div>
    </PlainFrame>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  
  if(!login) {
    return {
      login: Meteor.userId(),
    };
  }else{
    return {
      login: Meteor.userId(),
      user: user,
      org: org,
      app: AppDB.findOne({org: org}),
    };
  }
})(StartView);