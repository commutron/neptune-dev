import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import { UnreadInboxToastPop } from '/client/utility/InboxToastPop.js';

// import Pref from '/client/global/pref.js';
import Spin from '/client/components/tinyUi/Spin.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Slides from '../../components/smallUi/Slides.jsx';
import ActivityPanel from './ActivityPanel.jsx';
import InboxPanel from './InboxPanel.jsx';
import WatchlistPanel from './WatchlistPanel.jsx';
import PrivacyPanel from './PrivacyPanel.jsx';

import UserSettings from '/client/components/forms/UserSettings.jsx';


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
    
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const branches = app.branches.filter( b => b.open === true );
  const brancheS = branches.sort((b1, b2)=> {
          if (b1.position < b2.position) { return 1 }
          if (b1.position > b2.position) { return -1 }
          return 0;
        }); 
        
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
            <b><i className='fas fa-sliders-h fa-fw'></i>  Preferences</b>,
            <b><i className='fas fa-shield-alt fa-fw'></i>  Privacy & Permissions</b>,
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
            
          <UserSettings
            key={4}
            app={app}
            user={user}
            isAdmin={isAdmin}
            brancheS={brancheS} />
          
          <PrivacyPanel
            key={5}
            orb={orb}
            bolt={bolt}
            app={app}
            user={user}
            isAdmin={isAdmin}
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