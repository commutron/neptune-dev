import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import { SpinWrap } from '/client/components/tinyUi/Spin.jsx';
import DownstreamWrap from './DownstreamWrap.jsx';

const View = ({
  login,
  readyUsers, readyC, readyT, view,
  username, user, org, app,
  isDebug, isNightly,
  traceDT, pCache
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
    
  if( !readyUsers || !readyC || !readyT || !app ) {
    return( <SpinWrap /> );
  }

  return(
    <ErrorCatch>
      <DownstreamWrap 
        view={view}
        traceDT={traceDT}
        pCache={pCache}
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
  
  const subC = login ? Meteor.subscribe('cacheData') : false;
  const subT = login ? Meteor.subscribe('traceDataOpen') : false;
  
  if(!login || !active) {
    return {
      readyUsers: false,
      readyC: false,
      readyT: false
    };
  }else{
    return {
      login: Meteor.userId(),
      subC: subC,
      readyUsers: usersSub.ready(),
      readyC: subC.ready(),
      readyT: subT.ready(),
      view: view,
      username: name,
      user: user,
      isDebug: isDebug,
      isNightly: isNightly,
      org: org,
      app: AppDB.findOne({org: org}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      traceDT: TraceDB.find({}).fetch(),
    };
  }
})(View);