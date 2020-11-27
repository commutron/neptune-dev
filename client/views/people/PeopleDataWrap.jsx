import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
// import moment from 'moment';
// import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import Pref from '/client/global/pref.js';
import { SpinWrap } from '../../components/tinyUi/Spin.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Slides from '../../components/smallUi/Slides.jsx';

import DashSlide from './DashSlide/DashSlide.jsx';
import PerformanceSlide from './PerformanceSlide.jsx';
import HistorySlide from './HistorySlide.jsx';
import ScheduleSlide from './ScheduleSlide.jsx';
import AccountsManagePanel, { PermissionHelp } from './AccountsManagePanel.jsx';
import TimeErrorCheck from './TimeErrorCheck';

const PeopleDataWrap = ({
  ready, readyUsers, readybName, // subs
  user, active, isDebug, // self
  org, users, app, // org
  traceDT // batch name cache
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
    
  if( !readyUsers || !readybName || !app) {
    return( <SpinWrap /> );
  }
  
  const brancheS = app.branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
     
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  // const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  const isPeopleSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const antiAuth = !isAdmin && !isPeopleSuper;
  
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
            <b><i className='fas fa-walking fa-fw'></i>  Current</b>,
            <b><i className='fas fa-history fa-fw'></i>  Daily History</b>,
            <b><i className='fas fa-tachometer-alt fa-fw'></i>  Weekly Metrics</b>,
            <b><i className='far fa-calendar-alt fa-fw'></i>  Work Schedule</b>,
            <b><i className='fas fa-user-lock fa-fw'></i>  Permissions</b>,
            <b><i className='fas fa-users-cog fa-fw'></i>   Account Manager</b>,
            <b><i className='fas fa-hourglass fa-fw'></i>   Error Check</b>,
          ]}
          disable={[false, false, false, false, false, antiAuth, antiAuth]}>
          
          <DashSlide
            key={0}
            app={app}
            user={user}
            users={users}
            traceDT={traceDT}
            brancheS={brancheS}
            isDebug={isDebug} />
            
          <HistorySlide
            key={1}
            app={app}
            user={user}
            users={users}
            traceDT={traceDT}
            brancheS={brancheS}
            allUsers={true}
            isDebug={isDebug} />
          
          <PerformanceSlide
            key={2}
            app={app}
            user={user}
            users={users}
            traceDT={traceDT}
            brancheS={brancheS}
            isDebug={isDebug} />
            
          <ScheduleSlide
            key={3}
            app={app}
            user={user}
            users={users}
            isAdmin={isAdmin}
            isPeopleSuper={isPeopleSuper} />
          
          <div key={4}>
            <PermissionHelp auths={Pref.auths} admin={false} />
          </div>
          
          {isAdmin || isPeopleSuper ?
            <AccountsManagePanel 
              key={5} 
              app={app}
              users={users}
              traceDT={traceDT}
              brancheS={brancheS}
              isDebug={isDebug} />
          : null }
          
          {isAdmin || isPeopleSuper ?
            <TimeErrorCheck key={6} />
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
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isDebug = login ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const bNameSub = login ? Meteor.subscribe('bCacheData') : false;
  if(!login) {
    return {
      readyUsers: false,
      readybName: false
    };
  }else if(!active) {
    return {
      readyUsers: false,
      readybName: false
    };
  }else{
    return {
      readyUsers: usersSub.ready(),
      readybName: bNameSub.ready(),
      user: user,
      active: active,
      isDebug: isDebug,
      org: org,
      app: AppDB.findOne({org: org}),
      traceDT: TraceDB.find({}).fetch(),
      users: Meteor.users.find({}, { sort: { username: 1 } } ).fetch()
    };
  }
})(PeopleDataWrap);