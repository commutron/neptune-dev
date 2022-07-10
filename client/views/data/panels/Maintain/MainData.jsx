import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
// import Pref from '/client/global/pref.js';

import MainWrap from './MainWrap';
import Spin from '/client/components/tinyUi/Spin';

const MaintainData = ({
  coldReady, // sub
  equipData, maintainData,
  app, users, brancheS, specify 
})=> {

  if( !coldReady || !users ) {
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
      app={app}
      users={users}
      brancheS={brancheS}
      specify={specify} 
    />
  );
};

export default withTracker( ({ app, users, brancheS, specify }) => {
  const coldSub = Meteor.subscribe('thinEquip');

  return {
    coldReady: coldSub.ready(),
    app: app,
    users: users,
    brancheS: brancheS,
    equipData: EquipDB.find( {}, { sort: { alias: -1 } } ).fetch(),
    maintainData: MaintainDB.find( {}, { sort: { burden: -1 } } ).fetch(),
    specify: specify
  };
})(MaintainData);