import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import InboxToastPop from '/client/components/utilities/InboxToastPop.js';
import usePrevious from '/client/components/utilities/usePreviousHook.js';


import Spin from '../../components/uUi/Spin.jsx';
import AppWrap from './AppWrap.jsx';

const AppView = ({
  /*ready,*/ readyUsers, readyDebug, // subs
  orb, bolt, // meta
  username, user, active, org, app, users // self
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
   
  if(/*!ready ||*/ !readyUsers || !readyDebug || !app ) {
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
      orb={orb}
      bolt={bolt}
      app={app}
      users={users}
    />
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let org = user ? user.org : false;
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  // const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const usersDebugSub = login ? Meteor.subscribe('usersDataDebug') : false;
  if(!login) {
    return {
      // ready: false,
      readyUsers: false,
      readyDebug: false
    };
  }else if(!active) {
    return {
      // ready: false,
      readyUsers: false,
      readyDebug: false
    };
  }else{
    return {
      // ready: appSub.ready(),
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