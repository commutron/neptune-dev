import React, { useMemo } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { localeUpdate } from '/client/utility/WorkTimeCalc';
import { branchesSort } from '/client/utility/Arrays.js';

import EquipLayout from '/client/layouts/EquipLayout';
import { PlainFrame } from '/client/layouts/MainLayouts';
import Spin from '/client/components/tinyUi/Spin';

const EquipData = ({
  coldReady, // sub
  equipData, maintainData,
  user, app, users, isDebug, specify 
})=> {
  
  const brancheS = useMemo( ()=> branchesSort(app?.branches || []), [app]);
  const isRO = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), 'readOnly'), [user]);
  const liveUsers = useMemo( ()=> (users || []).filter( x => x.roles.includes('active') && 
                                                            !x.roles.includes('readOnly') ), [users]);
  
  if( !coldReady || !users || !liveUsers || !app ) {
    return(
      <PlainFrame title=''>
        <div className='centre wide'>
          <Spin />
        </div>
      </PlainFrame>
    );
  }
  
  localeUpdate(app);
  
  return(
    <EquipLayout
      equipData={equipData}
      maintainData={maintainData}
      app={app}
      users={users}
      liveUsers={liveUsers}
      isRO={isRO}
      isDebug={isDebug}
      brancheS={brancheS}
      specify={specify} 
    />
  );
};

export default withTracker( ({ specify }) => {
  let login = Meteor.userId() ? true : false;
  
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  
  const coldSub = Meteor.subscribe('thinEquip');
  
  if( !login || !active ) {
    return {
      coldReady: false
    };
  }else{
    return {
      coldReady: coldSub.ready(),
      user: user,
      app: AppDB.findOne({org: org}),
      users: Meteor.users.find( {}, { collation: { locale: 'en', strength: 2 },sort: { username: 1 } } ).fetch(),
      isDebug: isDebug,
      equipData: EquipDB.find( {}, { sort: { alias: -1 } } ).fetch(),
      maintainData: MaintainDB.find( {}, { sort: { name: -1 } } ).fetch(),
      specify: specify
    };
  }
})(EquipData);