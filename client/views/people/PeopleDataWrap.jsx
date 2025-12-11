import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { localeUpdate } from '/client/utility/WorkTimeCalc';
import { branchesSort } from '/client/utility/Arrays.js';
import { PlainFrame } from '/client/layouts/MainLayouts';
import Pref from '/public/pref.js';
import Spin from '../../components/tinyUi/Spin';

import Slides from '/client/layouts/TaskBars/Slides';

import DashSlide from './DashSlide/DashSlide';
import PerformanceSlide from './PerformanceSlide';
import HistorySlide from './HistorySlide';
import ScheduleSlide from './ScheduleSlide';
import AccountsManagePanel from './AccountsManagePanel';
import PermissionHelp from './PermissionHelp';
import EmailLogSlide from './EmailLogSlide';
import DMLogSlide from './DMLogSlide';
import RevolvingPINCheck from './RevolvingPINCheck';


const PeopleDataWrap = ({
  readybName, readyPeople,
  user, active, isDebug,
  org, users, loggedIn, app,
  traceDT
})=> {
    
  if( !readybName || !readyPeople || !app ) {
    return( 
      <PlainFrame title='People'>
        <div className='centre wide'>
          <Spin />
        </div>
      </PlainFrame>
    );
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
    <PlainFrame title='People'>
      <div className='simpleContent'>
      
        <Slides
          menu={[
            <b><i className='fas fa-walking fa-fw gapR'></i>Current</b>,
            <b><i className='fas fa-history fa-fw gapR'></i>Daily History</b>,
            <b><i className='fas fa-tachometer-alt fa-fw gapR'></i>Weekly Utilization</b>,
            <b><i className='far fa-calendar-alt fa-fw gapR'></i>Work Schedule</b>,
            <b><i className='fas fa-comments fa-fw gapR'></i>Message Log</b>,
            <b><i className='fas fa-envelopes-bulk fa-fw gapR'></i>Email Log</b>,
            <b><i className='fas fa-user-lock fa-fw gapR'></i>Permissions</b>,
            <b><i className='fas fa-users-cog fa-fw gapR'></i>Accounts Manager</b>
          ]}
          lowmenu={[
            <b><i className='fas fa-dice fa-fw gapR'></i>Revolving PIN</b>
          ]}
          disable={[
            false, false, false, false, 
            antiAuth, antiAuth, false, antiAuth, antiAuth
          ]}>
          
          <DashSlide
            key={0}
            users={userS}
            loggedIn={loggedIn}
            traceDT={traceDT}
            brancheS={brancheS}
            isDebug={isDebug} 
          />
            
          <HistorySlide
            key={1}
            app={app}
            user={user}
            users={userS}
            traceDT={traceDT}
            brancheS={brancheS}
            allUsers={true}
            isDebug={isDebug} 
          />
          
          <PerformanceSlide
            key={2}
            app={app}
            user={user}
            users={userS}
            traceDT={traceDT}
            brancheS={brancheS}
            isDebug={isDebug} 
          />
            
          <ScheduleSlide
            key={3}
            app={app}
            user={user}
            users={userS}
            isAdmin={isAdmin}
            isPeopleSuper={isPeopleSuper} 
          />
          
          {isAdmin || isPeopleSuper ?
            <DMLogSlide key={4} />
          : null }
          
          {isAdmin || isPeopleSuper ?
            <EmailLogSlide key={5} />
          : null }
          
          <div key={6}>
            <PermissionHelp 
              auths={[...Pref.keys,...Pref.power,...Pref.auths,...Pref.areas,'BRKt3rm1n2t1ng8r2nch']} 
              admin={false} 
            />
          </div>
          
          {isAdmin || isPeopleSuper ?
            <AccountsManagePanel 
              key={7} 
              app={app}
              users={userS}
              traceDT={traceDT}
              brancheS={brancheS}
              isDebug={isDebug}
            />
          : null }
          
          {isAdmin || isPeopleSuper ?
            <RevolvingPINCheck 
              key={8}
              isAdmin={isAdmin}
              isPeopleSuper={isPeopleSuper}
            />
          : null }
          
        </Slides>
				
      </div>
    </PlainFrame>
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
      users: Meteor.users.find({}).fetch(),
      loggedIn: CacheDB.findOne({dataName: 'userLogin_status'})?.dataArray
    };
  }
})(PeopleDataWrap);