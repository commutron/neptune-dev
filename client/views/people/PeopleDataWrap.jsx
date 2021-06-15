import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
// import moment from 'moment';
// import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import { branchesSort } from '/client/utility/Arrays.js';
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
import RevolvingPINCheck from './RevolvingPINCheck';

const PeopleDataWrap = ({
  readybName, readyPeople, // subs
  user, active, isDebug, // self
  org, users, app, // org
  traceDT // batch name cache
})=> {
  
  useLayoutEffect( ()=>{
    InboxToastPop(user);
  }, [user]);
    
  if( !readybName || !readyPeople || !app ) {
    return( <SpinWrap /> );
  }
  
  const userS = users.sort((u1, u2)=>
          u1.username.toLowerCase() > u2.username.toLowerCase() ? 1 : 
          u1.username.toLowerCase() < u2.username.toLowerCase() ? -1 : 0 );
  const brancheS = branchesSort(app.branches);
     
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  // const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  const isPeopleSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const antiAuth = !isAdmin && !isPeopleSuper;
  
  return(
    <ErrorCatch>
    <div className='simpleContainer'>
      <ToastContainer
        position="top-center"
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
            <b><i className='fas fa-walking fa-fw gapR'></i>Current</b>,
            <b><i className='fas fa-history fa-fw gapR'></i>Daily History</b>,
            <b><i className='fas fa-tachometer-alt fa-fw gapR'></i>Weekly Metrics</b>,
            <b><i className='far fa-calendar-alt fa-fw gapR'></i>Work Schedule</b>,
            <b><i className='fas fa-user-lock fa-fw gapR'></i>Permissions</b>,
            <b><i className='fas fa-users-cog fa-fw gapR'></i>Account Manager</b>,
            <b><i className='fas fa-hourglass fa-fw gapR'></i>Error Check</b>,
            antiAuth || <b><i className='fas fa-user-secret fa-fw gapR'></i>Organization PIN</b>,
          ]}
          disable={[false, false, false, false, false, antiAuth, antiAuth, antiAuth]}>
          
          <DashSlide
            key={0}
            app={app}
            user={user}
            users={userS}
            traceDT={traceDT}
            brancheS={brancheS}
            isDebug={isDebug} />
            
          <HistorySlide
            key={1}
            app={app}
            user={user}
            users={userS}
            traceDT={traceDT}
            brancheS={brancheS}
            allUsers={true}
            isDebug={isDebug} />
          
          <PerformanceSlide
            key={2}
            app={app}
            user={user}
            users={userS}
            traceDT={traceDT}
            brancheS={brancheS}
            isDebug={isDebug} />
            
          <ScheduleSlide
            key={3}
            app={app}
            user={user}
            users={userS}
            isAdmin={isAdmin}
            isPeopleSuper={isPeopleSuper} />
          
          <div key={4}>
            <PermissionHelp auths={Pref.auths} admin={false} />
          </div>
          
          {isAdmin || isPeopleSuper ?
            <AccountsManagePanel 
              key={5} 
              app={app}
              users={userS}
              traceDT={traceDT}
              brancheS={brancheS}
              isDebug={isDebug} />
          : null }
          
          {isAdmin || isPeopleSuper ?
            <TimeErrorCheck key={6} />
          : null }
          
          {isAdmin || isPeopleSuper ?
            <RevolvingPINCheck 
              key={7}
              isAdmin={isAdmin}
              isPeopleSuper={isPeopleSuper} />
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
  const bNameSub = login ? Meteor.subscribe('bNameData') : false;
  const peopleSub = login ? Meteor.subscribe('peopleData') : false;
  if(!login) {
    return {
      readybName: false,
      readyPeople: false
    };
  }else if(!active) {
    return {
      readybName: false,
      readyPeople: false
    };
  }else{
    return {
      readybName: bNameSub.ready(),
      readyPeople: peopleSub.ready(),
      user: user,
      active: active,
      isDebug: isDebug,
      org: org,
      app: AppDB.findOne({org: org}),
      traceDT: TraceDB.find({}).fetch(),
      users: Meteor.users.find({}).fetch()
    };
  }
})(PeopleDataWrap);