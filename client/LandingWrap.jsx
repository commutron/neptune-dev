import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//import Pref from '/client/global/pref.js';

import Spin from '/client/components/uUi/Spin.jsx';

import UserSlide from '/client/views/app/UserSlide.jsx';
import { ChillHome } from '/client/components/tinyUi/Chill.jsx';
//import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import NavButton from '/client/components/uUi/NavButton.jsx';
import { NavPlaceholder } from '/client/components/uUi/NavButton.jsx';

const StartView = ({ready, user, org, app}) =>	{
    
  if(!ready || !user || !org || !app) {
    return (
      <div className='centreSpash'>
        <Spin color={true} message='Just a moment'/>
      </div>
    );
  }
  
  return(
    <div className='homeNavi'>
      <NavButton title='Production' icon='fa-paper-plane' link='/production' />
      <NavPlaceholder icon='fab fa-fly' /*title='Activity/Pings'*/ />
      <NavButton title='Activity' icon='fab fa-wpexplorer' /*title='Observe'*/ trans='flip-h' link='/activity' />
      <NavButton title='Explore' icon='fa-rocket' link='/data' />
      
      <NavButton title='Pisces' icon='fa-file-alt' link={app.instruct || ''} blank={true} />
      <NavButton title='Parts Search' icon='fa-microchip' link='/starfish' />
      <NavPlaceholder icon="fa-unlink" />
      {Roles.userIsInRole(Meteor.userId(), 'admin') ?
        <NavButton title='Settings' icon='fa-sliders-h' link='/app' />
      : <NavPlaceholder title='Settings' icon='fa-sliders-h'/>}
      
      <NavButton title='Help' icon='fa-question' link={app.help || ''} blank={true} />
      <NavButton title='Time Clock' icon='fa-clock' link={app.timeClock || ''} blank={true} />
      <UserSlide user={user} app={app} />
      <ChillHome currentUser={user.username} />
    
    </div>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  const hotSub = login ? Meteor.subscribe('appData') : false;
  if(!login) {
    return {
      ready: false,
      login: Meteor.userId(),
    };
  }else{
    return {
      ready: hotSub.ready(),
      login: Meteor.userId(),
      user: user,
      org: org,
      app: AppDB.findOne({org: org}),
    };
  }
})(StartView);