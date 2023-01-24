import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';

import { SpinWrap } from '/client/components/tinyUi/Spin';
import TerminalFindOps from './TerminalFindOps';


const TerminalData = ({
  coldReady, hotReady,
  orb, anchor, user, org, users, app,
  allGroup, allWidget, allVariant,
  allxBatch,
  hotxBatch, hotxSeries, hotxRapids
})=> {
  

  if( !coldReady || !hotReady || !user || !app ) {
    return( <SpinWrap /> );
  }
  
  const activeUsers = users.filter( x => 
                        Roles.userIsInRole(x._id, 'active') === true &&
                        Roles.userIsInRole(x._id, 'readOnly') === false);
    
  return (
    <TerminalFindOps
      orb={orb}
      anchor={anchor}
      user={user}
      org={org}
      activeUsers={activeUsers}
      app={app}
      allGroup={allGroup}
      allWidget={allWidget}
      allVariant={allVariant}
      allxBatch={allxBatch}
      hotxBatch={hotxBatch}
      hotxSeries={hotxSeries}
      hotxRapids={hotxRapids}
    />
  );
};


export default withTracker( () => {

  const orb = Session.get('now');
  
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let readOnly = user ? Roles.userIsInRole(Meteor.userId(), 'readOnly') : false;
  const coldSub = login ? Meteor.subscribe('thinData') : false;
  
  let hotxBatch = false;
  let hotxSeries = false;
  let hotxRapids = [];
  
  let keyMatch = false;
  let subBatch = false;
    
  if( coldSub && !subBatch ) {
    
    if( Pref.regex5.test(orb) ) {

      onexBatch = XBatchDB.find({ batch: orb },{fields:{'batch':1}},{limit:1}).count();
      if(onexBatch) {
        keyMatch = true;
        subBatch = orb;
      }else{
        subBatch = orb;
      }
      hotxBatch = XBatchDB.findOne({ batch: orb });
      hotxSeries = XSeriesDB.findOne({ batch: orb });
      hotxRapids = XRapidsDB.find({ extendBatch: orb }).fetch();
      
    }else if( Pref.regexSN.test(orb) ) {
  		
      const itemsxSeries = XSeriesDB.findOne( { 'items.serial': orb } );
      if( itemsxSeries ) {
        hotxSeries = itemsxSeries;
        hotxBatch = XBatchDB.findOne( { batch: itemsxSeries.batch } );
        hotxRapids = XRapidsDB.find( { extendBatch: itemsxSeries.batch } ).fetch();
        keyMatch = true;
        subBatch = itemsxSeries.batch;
      }else{
        subBatch = orb;
      }
    }else{
      null;
    }
  }

  const hotSub = Meteor.subscribe('hotDataPlus', subBatch, keyMatch);
  
  if( !login ) {
    return {
      coldReady: false,
      hotReady: false
    };
  }else if( readOnly ) {
    FlowRouter.go('/');
    return {
      coldReady: coldSub.ready(), 
      hotReady: hotSub.ready(),
    };
  }else{
    return {
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
      allVariant: VariantDB.find( {} ).fetch(),
      allxBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotxBatch: hotxBatch,
      hotxSeries: hotxSeries,
      hotxRapids: hotxRapids
    };
  }
})(TerminalData);