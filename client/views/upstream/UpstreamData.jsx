import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import { SpinWrap } from '/client/components/tinyUi/Spin.jsx';
import UpstreamWrap from './UpstreamWrap.jsx';

const View = ({
  login,
  ready, readyT, view,
  user, app,
  isDebug,
  batch, batchX, traceDT,
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if( !ready || !readyT || !app ) {
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
      <UpstreamWrap 
        view={view}
        batch={batch}
        batchX={batchX}
        traceDT={traceDT}
        user={user}
        app={app}
        brancheS={brancheS}
        isDebug={isDebug} />
    </ErrorCatch>
  );
};


export default withTracker( ({ view } ) => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  let org = user ? user.org : false;
  const sub = login ? Meteor.subscribe('shaddowData') : false;
  const subT = login ? Meteor.subscribe('traceDataLive') : false;
  
  if(!login || !active) {
    return {
      ready: false,
      readyT: false
    };
  }else{
    return {
      login: Meteor.userId(),
      ready: sub.ready(),
      readyT: subT.ready(),
      view: view,
      user: user,
      isDebug: isDebug,
      app: AppDB.findOne({org: org}),
      batch: BatchDB.find({live: true}).fetch(),
      batchX: XBatchDB.find({live: true}).fetch(),
      traceDT: TraceDB.find({}).fetch(),
    };
  }
})(View);