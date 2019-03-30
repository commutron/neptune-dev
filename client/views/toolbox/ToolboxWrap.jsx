import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
//import InboxToast from '/client/components/utilities/InboxToast.js';

import Spin from '../../components/uUi/Spin.jsx';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import Slides from '../../components/smallUi/Slides.jsx';
import DataRepair from './DataRepair.jsx';

class ToolboxWrap extends Component	{
  /*
  componentDidUpdate(prevProps) {
    InboxToast(prevProps, this.props);
  }
  */
  showToast() {
    toast('a default message');
    toast.info('A blue info message');
    toast.success('A green info message');
    toast.warn('A orange warning message');
    toast.error('A red error message');
    
    toast.success('no timeout', { autoClose: false });
  }
  
  sendAtestNotify(all) {
    Meteor.call('sendTestMail', all, (error)=>{
      error && console.log(error);
      toast.success('message sent');
    });
  }
  
  requestAltFlowInfo() {
    Meteor.call('altFlowUse', (error, reply)=>{
      error && console.log(error);
      toast(<div>
        Total Batches: {reply.totalAltBatch} <br />
        Total Items: {reply.totalAltItems} <br />
        Live Batches: {reply.totalLiveBatch} <br />
        Live Items: {reply.totalLiveBatchItems} <br />
        Dormant Batches: {reply.totalDormantBatch} <br />
        Dormant Items: {reply.totalDormantBatchItems}
      </div>, { autoClose: false });
      console.log({ live: reply.aliveBatchInfo, dormant: reply.dormantBatchInfo});
    });
  }
  
  clearUserLogs() {
    Meteor.call('clearNonDebugUserUsageLogs', (error)=>{
      error && console.log(error);
      toast.success('request sent');
    });
  }
  clearthisUserCrumbs() {
    Meteor.call('clearBreadcrumbsRepair', (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  
  render() {
    
    if(!this.props.ready || !this.props.readyUsers || !this.props.app) {
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
          autoClose={5000}
          newestOnTop />
        <div className='tenHeader'>
          <div className='topBorder' />
          <HomeIcon />
          <div className='frontCenterTitle'>Toolbox</div>
          <div className='rightSpace' />
        </div>
      
        <div className='simpleContent locked'>
        
        {admin ?
            
          <Slides
            menu={[
              <b><i className='fas fa-bell fa-fw'></i>  Toast Test</b>,
              <b><i className='fas fa-bell fa-fw'></i>  Notify Test</b>,
              <b><i className='fas fa-wrench fa-fw'></i>  Data Repair</b>,
              <b><i className='fas fa-user-shield fa-fw'></i>  Privacy</b>,
              <b><i className='fas fa-life-ring fa-fw'></i>  Legacy Support</b>
            ]}>
              
            <div key={1}>
              <p>
                <button
                  className='action clearWhite invert'
                  onClick={()=>this.showToast()}
                >Test Toast Notifications</button>
              </p>
            </div>
            
            <div key={2}>
              <p>
                <button
                  className='action clearBlue invert'
                  onClick={()=>this.sendAtestNotify(false)}
                >Send Inbox Notification Test to YOURSELF</button>
              </p>
              <p>
                <button
                  className='action clearBlue invert'
                  onClick={()=>this.sendAtestNotify(true)}
                >Send Inbox Notification Test to ALL USERS</button>
              </p>
            </div>
            
            <div>
              <DataRepair
                key={3}
                orb={this.props.orb}
                bolt={this.props.bolt}
                app={this.props.app}
                users={this.props.users} />
              </div>
              
            <div key={4}>
              <p>
                <button
                  className='action clearBlue invert'
                  onClick={()=>this.clearUserLogs()}
                >Clear Usage Logs of users with "debug" turned OFF</button>
              </p>
              <hr />
              <p>
                <em>On current logged in user</em><br />
                <button
                  onClick={()=>this.clearthisUserCrumbs()}
                  className='action clearBlue invert'
                >Clear Your breadcrumbs</button>
              </p>
            </div>
              
            <div key={5}>
              <p>
                determine support needs
              </p>
              <p>
                <button
                  className='action clearBlue invert'
                  onClick={()=>this.requestAltFlowInfo()}
                >Info on Alt Flow Use</button>
              </p>
            </div>
            
          </Slides>
          
        :
          <p className='medBig centreText'>This page is limited to administrators only</p>
        }
  				
        </div>
      </div>
    );
  }
}

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let org = user ? user.org : false;
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  if(!login) {
    return {
      ready: false,
      readyUsers: false
    };
  }else if(!active) {
    return {
      ready: false,
      readyUsers: false
    };
  }else{
    return {
      ready: appSub.ready(),
      readyUsers: usersSub.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      username: name,
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(ToolboxWrap);