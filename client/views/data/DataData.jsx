import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import moment from 'moment';
import 'moment-timezone';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import usePrevious from '/client/utility/usePreviousHook.js';

//import Pref from '/client/global/pref.js';
import { TraverseWrap } from '/client/layouts/DataExploreLayout.jsx';
import Spin from '../../components/tinyUi/Spin.jsx';
import DataViewOps from './DataViewOps.jsx';

const ExploreView = ({
  usersReady, coldReady, hotReady, // subs
  user, isDebug, org, users, app, // self
  allGroup, allWidget, allVariant, // customers
  allBatch, allXBatch, 
  hotBatch, hotXBatch, // relevant
  view, request, specify, subLink // routing
})=> {
  
  const prevRequest = usePrevious(request);
  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    if(prevRequest !== request) {
      Session.set('itemListScrollPos', {b: false, num: 0});
    }
    InboxToastPop(prevUser, user);
  }, [user]);
  
    
  if(
    !usersReady ||
    !coldReady || 
    !hotReady ||
    !user ||
    !app 
  ) {
    return(
      <ErrorCatch>
        <TraverseWrap
          batchData={false}
          widgetData={false}
          groupData={false}
          user={false}
          app={false}
          title={false}
          subLink={subLink}
          action={false}
          base={true}
          invertColor={true}
        >
          <div className='centre wide'>
            <Spin />
          </div>
        </TraverseWrap>
      </ErrorCatch>
    );
  }
    
  return(
    <ErrorCatch>
      <DataViewOps
        user={user}
        isDebug={isDebug}
        org={org}
        users={users}
        app={app}
        allGroup={allGroup}
        allWidget={allWidget}
        allVariant={allVariant}
        allBatch={allBatch}
        allXBatch={allXBatch}
        hotBatch={hotBatch}
        hotXBatch={hotXBatch}
        view={view}
        request={request}
        specify={specify}
        subLink={subLink}
      />
    </ErrorCatch>
  );
};

export default withTracker( ({ view, request, specify }) => {
  //const orb = Session.get('now');
  let login = Meteor.userId() ? true : false;
  
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const clientTZ = moment.tz.guess();
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const coldSub = login ? Meteor.subscribe('skinnyData', clientTZ) : false;
  
  const hotBatch = BatchDB.findOne({ batch: request }) || false;
  const hotXBatch = XBatchDB.findOne({ batch: request }) || false;
  const hotWidget = view === 'widget' ? request : false;
  
  const hotSubEx = Meteor.subscribe('hotDataEx', request, hotWidget);

  if( !login || !active ) {
    return {
      usersReady: false,
      coldReady: false,
      hotReady: false
    };
  }else{
    return {
      usersReady: usersSub.ready(),
      coldReady: coldSub.ready(),
      hotReady: hotSubEx.ready(),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      isDebug: isDebug,
      app: AppDB.findOne({org: org}),
      allGroup: GroupDB.find( {}, { sort: { group: 1 } } ).fetch(),
      allWidget: WidgetDB.find( {}, { sort: { widget: 1 } } ).fetch(),
      allVariant: VariantDB.find( {} ).fetch(),
      allBatch: BatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      allXBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotBatch: hotBatch,
      hotXBatch: hotXBatch,
      view: view,
      request: request,
      specify: specify
    };
  }
})(ExploreView);