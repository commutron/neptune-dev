import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment-timezone';
import InboxToastPop from '/client/components/utilities/InboxToastPop.js';
import usePrevious from '/client/components/utilities/usePreviousHook.js';

import Spin from '../../components/uUi/Spin.jsx';
import AgendaWrap from './AgendaWrap.jsx';

const View = ({
  login, sub, appReady, readyUsers, ready, 
  username, user, clientTZ, org, app, 
  bCache, pCache, cCache, zCache
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if( !appReady || !readyUsers || !ready || !app ) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }

  return(
    <AgendaWrap 
      bCache={bCache}
      pCache={pCache}
      cCache={cCache}
      zCache={zCache}
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
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const sub = login ? Meteor.subscribe('cacheData', clientTZ) : false;
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
      clientTZ: clientTZ,
      app: AppDB.findOne({org: org}),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      cCache: CacheDB.findOne({dataName: 'phaseCondition'}),
      zCache: CacheDB.findOne({dataName: 'completeBatch'}),
    };
  }
})(View);