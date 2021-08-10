import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorCatch from '/client/layouts/ErrorCatch';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import { localeUpdate } from '/client/utility/WorkTimeCalc';

import { SpinWrap } from '/client/components/tinyUi/Spin';
import DownstreamWrap from './DownstreamWrap';

const View = ({
  login, readyT, view,
  user, app, isDebug,
  traceDT, dayTime, dayIFin
})=> {
  
  useLayoutEffect( ()=>{
    InboxToastPop(user);
  }, [user]);
    
  if( !readyT || !app ) {
    return( <SpinWrap /> );
  }
  
  localeUpdate(app);

  return(
    <ErrorCatch>
      <DownstreamWrap 
        view={view}
        traceDT={traceDT}
        dayTime={dayTime}
        dayIFin={dayIFin}
        user={user}
        app={app}
        isDebug={isDebug}
      />
    </ErrorCatch>
  );
};


export default withTracker( ({ view } ) => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  let org = user ? user.org : false;
  const subT = login ? Meteor.subscribe('traceDataOpen') : false;
  
  if(!login || !active) {
    return {
      readyT: false
    };
  }else{
    return {
      login: Meteor.userId(),
      readyT: subT.ready(),
      view: view,
      user: user,
      isDebug: isDebug,
      app: AppDB.findOne({org: org}),
      traceDT: TraceDB.find({}).fetch(),
      dayTime: CacheDB.findOne({ dataName: 'avgDayTime' }),
      dayIFin: CacheDB.findOne({ dataName: 'avgDayItemFin' })
    };
  }
})(View);