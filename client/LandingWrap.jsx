import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Spin from '/client/components/uUi/Spin.jsx';

import UserSlide from '/client/views/app/UserSlide.jsx';
import { ChillHome } from '/client/components/tinyUi/Chill.jsx';
import NavButton from '/client/components/uUi/NavButton.jsx';
import { NavPlaceholder } from '/client/components/uUi/NavButton.jsx';
import ExternalLink from '/client/components/uUi/ExternalLink.jsx';

const StartView = ({ready, user, org, app}) =>	{
    
  if(!ready || !user || !org || !app) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin color={true} message='Just a moment'/>
        </div>
      </div>
    );
  }
  
  return(
    <div className='homeNavContainer noCopy'>
      <div className='homeTitle'>
        <div className='homeTopBorder'></div>
        <div className='homeIcon'>
          <a className='homeIconLink' href='/' title='Home'>
            <img
              src='/neptune-logo-white.svg'
              className='homeIconLogo' />
          </a>
        </div>
        <div className='homeName'>Neptune Statistical Process Control</div>
        <div className='homeRightSpace'></div>
      </div>
      <div className='homeNavi'>
        <NavButton title='Production' icon='fa-paper-plane' link='/production' />
        <NavPlaceholder icon='fa-plane' trans='rotate--45'/>
        <NavButton title='Activity' icon='fab fa-wpexplorer' trans='flip-h' link='/activity' />
        <NavButton title='Explore' icon='fa-rocket' link='/data' />
        
        <NavButton title='Pisces' icon='fa-file-alt' link={app.instruct || ''} blank={true} />
        <NavButton title='Parts Search' icon='fa-microchip' link='/starfish' />
        <NavPlaceholder />
        {Roles.userIsInRole(Meteor.userId(), 'admin') ?
          <NavButton title='Settings' icon='fa-sliders-h' link='/app' />
        : <NavPlaceholder title='Settings' icon='fa-sliders-h'/>}
        
        <NavButton title='Help' icon='fa-question' link={app.help || ''} blank={true} />
        <NavButton title='Time Clock' icon='fa-clock' link={app.timeClock || ''} blank={true} />
        <UserSlide user={user} app={app} />
        <ChillHome currentUser={user.username} />
      
      </div>
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