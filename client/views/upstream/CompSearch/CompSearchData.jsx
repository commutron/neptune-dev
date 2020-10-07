import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

import Spin from '/client/components/tinyUi/Spin.jsx';
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

export default withTracker( ({ name, user, org, app  }) => {
  const sub = Meteor.subscribe('partsPlusCacheData');
  return {
    login: Meteor.userId(),
    sub: sub,
    ready: sub.ready(),
    username: name,
    user: user,
    org: org,
    app: app,
    plCache: CacheDB.findOne({dataName: 'partslist'})
  };
})(View);