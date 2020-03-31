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
  login, sub, readyUsers, ready, 
  username, user, clientTZ, org, app,
  isNightly,
  bCache, pCache, agCache, phCache, zCache
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if( !readyUsers || !ready || !app ) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }

  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isSales = Roles.userIsInRole(Meteor.userId(), 'sales');
  const isPeople = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const isPreview = isAdmin || isNightly || isSales || isPeople;
  
  if(isPreview) {
    return(
      <AgendaWrap 
        bCache={bCache}
        pCache={pCache}
        agCache={agCache}
        phCache={phCache}
        zCache={zCache}
        user={user}
        app={app}
        clientTZ={clientTZ}
        isNightly={isNightly} />
    );
  }
  
  return(
    <div className='centre middle'>
      <p className='medBig centreText'>This ALPHA page is limited to early access users only</p>
      <button
        className='smallAction clear whiteT'
        onClick={()=> window.history.back()}
      ><i className='fas fa-arrow-circle-left fa-lg'></i> Go Back</button>
    </div>
  );
};



export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isNightly = user ? Roles.userIsInRole(Meteor.userId(), 'nightly') : false;
  let org = user ? user.org : false;
  const clientTZ = moment.tz.guess();
  // const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const sub = login ? Meteor.subscribe('cacheData', clientTZ) : false;
  if(!login || !active) {
    return {
      // appReady: false,
      readyUsers: false,
      ready: false
    };
  }else{
    return {
      login: Meteor.userId(),
      sub: sub,
      // appReady: appSub.ready(),
      readyUsers: usersSub.ready(),
      ready: sub.ready(),
      username: name,
      user: user,
      org: org,
      clientTZ: clientTZ,
      isNightly: isNightly,
      app: AppDB.findOne({org: org}),
      bCache: CacheDB.findOne({dataName: 'batchInfo'}),
      pCache: CacheDB.findOne({dataName: 'priorityRank'}),
      agCache: CacheDB.findOne({dataName: 'agendaOrder'}),
      phCache: CacheDB.findOne({dataName: 'phaseCondition'}),
      zCache: CacheDB.findOne({dataName: 'completeBatch'}),
    };
  }
})(View);