import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import { SpinWrap } from '/client/components/tinyUi/Spin.jsx';
import UpstreamWrap from './UpstreamWrap.jsx';

const View = ({
  login,
  readyUsers, ready, readyC, readyT, view,
  username, user, org, app,
  isDebug, isNightly,
  batch, batchX, traceDT,
  bCache, pCache, acCache,
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if( !readyUsers || !ready || !readyC || !readyT || !app ) {
    return( <SpinWrap /> );
  }

  return(
    <ErrorCatch>
      <UpstreamWrap 
        view={view}
        batch={batch}
        batchX={batchX}
        traceDT={traceDT}
        bCache={bCache}
        pCache={pCache}
        acCache={acCache}
        user={user}
        app={app}
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
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const sub = login ? Meteor.subscribe('shaddowData') : false;
  
  const subC = login ? Meteor.subscribe('cacheData') : false;
  const subT = login ? Meteor.subscribe('traceDataLive') : false;
  
  if(!login || !active) {
    return {
      readyUsers: false,
      ready: false,
      readyC: false,
      readyT: false
    };
  }else{
    return {
      login: Meteor.userId(),
      // sub: sub,
      // subC: subC,
      // subT: subT,
      readyUsers: usersSub.ready(),
      ready: sub.ready(),
      readyC: subC.ready(),
      readyT: subT.ready(),
      view: view,
      
      username: name,
      user: user,
      isDebug: isDebug,
      isNightly: isNightly,
      org: org,
      
      app: AppDB.findOne({org: org}),
      batch: BatchDB.find({live: true}).fetch(),
      batchX: XBatchDB.find({live: true}).fetch(),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      acCache: CacheDB.findOne({dataName: 'activityLevel'}),
      brCache: CacheDB.findOne({dataName: 'branchCondition'}),
      
      traceDT: TraceDB.find({}).fetch(),
    };
  }
})(View);