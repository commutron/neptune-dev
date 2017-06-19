import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import RoleCheck from '/client/components/utilities/RoleCheck.js';

import Spin from '../components/tinyUi/Spin.jsx';
import Freeze from '../components/tinyUi/Freeze.jsx';
import InitialSetup from '../views/InitialSetup.jsx';
import Login from '../views/Login.jsx';
import ActivateUser from '../components/forms/ActivateUser.jsx';
import Chill from '../components/tinyUi/Chill.jsx';
import TimeToggle from '../components/tinyUi/TimeToggle.jsx';
import DataToggle from '../components/tinyUi/DataToggle.jsx';
import TimeFrame from '../components/tinyUi/TimeFrame.jsx';

class TopBar extends Component	{
  
  render() {
    
    if(!this.props.login) {
      return (
        <Freeze>
          <Login />
        </Freeze>
        );
    }
        
    if(!this.props.ready) {
      return (
        <Freeze>
          <Spin />
        </Freeze>
        );
    }
    
    if(!this.props.active || !this.props.org) {
      return (
        <div className='bleed middle flexRR'>
          <Chill name={this.props.user} />
          <Freeze>
            <div>
              <hr />
              <ActivateUser />
            </div>
          </Freeze>
        </div>
        );
    }
    
    if(!this.props.app) {
      return (
        <div className='bleed middle flexRR'>
          <Chill name={this.props.user} />
          <Freeze>
            <InitialSetup org={this.props.org} />
          </Freeze>
        </div>
        );
    }
    
    return (
      <div className='primeNav'>
        <nav className='primeNav'>
          <a className='title' href='/'>
            <img src='/neptune-logo-white.svg' className='logoSVG' />
          </a>
          <a href='/dashboard'>
            <i className="fa fa-tachometer fa-2x" aria-hidden="true"></i>
            <span className='icontext'>Dashboard</span>
          </a>
          <a href='/docs'>
            <i className="fa fa-book fa-2x" aria-hidden="true"></i>
            <span className='icontext'>Docs</span>
          </a>
          <RoleCheck role={'admin'}>
            <span>
              <a href='/database'>
                <i className="icon fa fa-database fa-2x" aria-hidden="true"></i>
                <span className='icontext'>dB</span>
              </a>
            </span>
          </RoleCheck>
          <a href='/app'>
            <i className="fa fa-sliders fa-2x" aria-hidden="true"></i>
            <span className='icontext'>App</span>
          </a>
        </nav>
        <span className='navSpacer'></span>
        <DataToggle />
        <TimeToggle />
        <Chill name={this.props.user}/>
        <TimeFrame time={this.props.time} go={this.props.app.timeClock} />
      </div>
    );
  }
}

export default createContainer( () => {
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
    };
  }else{
    return {
      ready: hotSub.ready() && Roles.subscription.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      time: Session.get('timeClock'),
      login: Meteor.userId(),
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org})
    };
  }
}, TopBar);