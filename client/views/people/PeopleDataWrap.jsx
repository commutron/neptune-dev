import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import InboxToastPop from '/client/components/utilities/InboxToastPop.js';
import usePrevious from '/client/components/utilities/usePreviousHook.js';

import ErrorCatch from '/client/components/utilities/ErrorCatch.jsx';
import Pref from '/client/global/pref.js';
import Spin from '../../components/uUi/Spin.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Slides from '../../components/smallUi/Slides.jsx';

import DashSlide from './DashSlide/DashSlide.jsx';
import ActivitySlide from './ActivitySlide.jsx';
import ScheduleSlide from './ScheduleSlide.jsx';
import AccountsManagePanel, { PermissionHelp } from './AccountsManagePanel.jsx';

const PeopleDataWrap = ({
  ready, readyUsers, readyTides, // subs
  user, active, org, app, // self
  bCache, pCache, // caches
  batches, users // working data
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
    
    
  if(
    // !ready || 
    !readyUsers || !readyTides || !app) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
    
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  const isPeopleSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  
  return(
    <ErrorCatch>
    <div className='simpleContainer'>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='frontCenterTitle'>People</div>
        <div className='auxRight' />
        <TideFollow />
      </div>
      
      <div className='simpleContent'>
      
        <Slides
          menu={[
            <b><i className='fas fa-satellite-dish fa-fw'></i>  Current</b>,
            <b><i className='fas fa-history fa-fw'></i>  Production Activity</b>,
            <b><i className='far fa-calendar-alt fa-fw'></i>  Work Schedule</b>,
            <b><i className='fas fa-user-lock fa-fw'></i>  Permissions</b>,
            <b><i className='fas fa-users-cog fa-fw'></i>   Account Manager</b>,
          ]}
          disable={[false, false, !isNightly, false, (!isAdmin && !isPeopleSuper)]}>
          
          <DashSlide
            key={0}
            app={app}
            user={user}
            users={users}
            batches={batches}
            bCache={bCache} />
          
          <ActivitySlide
            key={1}
            app={app}
            user={user}
            users={users}
            bCache={bCache}
            allUsers={true} />
          
          {isNightly &&
            <ScheduleSlide
              key={2}
              app={app}
              user={user}
              users={users}
              pCache={pCache} />
          }
          
          <div key={3}>
            <PermissionHelp auths={Pref.auths} admin={false} />
          </div>
          
          {isAdmin || isPeopleSuper ?
            <AccountsManagePanel key={4} users={users} />
          : null }
          
        </Slides>
				
      </div>
    </div>
    </ErrorCatch>
  );
};

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  const clientTZ = moment.tz.guess();
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  //const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const tidesSub = login ? Meteor.subscribe('tideData', clientTZ) : false;
  if(!login) {
    return {
      // ready: false,
      readyUsers: false,
      readyTides: false
    };
  }else if(!active) {
    return {
      // ready: false,
      readyUsers: false,
      readyTides: false
    };
  }else{
    return {
      //ready: appSub.ready(),
      readyUsers: usersSub.ready(),
      readyTides: tidesSub.ready(),
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      batches: BatchDB.find({}).fetch(),
      users: Meteor.users.find({}, { sort: { username: 1 } } ).fetch()
    };
  }
})(PeopleDataWrap);