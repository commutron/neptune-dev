import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import moment from 'moment';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import { SpinWrap } from '../../components/tinyUi/Spin.jsx';
import OverviewWrap from './OverviewWrap.jsx';

const View = ({
  login,
  readyUsers, ready, readyT,
  username, user, org, app,
  isDebug, isNightly,
  batch, batchX, traceDT
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if( !readyUsers || !ready || !readyT || !app ) {
    return( <SpinWrap /> );
  }
  
  if( Array.isArray(app.nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: app.nonWorkDays
    });
  }
    
  const branches = app.branches.filter( b => b.open === true );
  const brancheS = branches.sort((b1, b2)=>
           b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );  

  return(
    <ErrorCatch>
      <OverviewWrap 
        b={batch}
        bx={batchX}
        traceDT={traceDT}
        user={user}
        app={app}
        brancheS={brancheS}
        isDebug={isDebug}
        isNightly={isNightly} />
    </ErrorCatch>
  );
};


export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const isNightly = user ? Roles.userIsInRole(Meteor.userId(), 'nightly') : false;
  let org = user ? user.org : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const sub = login ? Meteor.subscribe('shaddowData') : false;
  const subT = login ? Meteor.subscribe('traceDataActive') : false;
  
  if(!login || !active) {
    return {
      readyUsers: false,
      ready: false
    };
  }else{
    return {
      login: Meteor.userId(),
      readyUsers: usersSub.ready(),
      ready: sub.ready(),
      readyT: subT.ready(),
      username: name,
      user: user,
      isDebug: isDebug,
      isNightly: isNightly,
      org: org,
      app: AppDB.findOne({org: org}),
      batch: BatchDB.find({live: true}).fetch(),
      batchX: XBatchDB.find({live: true}).fetch(),
      traceDT: TraceDB.find({}).fetch(),
    };
  }
})(View);