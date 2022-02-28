import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import Spin from '/client/components/tinyUi/Spin';

import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';

import { ToastContainer } from 'react-toastify';

import HomeLogout from '/client/components/tinyUi/HomeLogout';
import NavButton from '/client/layouts/NavButton/NavButton';
import { NavButtonShell } from '/client/layouts/NavButton/NavButton';
import { NavPlaceholder } from '/client/layouts/NavButton/NavButton';

const StartView = ({user, app}) =>	{
  
  useLayoutEffect( ()=>{
    InboxToastPop(user);
  }, [user]);
  
  if( !user || !app ) {
    return(
      <div className='splashContainer'>
        <div className='tenHeader'>
          <div className='topBorder' />
          <HomeIcon />
          <div className='frontCenterTitle'>
            {Pref.neptuneIs}
          </div>
          <div className='auxRight' />
          <div />
        </div>
        <div className='centreSpash'>
          <Spin color={true} message='Just a moment'/>
        </div>
      </div>
    );
  }
  
	const usernice = user.username.replace(Pref.usrCut, " ");
	
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isReadOnly = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <div className='splashContainer'>
      <ToastContainer
        position="top-center"
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='frontCenterTitle'>
          {Pref.neptuneIs}
        </div>
        <div className='auxRight' />
        <TideFollow />
      </div>

      <div className='homeNavi'>
        {isReadOnly ?
          <NavPlaceholder 
            title='Production'
            icon='fa-regular fa-paper-plane' /> :
          <NavButton
            title='Production' 
            icon='fa-regular fa-paper-plane'
            link='/production' /> }
        
        <NavButton title='Overview' icon='fa-solid fa-globe' link='/overview' />
        
        <NavButtonShell title='People' link='/people'
          icon={
            <span className="fa-stack fa-fw navButtonIcon navButtonLayerCorrect">
              <i className="fa-solid fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 left-10 down-1"></i>
              <i className="fa-solid fa-user-astronaut fa-stack-1x"></i>
              <i className="fa-solid fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 right-10 down-1"></i>
            </span>
          } />
        
        <NavButton title='Explore' icon='fa-solid fa-rocket' link='/data' />
        
        <NavButton title={Pref.upstream} icon='fa-solid fa-satellite-dish' link='/upstream' />
        
        <NavButton title={Pref.downstream} icon='fa-solid fa-satellite' link='/downstream' />
        
        <NavButton title={usernice} icon='fa-solid fa-user-astronaut fa-flip-horizontal' link='/user' />
        
        {isAdmin ?
          <NavButton title='Settings' icon='fa-solid fa-sliders-h' link='/app' />
        : <NavPlaceholder title='Settings' icon='fa-solid fa-sliders-h'/>}
        
        <NavButton title={Pref.docs} icon='fa-solid fa-file-invoice' link={app.instruct || ''} blank={true} />
        
        <NavButton title='Help' icon='fa-regular fa-question-circle' link={app.helpDocs || ''} blank={true} />
        
        {!app.timeClock || app.timeClock.trim() === '' ?  
          <NavPlaceholder 
            title={Pref.timeClock} 
            icon='fa-regular fa-clock' /> :
          <NavButton
            title={Pref.timeClock} 
            icon='fa-solid fa-clock' 
            link={app.timeClock || ''} 
            blank={true} /> }
        
        <HomeLogout currentUser={user} />
      </div>
    </div>
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