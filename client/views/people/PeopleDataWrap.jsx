import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import Pref from '/client/global/pref.js';
import Spin from '../../components/tinyUi/Spin.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Slides from '../../components/smallUi/Slides.jsx';

import DashSlide from './DashSlide/DashSlide.jsx';
import PerformanceSlide from './PerformanceSlide.jsx';
import HistorySlide from './HistorySlide.jsx';
import ScheduleSlide from './ScheduleSlide.jsx';
import AccountsManagePanel, { PermissionHelp } from './AccountsManagePanel.jsx';

const PeopleDataWrap = ({
  ready, readyUsers, readyTides, // subs
  user, active, isDebug, org, app, // self
  bCache, pCache, // caches
  batches, users // working data
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
   
  const clientTZ = moment.tz.guess(); 
    
  if( !readyUsers || !readyTides || !app) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
  
  const brancheS = app.branches.sort((b1, b2)=> {
    return b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 });
     
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
          menu={[           // satellite-dish
            <b><i className='fas fa-walking fa-fw'></i>  Current</b>,
            <b><i className='fas fa-history fa-fw'></i>  Daily History</b>,
            <b><i className='fas fa-tachometer-alt fa-fw'></i>  Weekly Metrics</b>,
            <b><i className='far fa-calendar-alt fa-fw'></i>  Work Schedule</b>,
            <b><i className='fas fa-user-lock fa-fw'></i>  Permissions</b>,
            <b><i className='fas fa-users-cog fa-fw'></i>   Account Manager</b>,
          ]}
          disable={[false, false, false, antiAuth, false, antiAuth]}>
          
          <DashSlide
            key={0}
            app={app}
            user={user}
            users={users}
            batches={batches}
            bCache={bCache}
            brancheS={brancheS}
            isDebug={isDebug} />
            
          <HistorySlide
            key={1}
            app={app}
            user={user}
            users={users}
            bCache={bCache}
            brancheS={brancheS}
            clientTZ={clientTZ}
            allUsers={true}
            isDebug={isDebug} />
          
          <PerformanceSlide
            key={2}
            app={app}
            user={user}
            users={users}
            bCache={bCache}
            brancheS={brancheS}
            clientTZ={clientTZ}
            isDebug={isDebug} />
            
          {!antiAuth &&
            <ScheduleSlide
              key={3}
              app={app}
              user={user}
              users={users}
              pCache={pCache} />
          }
          
          <div key={4}>
            <PermissionHelp auths={Pref.auths} admin={false} />
          </div>
          
          {isAdmin || isPeopleSuper ?
            <AccountsManagePanel 
              key={5} 
              app={app}
              users={users}
              bCache={bCache}
              brancheS={brancheS}
              isDebug={isDebug} />
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
  const isDebug = login ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const tidesSub = login ? Meteor.subscribe('tideData', clientTZ) : false;
  if(!login) {
    return {
      readyUsers: false,
      readyTides: false
    };
  }else if(!active) {
    return {
      readyUsers: false,
      readyTides: false
    };
  }else{
    return {
      readyUsers: usersSub.ready(),
      readyTides: tidesSub.ready(),
      user: user,
      active: active,
      isDebug: isDebug,
      org: org,
      app: AppDB.findOne({org: org}),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      batches: BatchDB.find({}).fetch(),
      users: Meteor.users.find({}, { sort: { username: 1 } } ).fetch()
    };
  }
})(PeopleDataWrap);