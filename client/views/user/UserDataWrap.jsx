import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { branchesSort } from '/client/utility/Arrays.js';

import { PlainFrame } from '/client/layouts/MainLayouts';
import Spin from '/client/components/tinyUi/Spin';
import Slides from '/client/components/smallUi/Slides';
import ActivityPanel from './ActivityPanel';
import ServicePanel from './ServicePanel';
import InboxPanel from './InboxPanel';
import PrivacyPanel from './PrivacyPanel';

import UserSettings from '/client/components/forms/User/UserSettings';


const UserDataWrap = ({
  readybNames, slide,
  user, isAdmin, isDebug, app,
  traceDT, users
})=> {
  
  if( !readybNames || !app || !app.branches || !user || !user.roles ) {
    return( 
      <PlainFrame title=''>
        <div className='centre wide'>
          <Spin />
        </div>
      </PlainFrame>
    );
  }
    
  const branches = app.branches.filter( b => b.open === true );
  const brancheS = branchesSort(branches);
  
  const iL = <i className='rAlign'>{user.inbox.length}</i>;
  
  return(
    <PlainFrame title={user.username || 'user error'}>
      <div className='simpleContent'>
      
        <Slides
          menu={[
            <b><i className='fas fa-clock fa-fw gapR'></i>Project Activity</b>,
            <b><i className='fas fa-gears fa-fw gapR'></i>Equipment</b>,
            <b><i className='fas fa-sliders fa-fw gapR'></i>Preferences</b>,
            <b><i className='fas fa-key fa-fw gapR'></i>Access & Privacy</b>,
            <b><i className='fas fa-bell fa-fw gapR'></i>Notifications{iL}</b>
          ]}
          slide={slide}>
            
          <ActivityPanel
            key={1}
            app={app}
            brancheS={brancheS}
            user={user}
            isDebug={isDebug}
            users={users}
            traceDT={traceDT} />
          
          <ServicePanel
            key={2}
          />
          
          <UserSettings
            key={3}
            app={app}
            user={user}
            isAdmin={isAdmin}
            brancheS={brancheS} />
          
          <PrivacyPanel
            key={4}
            app={app}
            user={user}
            isAdmin={isAdmin}
          />
          
          <InboxPanel
            key={5}
            app={app}
            user={user}
            users={users} />
          
        </Slides>
				
      </div>
    </PlainFrame>
  );
};

export default withTracker( ({ query }) => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  const isAdmin = login ? Roles.userIsInRole(Meteor.userId(), 'admin') : false;
  const isDebug = login ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const bNameSub = login ? Meteor.subscribe('bNameData') : false;
  if(!login) {
    return {
      readybNames: false
    };
  }else{
    return {
      readybNames: bNameSub.ready(),
      slide: query?.slide || 0,
      user: user,
      isAdmin: isAdmin,
      isDebug: isDebug,
      app: AppDB.findOne({org: org}),
      traceDT: TraceDB.find({}).fetch(),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(UserDataWrap);