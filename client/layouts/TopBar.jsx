import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//import RoleCheck from '/client/components/utilities/RoleCheck.js';

import Spin from '../components/uUi/Spin.jsx';
import Freeze from '../components/tinyUi/Freeze.jsx';
//import InitialSetup from '../views/InitialSetup.jsx';
//import UserSlide from '/client/views/app/UserSlide.jsx';
//import Chill from '../components/tinyUi/Chill.jsx';
//import ExternalLink from '../components/uUi/ExternalLink.jsx';

const TopBar = ({ ready, user, active, org, app, link })=> {
      
  if(!ready || !active || !user || !org || !app) {
    return (
      <Freeze>
        <Spin color={true} />
      </Freeze>
    );
  }
  
  /*
  if(!app) {
    return (
      <div className='bleed middle flexRR'>
        <Chill name={user}/>
        <Freeze>
          <InitialSetup org={org} />
        </Freeze>
      </div>
    );
  }
  */
  
  return(
    <div>dead component</div>
  );
  /*
  return (
    <div className='primeNav'>
      <span className='primeNavLogo'>
        <a className='logoWrap' href='/' title='Home'>
          <img
            src='/neptune-logo-white.svg'
            className='logoSVG' />
        </a>
      </span>
      <span className={ link === 'prod' ? 'primeNavItem onPNv' : 'primeNavItem' }>
        <a href='/production'>
          <i className='fas fa-paper-plane fa-lg'></i>
          <span className='icontext'>Production</span>
        </a>
      </span>
      <RoleCheck role='nightly'>
      <span className={ link === 'pronight' ? 'primeNavItem onPNv' : 'primeNavItem' }>
        <a href='/nightly/production' disabled={false}>
          <i className='far fa-paper-plane fa-lg'></i>
          <span className='icontext'>Pro+</span>
        </a>
      </span>
      </RoleCheck>
      <span className={ link === 'data' ? 'primeNavItem onPNv' : 'primeNavItem' }>
        <a href='/data'>
          <i className='fas fa-rocket fa-lg'></i>
          <span className='icontext'>Explore</span>
        </a>
      </span>
      <span className={ link === 'act' ? 'primeNavItem onPNv' : 'primeNavItem' }>
        <a href='/activity'>
          <i className='fab fa-wpexplorer fa-lg'></i>
          <span className='icontext'>Activity</span>
        </a>
      </span>
      <span className={ link === 'comp' ? 'primeNavItem onPNv' : 'primeNavItem' }>
        <a href='/starfish'>
          <i className='fas fa-microchip fa-lg'></i>
          <span className='icontext'>Parts Search</span>
        </a>
      </span>
      <span className='navSpacer'></span>
      <RoleCheck role='admin'>
      <span className={ link === 'app' ? 'primeNavItem onPNv' : 'primeNavItem' }>
        <a href='/app'>
          <i className='fas fa-sliders-h fa-lg'></i>
          <span className='icontext'>Settings</span>
        </a>
      </span>
      </RoleCheck>
      <span className='primeNavItem'>
        <ExternalLink go={app.timeClock} title='Time Clock' icon='far fa-clock' />
      </span>
      <span className='primeNavItem'>
        <Chill name={user.username}/>
      </span>
    </div>
  );
  */
};

export default withTracker( ({ link }) => {
  const login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  const hotSub = login ? Meteor.subscribe('appData') : false;
  if(!login) {
    return {
      ready: false,
      orb: Session.get('now'),
      bolt: Session.get('allData'),
    };
  }else{
    return {
      ready: hotSub.ready(),
      orb: Session.get('now'),
      user: user,
      org: org,
      active: Roles.userIsInRole(Meteor.userId(), 'active'),
      app: AppDB.findOne({org: org}),
      link: link
    };
  }
})(TopBar);