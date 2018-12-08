import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';

import Spin from '../../components/uUi/Spin.jsx';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import Slides from '../../components/smallUi/Slides.jsx';
import DataRepair from './DataRepair.jsx';

class ToolboxWrap extends Component	{
  
  render() {
    
    if(!this.props.ready || !this.props.app) {
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
          <div className='frontCenterTitle'>Toolbox</div>
          <div className='rightSpace' />
        </div>
      
        <div className='simpleContent locked'>
        
        {admin ?
            
          <Slides
            menu={[
              <b><i className='fas fa-wrench fa-fw'></i>  Data Repair</b>
            ]}>
            
            <DataRepair
              key={1}
              orb={this.props.orb}
              bolt={this.props.bolt}
              app={this.props.app}
              users={this.props.users} />
            <div key={2}><p>other tool</p></div>
            
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
      orb: Session.get('now'),
      bolt: Session.get('allData'),
      user: name,
      active: active,
      org: org,
      app: AppDB.findOne({org: org}),
      users: Meteor.users.find({}, {sort: {username:1}}).fetch()
    };
  }
})(ToolboxWrap);