import React, { useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import InboxToast from '/client/components/utilities/InboxToast.js';
//import Pref from '/client/global/pref.js';
import Spin from '../../components/uUi/Spin.jsx';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Slides from '../../components/smallUi/Slides.jsx';
import ActivityPanel from './ActivityPanel.jsx';
import InboxPanel from './InboxPanel.jsx';
import WatchlistPanel from './WatchlistPanel.jsx';
import PrivacyPanel from './PrivacyPanel.jsx';

import { AdminDown } from '/client/components/forms/AdminForm.jsx';
import { ChangeAutoScan } from '/client/components/forms/UserManageForm.jsx';
import UserSpeedSet from '/client/components/forms/UserSpeedSet.jsx';
import PasswordChange from '/client/components/forms/PasswordChange.jsx';
import { PermissionHelp } from '/client/views/app/appPanels/AccountsManagePanel';

const usePrevious = (value)=> {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const UserDataWrap = (props)=> {
  
  const prevProps = usePrevious(props);
    useEffect( ()=>{
      prevProps && InboxToast(prevProps, props);
    });
    
  if(
    !props.ready || 
    !props.readyUsers || 
    !props.readyEvents ||
    !props.app
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
        <div className='frontCenterTitle'>{props.user.username || "User"}</div>
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
          ]}>
            
          <ActivityPanel
            key={1}
            orb={props.orb}
            bolt={props.bolt}
            app={props.app}
            user={props.user}
            users={props.users}
            bCache={props.bCache} />
          <WatchlistPanel
            key={2}
            orb={props.orb}
            bolt={props.bolt}
            app={props.app}
            user={props.user}
            users={props.users}
            batchEvents={props.batches}
            bCache={props.bCache} />
          <InboxPanel
            key={3}
            orb={props.orb}
            bolt={props.bolt}
            app={props.app}
            user={props.user}
            users={props.users} />
            
          <div key={4} className='balance'>
      
            <div className='centre'>
              <p className='clean'>username: {props.user.username}</p>
              <p className='clean'>id: {Meteor.user()._id}</p>
              <p>organization: <i className='greenT'>{Meteor.user().org}</i></p>
              <hr />
              <p><ChangeAutoScan /></p>
              <hr />
              <p><UserSpeedSet /></p>
              <hr />
              <PasswordChange />
              <hr />
              { admin ?
              <div>
                <AdminDown />
              </div>
            : null }
            
            </div>
            <PermissionHelp roles={Meteor.user().roles} admin={admin} />
          </div>
          
          <PrivacyPanel
            key={5}
            orb={props.orb}
            bolt={props.bolt}
            app={props.app}
            user={props.user}
            users={props.users}
            bCache={props.bCache} />
          
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
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const eventsSub = login ? Meteor.subscribe('eventsData') : false;
  if(!login) {
    return {
      ready: false,
      readyUsers: false,
      readyEvents: false
    };
  }else if(!active) {
    return {
      ready: false,
      readyUsers: false,
      readyEvents: false
    };
  }else{
    return {
      ready: appSub.ready(),
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