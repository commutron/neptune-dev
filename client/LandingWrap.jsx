import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';
import { UnreadInboxToastPop } from '/client/utility/InboxToastPop.js';
import Spin from '/client/components/tinyUi/Spin.jsx';

import HomeLogout from '/client/components/tinyUi/HomeLogout.jsx';
import NavButton from '/client/layouts/NavButton/NavButton';
import { NavButtonShell } from '/client/layouts/NavButton/NavButton';
//import { NavPlaceholderShell } from '/client/components/smallUi/NavButton/NavButton.jsx';
import { NavPlaceholder } from '/client/layouts/NavButton/NavButton';

const StartView = ({ready, readyUsers, user, org, app}) =>	{
  
  useLayoutEffect( ()=>{
    UnreadInboxToastPop(user);
  }, []);
  
  if( !readyUsers || !user || !org || !app ) {
    return (
      <div className='centreSpash'>
        <Spin color={true} message='Just a moment'/>
      </div>
    );
  }
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isReadOnly = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  const isNigh = Roles.userIsInRole(Meteor.userId(), 'nightly');
  
  const isSales = Roles.userIsInRole(Meteor.userId(), 'sales');
  const isPeople = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  // ${isNigh ?'fa-meteor'
  const isPreview = isAdmin || isNigh || isSales || isPeople;
  
  return(
    <div className='homeNavi'>
      {isReadOnly ?
        <NavPlaceholder 
          title='Production'
          icon='fas fa-paper-plane' /> :
        <NavButton
          title='Production' 
          icon='fas fa-paper-plane'
          link='/production' /> }
      
      <NavButton title='Overview' icon='fas fa-globe' link='/overview' />
      
      <NavButtonShell title='People' link='/people'
        icon={
          <span className="fa-stack fa-fw navButtonIcon navButtonLayerCorrect">
            <i className="fas fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 left-10 down-1"></i>
            <i className="fas fa-user-astronaut fa-stack-1x"></i>
            <i className="fas fa-user-astronaut fa-stack-1x" data-fa-transform="shrink-5 right-10 down-1"></i>
          </span>
        } />
        
      <NavButton title='Explore' icon='fa-rocket' link='/data' />
      
      <NavButton title={Pref.upstream} icon='fa-warehouse' link='/upstream' tag='β' />
      
      {isPreview ? // fa-satellite-dish
        <NavButton title='Agenda' icon='fa-meteor' link='/agenda' tag='ALPHA' />
      : <NavPlaceholder title='Agenda' icon="fas fa-meteor" tag='ALPHA' />}
      
      <NavButton title={user.username} icon='fa-user-astronaut fa-flip-horizontal' link='/user' />
      
      {!app.timeClock || app.timeClock.trim() === '' ?  
        <NavPlaceholder 
          title={Pref.timeClock} 
          icon='fas fa-clock' /> :
        <NavButton
          title={Pref.timeClock} 
          icon='fa-clock' 
          link={app.timeClock || ''} 
          blank={true} /> }
      
      <NavButton title={Pref.docs} icon='fa-file-invoice' link={app.instruct || ''} blank={true} />
      
      <NavButton title='Help' icon='fa-question' link={app.help || ''} blank={true} />
      
      {isAdmin ?
        <NavButton title='Settings' icon='fa-sliders-h' link='/app' />
      : <NavPlaceholder title='Settings' icon='fas fa-sliders-h'/>}
      
      <HomeLogout currentUser={user.username} />
    
    </div>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  
  //console.log(Meteor.status());
  
  if(!login) {
    return {
      readyUsers: false,
      login: Meteor.userId(),
    };
  }else{
    return {
      readyUsers: usersSub.ready(),
      login: Meteor.userId(),
      user: user,
      org: org,
      app: AppDB.findOne({org: org}),
    };
  }
})(StartView);