import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//import InboxToast from '/client/components/utilities/InboxToast.js';

import Spin from '../../components/uUi/Spin.jsx';
import AppWrap from './AppWrap.jsx';

class AppView extends Component	{
  /*
  componentDidUpdate(prevProps) {
    InboxToast(prevProps, this.props);
  }
  */
  render() {
    
    if(
      !this.props.ready || 
      !this.props.readyUsers || 
      !this.props.readyDebug || 
      !this.props.app
    ) {
      return (
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
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
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const usersDebugSub = login ? Meteor.subscribe('usersDataDebug') : false;
  if(!login) {
    return {
      ready: false,
      readyUsers: false,
      readyDebug: false
    };
  }else if(!active) {
    return {
      ready: false,
      readyUsers: false,
      readyDebug: false
    };
  }else{
    return {
      ready: appSub.ready(),
      readyUsers: usersSub.ready(),
      readyDebug: usersDebugSub.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      username: name,
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(AppView);