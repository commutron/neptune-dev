import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';

import { SpinWrap } from '/client/components/tinyUi/Spin';

import TerminalWrap from '/client/layouts/TerminalLayout';

const TerminalData = ({
  orb, user, users, app,
  hotReady, hotxBatch, hotxSeries, hotxRapids
})=> {

  if( !user || !app ) {
    return( <SpinWrap /> );
  }
  
  const activeUsers = users.filter( x => 
                        Roles.userIsInRole(x._id, 'active') === true &&
                        Roles.userIsInRole(x._id, 'readOnly') === false);
  
  return(
    <TerminalWrap
      orb={orb}
      user={user}
      users={activeUsers}
      app={app}
      hotReady={hotReady}
      hotxBatch={hotxBatch}
      hotxSeries={hotxSeries}
    />
  );
};


export default withTracker( () => {

  const orb = Session.get('now');
  
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  
  let hotxBatch = false;
  let hotxSeries = false;
  let hotxRapids = [];
  
  let keyMatch = false;
  let subBatch = false;
    
  if( !subBatch ) {
    
    if( Pref.regexSN.test(orb) ) {
  		
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
      hotReady: false
    };
  }else{
    return {
      hotReady: hotSub.ready(),
      orb: orb,
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