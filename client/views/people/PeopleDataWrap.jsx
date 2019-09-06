import React, { useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import InboxToast from '/client/components/utilities/InboxToast.js';
import Pref from '/client/global/pref.js';
import Spin from '../../components/uUi/Spin.jsx';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Slides from '../../components/smallUi/Slides.jsx';

//import ActivityPanel from '/client/views/user/ActivityPanel.jsx';
import ActivityPanel from './ActivityPanel.jsx';
import DashSlide from './DashSlide/DashSlide.jsx';

import { PermissionHelp } from '/client/views/app/appPanels/AccountsManagePanel';

const usePrevious = (value)=> {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const PeopleDataWrap = (props)=> {
  
  const prevProps = usePrevious(props);
    useEffect( ()=>{
      prevProps && InboxToast(prevProps, props);
    });
    
  if(!props.ready || !props.readyUsers || !props.readyTides || !props.app) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
    
  // const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  
  return (
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
            <b><i className='fas fa-user-lock fa-fw'></i>  Permissions</b>,
          ]}>
          
          
          <DashSlide
            key={0}
            app={props.app}
            user={props.user}
            users={props.users}
            batches={props.batches}
            bCache={props.bCache} />
          
          <ActivityPanel
            key={1}
            app={props.app}
            user={props.user}
            users={props.users}
            bCache={props.bCache}
            allUsers={true} />
            
          <div key={4}>
            <PermissionHelp roles={Pref.roles} admin={false} />
          </div>
          
          
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
  const tidesSub = login ? Meteor.subscribe('tideData') : false;
  if(!login) {
    return {
      ready: false,
      readyUsers: false,
      readyTides: false
    };
  }else if(!active) {
    return {
      ready: false,
      readyUsers: false,
      readyTides: false
    };
  }else{
    return {
      ready: appSub.ready(),
      readyUsers: usersSub.ready(),
      readyTides: tidesSub.ready(),
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      batches: BatchDB.find({}).fetch(),
      users: Meteor.users.find({}, { sort: { username: 1 } } ).fetch()
    };
  }
})(PeopleDataWrap);