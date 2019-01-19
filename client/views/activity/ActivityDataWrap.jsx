import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';

import Spin from '../../components/uUi/Spin.jsx';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import Slides from '../../components/smallUi/Slides.jsx';
import RecentPanel from './RecentPanel.jsx';
import InboxPanel from './InboxPanel.jsx';
import WatchlistPanel from './WatchlistPanel.jsx';

class WatchDataWrap extends Component	{
  
  render() {
    
    if(!this.props.ready || !this.props.readyEvents || !this.props.app) {
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
          autoClose={10000}
          newestOnTop />
        <div className='tenHeader'>
          <div className='topBorder' />
          <HomeIcon />
          <div className='frontCenterTitle'>Activity</div>
          <div className='rightSpace' />
        </div>
      
        <div className='simpleContent'>
        
          <Slides
            menu={[
              <b><i className='fas fa-history fa-fw'></i>  Production Activity</b>,
              <b><i className='far fa-eye fa-fw'></i>  Watchlist</b>,
              <b><i className='fas fa-inbox fa-fw'></i>  Inbox</b>
            ]}>
            
            <RecentPanel
              key={1}
              orb={this.props.orb}
              bolt={this.props.bolt}
              app={this.props.app}
              user={this.props.user}
              users={this.props.users} />
            <WatchlistPanel
              key={2}
              orb={this.props.orb}
              bolt={this.props.bolt}
              app={this.props.app}
              user={this.props.user}
              users={this.props.users}
              batchEvents={this.props.batchEvents} />
            <InboxPanel
              key={3}
              orb={this.props.orb}
              bolt={this.props.bolt}
              app={this.props.app}
              user={this.props.user}
              users={this.props.users} />
            
          </Slides>
  				
        </div>
      </div>
    );
  }
}

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = login ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const appSub = login ? Meteor.subscribe('appData') : false;
  const eventsSub = login ? Meteor.subscribe('eventsData') : false;
  if(!login) {
    return {
      ready: false,
    };
  }else if(!active) {
    return {
      ready: false,
    };
  }else{
    return {
      ready: appSub.ready(),
      readyEvents: eventsSub.ready(),
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      user: user,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      batchEvents: BatchDB.find({}).fetch(),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(WatchDataWrap);