import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment-timezone';
import InboxToastPop from '/client/components/utilities/InboxToastPop.js';
import usePrevious from '/client/components/utilities/usePreviousHook.js';

//import Pref from '/client/global/pref.js';

import Spin from '../../components/uUi/Spin.jsx';
import DataViewOps from './DataViewOps.jsx';

const ExploreView = ({
  appReady, usersReady, coldReady, hotReady, // subs
  user, org, users, app, // self
  allGroup, allWidget, allBatch, allXBatch, // customers
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
    !appReady ||
    !usersReady ||
    !coldReady || 
    !hotReady ||
    !user ||
    !app 
  ) {
    return(
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
    
  return (
    <DataViewOps
      //orb={orb}
      user={user}
      org={org}
      users={users}
      app={app}
      allGroup={allGroup}
      allWidget={allWidget}
      allBatch={allBatch}
      allXBatch={allXBatch}
      hotBatch={hotBatch}
      hotXBatch={hotXBatch}
      view={view}
      request={request}
      specify={specify}
      subLink={subLink}
    />
  );
};

export default withTracker( (props) => {
  //const orb = Session.get('now');
  let login = Meteor.userId() ? true : false;
  
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const clientTZ = moment.tz.guess();
  const appSub = login ? Meteor.subscribe('appData') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const coldSub = login ? Meteor.subscribe('skinnyData', clientTZ) : false;
  
  const batchRequest = props.view === 'batch' ? props.request : false;
  let hotSubEx = Meteor.subscribe('hotDataEx', batchRequest);
  let hotBatch = BatchDB.findOne( { batch: batchRequest } ) || false;
  let hotXBatch = XBatchDB.findOne( { batch: batchRequest } ) || false;

  if( !login || !active ) {
    return {
      appReady: false,
      usersReady: false,
      coldReady: false,
      hotReady: false
    };
  }else{
    return {
      appReady: appSub.ready(),
      usersReady: usersSub.ready(),
      coldReady: coldSub.ready(),
      hotReady: hotSubEx.ready(),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      app: AppDB.findOne({org: org}),
      allGroup: GroupDB.find( {}, { sort: { group: 1 } } ).fetch(),
      allWidget: WidgetDB.find( {}, { sort: { widget: 1 } } ).fetch(),
      allBatch: BatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      allXBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotBatch: hotBatch,
      hotXBatch: hotXBatch,
      view: props.view,
      request: props.request,
      specify: props.specify
    };
  }
})(ExploreView);

    /*
    // Out of context serial search
    if( !isNaN(orb) && orb.length >= 8 && orb.length <= 10 ) {
  		const itemsBatch = BatchDB.findOne( { 'items.serial': orb } );
      if( itemsBatch ) {
        hotSub = Meteor.subscribe( 'hotData', itemsBatch.batch );
        hotBatch = itemsBatch;
      }else{
        Meteor.call( 'serialLookup', orb, ( err, reply )=>{
          err ? console.log( err ) : null;
          const serverItemsBatch = BatchDB.findOne( { batch: reply } );
          hotSub = Meteor.subscribe( 'hotData', reply );
          hotBatch = serverItemsBatch;
        });
      }
    }
    */