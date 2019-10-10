import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment-timezone';
import InboxToast from '/client/components/utilities/InboxToast.js';

import Spin from '../../components/uUi/Spin.jsx';
import OverviewWrap from './OverviewWrapBeta.jsx';

class View extends Component	{
  
  componentDidUpdate(prevProps) {
    InboxToast(prevProps, this.props);
  }
  
  render() {
    
    if(!this.props.appReady || 
       !this.props.readyUsers || 
       !this.props.ready || 
       !this.props.app
      ) {
      return (
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
      );
    }

    return (
      <OverviewWrap 
        //g={this.props.group}
        //w={this.props.widget}
        b={this.props.batch}
        bx={this.props.batchX}
        bCache={this.props.bCache}
        pCache={this.props.pCache}
        user={this.props.user}
        app={this.props.app} />
    );
  }
}

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let org = user ? user.org : false;
  const clientTZ = moment.tz.guess();
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const sub = login ? Meteor.subscribe('shaddowData', clientTZ) : false;
  if(!login || !active) {
    return {
      appReady: false,
      readyUsers: false,
      ready: false
    };
  }else{
    return {
      login: Meteor.userId(),
      sub: sub,
      appReady: appSub.ready(),
      readyUsers: usersSub.ready(),
      ready: sub.ready(),
      username: name,
      user: user,
      org: org,
      app: AppDB.findOne({org: org}),
      //group: GroupDB.find().fetch(),
      //widget: WidgetDB.find().fetch(),
      batch: BatchDB.find({},{sort: {batch:-1}}).fetch(),
      batchX: XBatchDB.find().fetch(),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
    };
  }
})(View);