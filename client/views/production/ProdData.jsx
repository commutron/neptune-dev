import React, { useEffect, useLayoutEffect} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
//import Pref from '/client/global/pref.js';

import { ScanListenerUtility } from '/client/components/utilities/ScanListener.js';
import { ScanListenerOff } from '/client/components/utilities/ScanListener.js';
import InboxToastPop from '/client/components/utilities/InboxToastPop.js';
import usePrevious from '/client/components/utilities/usePreviousHook.js';

import Spin from '/client/components/uUi/Spin.jsx';
import ProductionFindOps from './ProductionFindOps.jsx';

const ProdData = ({
  usersReady, coldReady, hotReady, // subs
  orb, anchor, user, org, users, app, // self 
  allGroup, allWidget, allBatch, allxBatch,  // customer data
  hotBatch, hotxBatch // working data
})=> {

  const prevUser = usePrevious(user);
  useLayoutEffect( ()=>{
    InboxToastPop(prevUser, user);
  }, [user]);
  
  useEffect( ()=> {
    if(user) {
      ScanListenerUtility(user);
    }
    return ScanListenerOff();
  }, []);
  

  if(
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
  
  const activeUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') === true &&
                                         Roles.userIsInRole(x._id, 'readOnly') === false);
    
  return (
    <ProductionFindOps
      orb={orb}
      anchor={anchor}
      user={user}
      org={org}
      activeUsers={activeUsers}
      app={app}
      allGroup={allGroup}
      allWidget={allWidget}
      allBatch={allBatch}
      allxBatch={allxBatch}
      hotBatch={hotBatch}
      hotxBatch={hotxBatch}
    />
  );
};


export default withTracker( () => {
  
  const orb = Session.get('now');
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let readOnly = user ? Roles.userIsInRole(Meteor.userId(), 'readOnly') : false;
  const usersSub = login ? Meteor.subscribe('usersData') : false;
  const coldSub = login ? Meteor.subscribe('thinData') : false;

  let hotSub = Meteor.subscribe('hotDataPlus', false);
  let hotBatch = false;
  let hotxBatch = false;
  
  if( coldSub ) {
    
    if( !isNaN(orb) && orb.length === 5 ) {
      const oneBatch = BatchDB.findOne( { batch: orb } );
      const onexBatch = XBatchDB.findOne( { batch: orb } );
      
      if( oneBatch ) {
        hotSub = Meteor.subscribe( 'hotDataPlus', orb );
        hotBatch = oneBatch;
      
      }else if(onexBatch) {
        hotSub = Meteor.subscribe( 'hotDataPlus', orb );
        hotxBatch = onexBatch;
      
      }else{
        null;
      }
    }
    else if( !isNaN(orb) && orb.length >= 8 && orb.length <= 10 ) {
      
  		const itemsBatch = BatchDB.findOne( { 'items.serial': orb } );
      
      if( itemsBatch ) {
        hotSub = Meteor.subscribe( 'hotDataPlus', itemsBatch.batch );
        hotBatch = itemsBatch;
      
      }else{
        Meteor.call( 'serialLookup', orb, ( err, reply )=>{
          err && console.log(err);
          const serverItemsBatch = BatchDB.findOne( { batch: reply } );
          hotSub = Meteor.subscribe( 'hotDataPlus', reply );
          hotBatch = serverItemsBatch;
        });
      }
    
    }else{
      null;
    }
  
  }else{
    null;
  }
  
  if( !login ) {
    return {
      usersReady: false,
      coldReady: false,
      hotReady: false
    };
  }else if( readOnly ) {
    FlowRouter.go('/');
    return {
      usersReady: usersSub.ready(),
      coldReady: coldSub.ready(), 
      hotReady: hotSub.ready(),
    };
  }else{
    return {
      usersReady: usersSub.ready(),
      coldReady: coldSub.ready(),
      hotReady: hotSub.ready(),
      orb: orb,
      anchor: Session.get( 'nowWanchor' ),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      app: AppDB.findOne({org: org}),
      allGroup: GroupDB.find( {}, { sort: { group: 1 } } ).fetch(),
      allWidget: WidgetDB.find( {}, { sort: { widget: 1 } } ).fetch(),
      allBatch: BatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      allxBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotBatch: hotBatch,
      hotxBatch: hotxBatch,
    };
  }
})(ProdData);