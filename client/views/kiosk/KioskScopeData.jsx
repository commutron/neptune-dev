import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';

import KioskElements from '/client/views/kiosk/KioskElements';

const KioskScopeData = ({
  kactionState, klisten, bScope,
  
  orb, user, users, app,
  hotReady, hotxBatch, hotxSeries, hotxRapids,
  hotGroup, hotWidget, hotVariant
})=> {
  
  console.log({bScope});
  
  return(
    <KioskElements
      kactionState={kactionState}
      klisten={klisten}
      bScope={bScope}
      
      
      orb={orb}
      user={user}
      
      app={app}
      
      hotReady={hotReady}
      hotxBatch={hotxBatch}
      hotxSeries={hotxSeries}
      hotGroup={hotGroup}
      hotWidget={hotWidget}
      hotVariant={hotVariant}
    />
  );
};


export default withTracker( ({ bScope }) => {

  const orb = Session.get('now');
  
  let login = Meteor.userId() ? true : false;
  // let user = login ? Meteor.user() : false;
  // let org = user ? user.org : false;
  
  // let onhandBatch = false;
  // let onhandSeries = false;
  // let hotxRapids = [];
  
  let subSerial = false;
  let subBatch = bScope;
    
    console.log({subBatch});
    
  if( !subSerial && !subBatch ) {
    
    if( Pref.regexSN.test(orb) ) {
  		
      const localSeries = XSeriesDB.findOne( { 'items.serial': orb } );
      if( localSeries ) {
        // onhandSeries = localSeries;
        // onhandBatch = XBatchDB.findOne( { batch: localSeries.batch } );
        // hotxRapids = XRapidsDB.find( { extendBatch: localSeries.batch } ).fetch();
        subBatch = localSeries.batch;
      }else{
        subSerial = orb;
      }
    }else{
      null;
    }
  }

  const hotSub = Meteor.subscribe('hotDataKiosk', subSerial, subBatch);
  
  if( !login ) {
    return {
      hotReady: false
    };
  }else{
    return {
      hotReady: hotSub.ready(),
      orb: orb,
      // user: user,
      // org: org,
      // users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      // app: AppDB.findOne({org: org}),

      hotGroup: GroupDB.findOne({}),
      hotWidget: WidgetDB.findOne({}),
      hotVariant: VariantDB.findOne({}),
      hotxBatch: XBatchDB.findOne({}),
      hotxSeries: XSeriesDB.findOne({}),
      // hotxRapids: hotxRapids
    };
  }
})(KioskScopeData);