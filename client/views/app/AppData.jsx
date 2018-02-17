import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Spin from '../../components/uUi/Spin.jsx';
import AppWrap from './AppWrap.jsx';

class AppView extends Component	{
  
  render() {
    
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

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let org = user ? user.org : false;
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  if(!login) {
    return {
      ready: false,
    };
  }else if(!active) {
    return {
      ready: false,
    };
  }else{
    return {
      ready: true,
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      user: name,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(AppView);