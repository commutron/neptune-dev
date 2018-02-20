import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import RoleCheck from '/client/components/utilities/RoleCheck.js';

import Spin from '../components/uUi/Spin.jsx';
import Freeze from '../components/tinyUi/Freeze.jsx';
//import InitialSetup from '../views/InitialSetup.jsx';
import Chill from '../components/tinyUi/Chill.jsx';
import ExternalLink from '../components/uUi/ExternalLink.jsx';

const TopBar = ({ ready, user, active, org, app, link })=> {
      
  if(!ready || !active || !org || !app) {
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
  
  return (
    <div className='primeNav'>
      <nav className='primeNav'>
        <a className='title' href='/' title='Home'>
          <img
            src='/neptune-logo-white.svg'
            className='logoSVG' />
        </a>
        <a href='/activity' className={ link === 'act' ? 'whiteT' : '' }>
          <i className="fas fa-chart-line fa-lg" aria-hidden='true'></i>
          <span className='icontext'>Activity</span>
        </a>
        <a href='/dashboard' className={ link === 'dash' ? 'whiteT' : '' }>
          <i className="fas fa-tachometer-alt fa-lg" aria-hidden='true'></i>
          <span className='icontext'>Dashboard</span>
        </a>
        <a href='/starfish' className={ link === 'comp' ? 'whiteT' : '' }>
          <i className="fas fa-microchip fa-lg" aria-hidden='true'></i>
          <span className='icontext'>Parts Search</span>
        </a>
        <RoleCheck role={'nightly'}>
          <span>
            <a href='/production' className={ link === 'prod' ? 'whiteT' : '' }>
              <i className="fa fa-flask fa-lg" aria-hidden='true'></i>
              <span className='icontext'>Production</span>
            </a>
            <a href='/data' className={ link === 'data' ? 'whiteT' : '' }>
              <i className="icon fa fa-flask fa-lg" aria-hidden='true'></i>
              <span className='icontext'>Data</span>
            </a>
            <a href='/scan' className={ link === 'scan' ? 'whiteT' : '' }>
              <i className="icon fa fa-flask fa-lg" aria-hidden='true'></i>
              <span className='icontext'>Scan</span>
            </a>
          </span>
        </RoleCheck>
        <a href='/app' className={ link === 'app' ? 'whiteT' : '' }>
          <i className="fas fa-sliders-h fa-lg" aria-hidden='true'></i>
          <span className='icontext'>Settings</span>
        </a>
      </nav>
      <span className='navSpacer'></span>
      <ExternalLink go={app.helpDocs} title='Help' icon='far fa-question-circle' />
      <ExternalLink go={app.timeClock} title='Time Clock' icon='far fa-clock' />
      <Chill name={user}/>
    </div>
  );
};

export default withTracker( ({ link }) => {
  const login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
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
      user: name,
      org: org,
      active: Roles.userIsInRole(Meteor.userId(), 'active'),
      app: AppDB.findOne({org: org}),
      link: link
    };
  }
})(TopBar);