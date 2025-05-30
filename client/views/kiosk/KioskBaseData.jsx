import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
// import Pref from '/client/global/pref.js';

import { SpinWrap } from '/client/components/tinyUi/Spin';

import KioskWrap from '/client/layouts/KioskLayout';

const KioskBaseData = ({ coldReady, user, users, app, allTrace })=> {

  if( !coldReady || !user || !app ) {
    return( <SpinWrap /> );
  }
  
  const activeUsers = users.filter( x => 
                        Roles.userIsInRole(x._id, 'active') === true &&
                        Roles.userIsInRole(x._id, 'readOnly') === false);
  
  return(
    <KioskWrap
      user={user}
      users={activeUsers}
      app={app}
      coldReady={coldReady}
      allTrace={allTrace}
    />
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  const coldSub = login ? Meteor.subscribe('thinKiosk') : false;
  
  if( !login ) {
    return {
      coldReady: false
    };
  }else{
    return {
      coldReady: coldSub.ready(),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      app: AppDB.findOne({org: org}),
      allTrace: TraceDB.find({}, { sort: { batch: -1 } }).fetch(),
    };
  }
})(KioskBaseData);