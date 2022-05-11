import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
// import Pref from '/client/global/pref.js';

import MainWrap from './MainWrap';
import Spin from '/client/components/tinyUi/Spin';

const MaintainData = ({
  coldReady, hotReady, // subs
  equipData, maintainData,
  groupData, widgetData, variantData, batchDataX, 
  app, brancheS, specify 
})=> {

  if( !coldReady || !hotReady ) {
    return(
      <div className='centre wide'>
        <Spin />
      </div>
    );
  }
  
  return(
    <MainWrap
      equipData={equipData}
      maintainData={maintainData}
      groupData={groupData}
      widgetData={widgetData}
      variantData={variantData}
      batchDataX={batchDataX}
      app={app}
      brancheS={brancheS}
      specify={specify} 
    />
  );
};

export default withTracker( ({ groupData, widgetData, variantData, batchDataX, app, brancheS, specify }) => {
  const coldSub = Meteor.subscribe('thinEquip');
  const hotSub = Meteor.subscribe('hotEquip', specify);

  return {
    coldReady: coldSub.ready(),
    hotReady: hotSub.ready(),
    
    groupData: groupData, 
    widgetData: widgetData, 
    variantData: variantData,
    batchDataX: batchDataX,
    app: app,
    brancheS: brancheS,
    
    equipData: EquipDB.find( {}, { sort: { alias: -1 } } ).fetch(),
    maintainData: MaintainDB.find( {}, { sort: { burden: -1 } } ).fetch(),
    
    specify: specify
  };
})(MaintainData);