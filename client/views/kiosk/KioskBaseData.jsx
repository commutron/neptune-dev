import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
// import Pref from '/public/pref.js';

import { SpinWrap } from '/client/components/tinyUi/Spin';

import KioskWrap from '/client/layouts/KioskLayout';

const KioskBaseData = ({ coldReady, user, app, allTrace })=> {

  if( !coldReady || !user || !app ) {
    return( <SpinWrap /> );
  }
  
  const doSerial = Roles.userIsInRole(Meteor.userId(), ['admin', 'kitting']);
  
  const eng = user?.engaged || false;
  const eBatch = eng?.tName || false;
  // const etPro = eng?.task === 'PROX';
  // const etMlt = eng?.task === 'MLTI';
  // 'MAINT', 'EQFX';
  // const etKey = eng?.tKey;

  return(
    <KioskWrap
      user={user}
      eBatch={eBatch}
      doSerial={doSerial}
      app={app}
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
      // users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      app: AppDB.findOne({org: org}),
      allTrace: TraceDB.find({}, { sort: { batch: -1 } }).fetch(),
    };
  }
})(KioskBaseData);