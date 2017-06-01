import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import Spin from '../../components/tinyUi/Spin.jsx';
import AppWrap from './AppWrap.jsx';

class AppView extends Component	{
  
  render() {
    
    if(!this.props.login) {
      return (
        <div></div>
        );
    }
    
    if(!this.props.ready || !this.props.app) {
      return (
        <Spin />
        );
    }
    
    return (
      <AppWrap
        orb={this.props.orb}
        bolt={this.props.bolt}
        app={this.props.app}
        users={this.props.users} 
      />
    );
  }
}

export default createContainer( () => {
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let user = usfo ? usfo.username : false;
  let active = usfo ? usfo.active : false;
  let org = usfo ? usfo.org : false;
  let power = usfo ? usfo.power : false;
  let hotSub = login ? Meteor.subscribe('appData') : false;
  if(!login) {
    return {
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      login: Meteor.userId(),
      user: user,
      active: active,
      org: org,
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
      login: Meteor.userId(),
      user: user,
      active: active,
      org: org,
      power: power,
      app: AppDB.findOne({org: org}),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
}, AppView);