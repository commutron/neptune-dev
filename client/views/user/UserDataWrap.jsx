import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import { UnreadInboxToastPop } from '/client/utility/InboxToastPop.js';

//import Pref from '/client/global/pref.js';
import Spin from '/client/components/tinyUi/Spin.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Slides from '../../components/smallUi/Slides.jsx';
import ActivityPanel from './ActivityPanel.jsx';
import InboxPanel from './InboxPanel.jsx';
import WatchlistPanel from './WatchlistPanel.jsx';
import PrivacyPanel from './PrivacyPanel.jsx';

import { AdminDown } from '/client/components/forms/AdminForm.jsx';
import { ChangeAutoScan } from '/client/components/forms/UserManageForm.jsx';
import { ChangeNCcodes } from '/client/components/forms/UserManageForm.jsx';
import { ChangeNCselection } from '/client/components/forms/UserManageForm.jsx';
import UserSpeedSet from '/client/components/forms/UserSpeedSet.jsx';
import PasswordChange from '/client/components/forms/PasswordChange.jsx';
import { PermissionHelp } from '/client/views/people/AccountsManagePanel';

const UserDataWrap = ({
  readyUsers, readyEvents, // subs
  orb, bolt, // meta
  user, active, org, app, // self
  bCache, batches, users // working data
})=> {
  
  useLayoutEffect( ()=>{
    UnreadInboxToastPop(user);
  }, []);
  
  if(
    !readyUsers || 
    !readyEvents ||
    !app
  ) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
    
  const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  
  return (
    <div className='simpleContainer'>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='frontCenterTitle'>{user.username || "User"}</div>
        <div className='auxRight' />
        <TideFollow />
      </div>
      
      <div className='simpleContent'>
      
        <Slides
          menu={[
            <b><i className='fas fa-history fa-fw'></i>  Production Activity</b>,
            <b><i className='far fa-eye fa-fw'></i>  Watchlist</b>,
            <b><i className='fas fa-inbox fa-fw'></i>  Inbox</b>,
            <b><i className='fas fa-id-card fa-fw'></i>  Preferences</b>,
            <b><i className='fas fa-user-shield fa-fw'></i>  Privacy</b>,
          ]}
          extraClass='space5x5'>
            
          <ActivityPanel
            key={1}
            orb={orb}
            bolt={bolt}
            app={app}
            user={user}
            users={users}
            bCache={bCache} />
          <WatchlistPanel
            key={2}
            orb={orb}
            bolt={bolt}
            app={app}
            user={user}
            users={users}
            batchEvents={batches}
            bCache={bCache} />
          <InboxPanel
            key={3}
            orb={orb}
            bolt={bolt}
            app={app}
            user={user}
            users={users} />
            
          <div key={4} className='comfort'>
      
            <div className=''>
              <p className='clean'>username: {user.username}</p>
              <p className='clean'>id: {Meteor.user()._id}</p>
              <p>organization: <i className='greenT'>{Meteor.user().org}</i></p>
              <hr />
              <fieldset>
                <ChangeAutoScan />
                <hr/>
                <ChangeNCcodes />
                <hr />
                <ChangeNCselection />
                <hr />
                <UserSpeedSet />
              </fieldset>
              <hr />
              <fieldset>
                <PasswordChange />
                <hr />
                { admin ? <AdminDown /> : null }
              </fieldset>
            
            </div>
            <PermissionHelp auths={Meteor.user().roles} admin={admin} />
          </div>
          
          <PrivacyPanel
            key={5}
            orb={orb}
            bolt={bolt}
            app={app}
            user={user}
            users={users}
            bCache={bCache} />
          
        </Slides>
				
      </div>
    </div>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const eventsSub = login ? Meteor.subscribe('eventsData') : false;
  if(!login) {
    return {
      readyUsers: false,
      readyEvents: false
    };
  }else if(!active) {
    return {
      readyUsers: false,
      readyEvents: false
    };
  }else{
    return {
      readyUsers: usersSub.ready(),
      readyEvents: eventsSub.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      batches: BatchDB.find({}).fetch(),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(UserDataWrap);