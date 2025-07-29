import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';

import KioskElements from '/client/views/kiosk/KioskElements';

const KioskScopeData = ({
  kactionState, klisten, bScope,
  
  gem, user, users, app,
  hotReady, hotxBatch, hotxSeries,
  // hotGroup, hotWidget,
  hotVariant
})=> {
  
  return(
    <KioskElements
      kactionState={kactionState}
      klisten={klisten}
      bScope={bScope}
      
      gem={gem}
      user={user}
      
      app={app}
      
      hotReady={hotReady}
      hotxBatch={hotxBatch}
      hotxSeries={hotxSeries}
      // hotGroup={hotGroup}
      // hotWidget={hotWidget}
      hotVariant={hotVariant}
    />
  );
};


export default withTracker( ({ kactionState, bScope }) => {

  const orb = Session.get('now');
  const gem = Pref.regexSN.test(orb) ? orb : null;

  
  let subSerial = false;
  let subBatch = false;
    
  if( !subSerial && !subBatch ) {  
  
    if(kactionState === 'info') {
      if(gem) {
        subSerial = gem;
      }
      
    }else if(kactionState === 'serial') {
      subBatch = bScope;
      
    }else{
      null;
    }
    
    // const localSeries = XSeriesDB.findOne( { 'items.serial': orb } );
    // if( localSeries ) {
    //   subBatch = localSeries.batch;
    // }else{
    //   subSerial = orb;
    // }
  }

  const hotSub = Meteor.subscribe('hotDataKiosk', subSerial, subBatch);
  
  return {
    hotReady: hotSub.ready(),
    orb: orb,
    gem: gem,

    // hotGroup: GroupDB.findOne({}),
    // hotWidget: WidgetDB.findOne({}),
    hotVariant: VariantDB.findOne({}),
    hotxBatch: XBatchDB.findOne({}),
    hotxSeries: XSeriesDB.findOne({}),
    // hotxRapids: XRapidsDB.find({}).fetch()
  };
})(KioskScopeData);