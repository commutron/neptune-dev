import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import moment from 'moment';
import 'moment-timezone';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import Spin from '/client/components/tinyUi/Spin.jsx';
import DownstreamWrap from './DownstreamWrap.jsx';

const View = ({
  login,
  readyUsers, ready, readyC, view,
  username, user, clientTZ, org, app,
  isDebug, isNightly,
  batch, batchX,
  bCache, pCache, acCache, brCache,
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
    <ErrorCatch>
      <DownstreamWrap 
        view={view}
        batch={batch}
        batchX={batchX}
        bCache={bCache}
        pCache={pCache}
        acCache={acCache}
        brCache={brCache}
        user={user}
        app={app}
        clientTZ={clientTZ}
        isDebug={isDebug}
        isNightly={isNightly} />
    </ErrorCatch>
  );
};



export default withTracker( ({ view } ) => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const isNightly = user ? Roles.userIsInRole(Meteor.userId(), 'nightly') : false;
  let org = user ? user.org : false;
  const clientTZ = moment.tz.guess();
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const sub = login ? Meteor.subscribe('shaddowData', clientTZ) : false;
  
  const subC = login ? Meteor.subscribe('cacheData', clientTZ) : false;
  
  if(!login || !active) {
    return {
      readyUsers: false,
      ready: false,
      readyC: false,
    };
  }else{
    return {
      login: Meteor.userId(),
      sub: sub,
      subC: subC,
      readyUsers: usersSub.ready(),
      ready: sub.ready(),
      readyC: subC.ready(),
      view: view,
      
      username: name,
      user: user,
      isDebug: isDebug,
      isNightly: isNightly,
      org: org,
      clientTZ: clientTZ,
      
      app: AppDB.findOne({org: org}),
      batch: BatchDB.find({live: true}).fetch(),
      batchX: XBatchDB.find({live: true}).fetch(),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      acCache: CacheDB.findOne({dataName: 'activityLevel'}),
      brCache: CacheDB.findOne({dataName: 'branchCondition'})
    };
  }
})(View);