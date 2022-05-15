import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { localeUpdate } from '/client/utility/WorkTimeCalc';

import InboxToastPop from '/client/utility/InboxToastPop.js';
import { branchesOpenSort } from '/client/utility/Arrays.js';

import { PlainFrame } from '/client/layouts/MainLayouts';
import Spin from '../../components/tinyUi/Spin';
import OverviewWrap from './OverviewWrap';

const View = ({
  login, ready, readyT,
  user, app, isDebug,
  batchX, traceDT
})=> {
  
  useLayoutEffect( ()=>{
    InboxToastPop(user);
  }, [user]);
  
    
  if( !ready || !readyT || !app ) {
    return(
      <PlainFrame title='Overview' tag='WIP'>
        <div className='centre wide'>
          <Spin />
        </div>
      </PlainFrame>
    );
  }
  
  localeUpdate(app);
  
  const brancheS = branchesOpenSort(app.branches);
  
  return(
    <PlainFrame title='Overview' tag='WIP' container='overviewContainer'>
      <OverviewWrap 
        bx={batchX}
        traceDT={traceDT}
        user={user}
        app={app}
        brancheS={brancheS}
        isDebug={isDebug} />
    </PlainFrame>
  );
};


export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  const active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;
  const org = user ? user.org : false;
  const sub = login ? Meteor.subscribe('shaddowData') : false;
  const subT = login ? Meteor.subscribe('traceDataActive') : false;
  
  if(!login || !active) {
    return {
      ready: false
    };
  }else{
    return {
      login: Meteor.userId(),
      ready: sub.ready(),
      readyT: subT.ready(),
      user: user,
      isDebug: isDebug,
      app: AppDB.findOne({org: org}),
      batchX: XBatchDB.find({}).fetch(),
      traceDT: TraceDB.find({}).fetch(),
    };
  }
})(View);