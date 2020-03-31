import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import InboxToastPop from '/client/components/utilities/InboxToastPop.js';
import usePrevious from '/client/components/utilities/usePreviousHook.js';

import Spin from '/client/components/uUi/Spin.jsx';
import CompSearchWrap from './CompSearchWrap.jsx';

const View = ({
  login, sub, ready, 
  username, user, org, app,
  plCache
})=> {
  
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if( !ready || !app ) {
    return (
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }

  return(
    <CompSearchWrap 
      plCache={plCache ? plCache.dataSet : []}
      user={user}
      app={app} />
  );
};



export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let org = user ? user.org : false;
  const sub = login ? Meteor.subscribe('partsCacheData') : false;
  if(!login) {
    return {
      ready: false
    };
  }else{
    return {
      login: Meteor.userId(),
      sub: sub,
      ready: sub.ready(),
      username: name,
      user: user,
      org: org,
      app: AppDB.findOne({org: org}),
      plCache: CacheDB.findOne({dataName: 'partslist'})
    };
  }
})(View);