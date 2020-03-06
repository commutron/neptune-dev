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
  login,
  readyUsers, ready, readyC, 
  username, user, clientTZ, org, app, 
  batch, batchX,
  bCache, pCache, acCache, phCache
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if( !readyUsers || !ready || !readyC || !app ) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }

  return(
    <OverviewWrap 
      b={batch}
      bx={batchX}
      bCache={bCache}
      pCache={pCache}
      acCache={acCache}
      phCache={phCache}
      user={user}
      app={app}
      clientTZ={clientTZ} />
  );
};



export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let org = user ? user.org : false;
  const clientTZ = moment.tz.guess();
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const sub = login ? Meteor.subscribe('shaddowData', clientTZ) : false;
  const subC = login ? Meteor.subscribe('cacheData', clientTZ) : false;
  if(!login || !active) {
    return {
      readyUsers: false,
      ready: false
    };
  }else{
    return {
      login: Meteor.userId(),
      sub: sub,
      subC: subC,
      readyUsers: usersSub.ready(),
      ready: sub.ready(),
      readyC: subC.ready(),
      username: name,
      user: user,
      org: org,
      clientTZ: clientTZ,
      app: AppDB.findOne({org: org}),
      batch: BatchDB.find({live: true}).fetch(),
      batchX: XBatchDB.find({live: true}).fetch(),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      acCache: CacheDB.findOne({dataName: 'activityLevel'}),
      phCache: CacheDB.findOne({dataName: 'phaseCondition'}),
    };
  }
})(View);