import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
// import Pref from '/client/global/pref.js';

import EquipWrap from './EquipWrap';
import Spin from '/client/components/tinyUi/Spin';

const EquipData = ({
  coldReady, // sub
  equipData, maintainData,
  app, users, isDebug, brancheS, specify 
})=> {

  if( !coldReady || !users ) {
    return(
      <div className='centre wide'>
        <Spin />
      </div>
    );
  }
  
  return(
    <EquipWrap
      equipData={equipData}
      maintainData={maintainData}
      app={app}
      users={users}
      isDebug={isDebug}
      brancheS={brancheS}
      specify={specify} 
    />
  );
};

export default withTracker( ({ app, users, brancheS, specify, isDebug }) => {
  const coldSub = Meteor.subscribe('thinEquip');

  return {
    coldReady: coldSub.ready(),
    app: app,
    users: users,
    isDebug: isDebug,
    brancheS: brancheS,
    equipData: EquipDB.find( {}, { sort: { alias: -1 } } ).fetch(),
    maintainData: MaintainDB.find( {}, { sort: { name: -1 } } ).fetch(),
    specify: specify
  };
})(EquipData);