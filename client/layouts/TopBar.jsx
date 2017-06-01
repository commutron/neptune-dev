import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import Spin from '../components/tinyUi/Spin.jsx';
import Freeze from '../components/tinyUi/Freeze.jsx';
import InitialSetup from '../views/InitialSetup.jsx';
import Login from '../views/Login.jsx';
import ActivateUser from '../components/forms/ActivateUser.jsx';
import OrgForm from '../components/forms/OrgForm.jsx';
import FindBox from './FindBox.jsx';
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
    
    if(!this.props.active) {
      return (
        <div className='bleed middle flexRR'>
          <Chill name={this.props.user} />
          <Freeze>
            <div>
              <p>This user account is deactivated.</p>
              <p>Contact your administrator.</p>
              <hr />
              <ActivateUser />
            </div>
          </Freeze>
        </div>
        );
    }
    
    if(!this.props.org) {
      return (
        <div className='bleed middle flexRR'>
          <Chill name={this.props.user} />
          <Freeze>
            <OrgForm org={this.props.org} startup={true} />
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
      <div className='bleed middle'>
        <FindBox orb={this.props.orb} />
        <nav>
          <a className='title' href='/'>
            <img src='/neptune-logo-white.svg' className='logoSVG' />
          </a>
          <a href='/dashboard'>
            <i className="fa fa-tachometer fa-2x" aria-hidden="true"></i>
            <span className='icontext'>Dashboard</span>
          </a>
          <a href='/wiki'>
            <i className="fa fa-book fa-2x" aria-hidden="true"></i>
            <span className='icontext'>Docs</span>
          </a>
          {this.props.admin ?
          <span>
            <a href='/app'>
              <i className="fa fa-sliders fa-2x" aria-hidden="true"></i>
              <span className='icontext'>App</span>
            </a>
            <a href='/database'>
              <i className="icon fa fa-database fa-2x" aria-hidden="true"></i>
              <span className='icontext'>dB</span>
            </a>
          </span>
          : null}
          <span className='rAlign middle'>
            <DataToggle />
            <TimeToggle />
            <Chill name={this.props.user}/>
          </span>
        </nav>
        <TimeFrame time={this.props.time} go={this.props.app.timeClock} />
      </div>
    );
  }
}

export default createContainer( () => {
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let user = usfo ? usfo.username : false;
  let active = usfo ? usfo.active : false;
  let org = usfo ? usfo.org : false;
  let admin = usfo ? usfo.admin : false;
  let power = usfo ? usfo.power : false;
  const hotSub = login ? Meteor.subscribe('appSetting') : false;
  if(!login) {
    return {
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      login: Meteor.userId(),
    };
  }else if(!active) {
    return {
      ready: hotSub.ready(),
      login: Meteor.userId(),
    };
  }else{
    return {
      ready: hotSub.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      time: Session.get('timeClock'),
      login: Meteor.userId(),
      user: user,
      active: active,
      org: org,
      admin: admin,
      power: power,
      app: AppDB.findOne({org: org})
    };
  }
}, TopBar);