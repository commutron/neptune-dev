import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { PlainFrame } from '/client/layouts/MainLayouts';
import Spin from '../../components/tinyUi/Spin.jsx';
import AppWrap from './AppWrap.jsx';
import MetaSlide from './appSlides/MetaSlide';

const AppView = ({
  readyDebug, // subs
  orb, bolt, // meta
  username, user, active, isAdmin, isDebug, // self
  org, app, users // org
})=> {
   
  if(!readyDebug || !app ) {
    return( 
      <PlainFrame title='Settings'>
        <div className='centre wide'>
          <Spin />
        </div>
      </PlainFrame>
    );
  }
  
  if(isAdmin) {
    return(
      <PlainFrame title='Settings'>
        <AppWrap
          orb={orb}
          bolt={bolt}
          isAdmin={isAdmin}
          isDebug={isDebug}
          app={app}
          users={users}
        />
      </PlainFrame>
    );
  }
  
  return(
    <PlainFrame title='Settings'>
      <div className='simpleContent lightTheme centre middle'>
        <p className='medBig centreText vmargin'>App settings are limited to administrators only</p>
        <button
          className='action blackHover'
          onClick={()=> window.history.back()}
        ><i className='fas fa-arrow-circle-left fa-lg'></i> Go Back</button>
        <MetaSlide />
      </div>
    </PlainFrame>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let org = user ? user.org : false;
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isAdmin = login ? Roles.userIsInRole(Meteor.userId(), 'admin') : false;
  const isDebug = login ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const debugSub = login ? Meteor.subscribe('debugData') : false;
  if(!login) {
    return {
      readyDebug: false
    };
  }else if(!active) {
    return {
      readyDebug: false
    };
  }else{
    return {
      readyDebug: debugSub.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      username: name,
      user: user,
      active: active,
      isAdmin: isAdmin,
      isDebug: isDebug,
      org: org,
      app: AppDB.findOne({org: org}),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(AppView);