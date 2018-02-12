import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import RoleCheck from '/client/components/utilities/RoleCheck.js';

import Spin from '../components/uUi/Spin.jsx';
import Freeze from '../components/tinyUi/Freeze.jsx';
import InitialSetup from '../views/InitialSetup.jsx';
import Login from '../views/Login.jsx';
import ActivateUser from '../components/forms/ActivateUser.jsx';
import Chill from '../components/tinyUi/Chill.jsx';
import ExternalLink from '../components/uUi/ExternalLink.jsx';

const TopBar = ({ ready, orb, login, user, active, org, app, link })=> {
    
  //console.log(Meteor.status().connected);
  /*
  if() {
    return (
      <Freeze>
        <div className='actionBox orange centre centreTrue bigger'>
          <p>OFFLINE</p>
        </div>
      </Freeze>
    );
  }*/
  
  if(!login) {
    return (
      <Freeze>
        <Login />
      </Freeze>
    );
  }
      
  if(!ready) {
    return (
      <Freeze>
        <Spin color={true} />
      </Freeze>
    );
  }
  
  if(!active || !org) {
    return (
      <div className='bleed middle flexRR'>
        <Chill name={user} />
        <Freeze>
          <div>
            <hr />
            <ActivateUser />
          </div>
        </Freeze>
      </div>
    );
  }
  
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
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let user = usfo ? usfo.username : false;
  let org = usfo ? usfo.org : false;
  let active = usfo ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const hotSub = login ? Meteor.subscribe('appData') : false;
  if(!login) {
    return {
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      login: Meteor.userId(),
    };
  }else if(!active) {
    return {
      ready: hotSub.ready() && Roles.subscription.ready(),
      login: Meteor.userId(),
      user: user
    };
  }else{
    return {
      ready: hotSub.ready() && Roles.subscription.ready(),
      orb: Session.get('now'),
      login: Meteor.userId(),
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      link: link
    };
  }
})(TopBar);