import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment-timezone';
import InboxToastPop from '/client/components/utilities/InboxToastPop.js';
import usePrevious from '/client/components/utilities/usePreviousHook.js';

import Spin from '../../components/uUi/Spin.jsx';
import OverviewWrap from './OverviewWrap.jsx';

const View = ({
  appReady, readyUsers, ready, // subs
  username, user, org, app, // self
  group, widget, batch, batchX, // working data
  bCache, pCache // caches
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if(!appReady || !readyUsers || !ready || !app) {
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
      //g={group}
      //w={widget}
      b={batch}
      bx={batchX}
      bCache={bCache}
      pCache={pCache}
      user={user}
      app={app} />
  );
};

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