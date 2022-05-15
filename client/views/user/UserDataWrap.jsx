import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import InboxToastPop from '/client/utility/InboxToastPop.js';
import { branchesSort } from '/client/utility/Arrays.js';

import { PlainFrame } from '/client/layouts/MainLayouts';
import Spin from '/client/components/tinyUi/Spin';
import Slides from '/client/components/smallUi/Slides';
import ActivityPanel from './ActivityPanel';
import InboxPanel from './InboxPanel';
import PrivacyPanel from './PrivacyPanel';

import UserSettings from '/client/components/forms/User/UserSettings';


const UserDataWrap = ({
  readybNames,
  orb, bolt,
  user, isAdmin, isDebug, org, app,
  traceDT, users
})=> {
  
  useLayoutEffect( ()=>{
    InboxToastPop(user);
  }, [user]);
  
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
            <b><i className='fas fa-user-clock fa-fw gapR'></i>Production Activity</b>,
            <b><i className='fas fa-user-cog fa-fw gapR'></i>Preferences</b>,
            <b><i className='fas fa-user-shield fa-fw gapR'></i>Access & Privacy</b>,
            <b><i className='fas fa-envelope fa-fw gapR'></i>Messages{iL}</b>
          ]}
          extraClass='space5x5'>
            
          <ActivityPanel
            key={1}
            app={app}
            brancheS={brancheS}
            user={user}
            isDebug={isDebug}
            users={users}
            traceDT={traceDT} />
            
          <UserSettings
            key={2}
            app={app}
            user={user}
            isAdmin={isAdmin}
            brancheS={brancheS} />
          
          <PrivacyPanel
            key={3}
            orb={orb}
            bolt={bolt}
            app={app}
            user={user}
            isAdmin={isAdmin}
          />
          
          <InboxPanel
            key={4}
            orb={orb}
            bolt={bolt}
            app={app}
            user={user}
            users={users} />
          
        </Slides>
				
      </div>
    </PlainFrame>
  );
};

export default withTracker( () => {
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
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      user: user,
      isAdmin: isAdmin,
      isDebug: isDebug,
      org: org,
      app: AppDB.findOne({org: org}),
      traceDT: TraceDB.find({}).fetch(),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(UserDataWrap);