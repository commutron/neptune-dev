import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import { localeUpdate } from '/client/utility/WorkTimeCalc';
import { branchesSort } from '/client/utility/Arrays.js';
import ErrorCatch from '/client/layouts/ErrorCatch';
import Pref from '/client/global/pref.js';
import { SpinWrap } from '../../components/tinyUi/Spin';

import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';
import Slides from '../../components/smallUi/Slides';

import DashSlide from './DashSlide/DashSlide';
import PerformanceSlide from './PerformanceSlide';
import HistorySlide from './HistorySlide';
import ScheduleSlide from './ScheduleSlide';
import AccountsManagePanel, { PermissionHelp } from './AccountsManagePanel';
import TimeErrorCheck from './TimeErrorCheck';
import RevolvingPINCheck from './RevolvingPINCheck';

const PeopleDataWrap = ({
  readybName, readyPeople,
  user, active, isDebug,
  org, users, app,
  traceDT
})=> {
  
  useLayoutEffect( ()=>{
    InboxToastPop(user);
  }, [user]);
    
  if( !readybName || !readyPeople || !app ) {
    return( <SpinWrap /> );
  }
  
  localeUpdate(app);
  
  const userS = users.sort((u1, u2)=>
          u1.username.toLowerCase() > u2.username.toLowerCase() ? 1 : 
          u1.username.toLowerCase() < u2.username.toLowerCase() ? -1 : 0 );
  const brancheS = branchesSort(app.branches);
     
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
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
            <b><i className='fas fa-hourglass-end fa-fw gapR'></i>Overtime Errors</b>,
            <b><i className='fas fa-users-cog fa-fw gapR'></i>Account Manager</b>,
            <b><i className='fas fa-user-lock fa-fw gapR'></i>Permissions</b>,
            <b><i className='fas fa-dice fa-fw gapR'></i>Revolving PIN</b>,
          ]}
          disable={[false, false, false, false, antiAuth, antiAuth, false, antiAuth]}>
          
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
          
          {isAdmin || isPeopleSuper ?
            <TimeErrorCheck key={6} />
          : null }
          
          {isAdmin || isPeopleSuper ?
            <AccountsManagePanel 
              key={5} 
              app={app}
              users={userS}
              traceDT={traceDT}
              brancheS={brancheS}
              isDebug={isDebug} />
          : null }
          
          <div key={4}>
            <PermissionHelp auths={Pref.auths} admin={false} />
          </div>
          
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