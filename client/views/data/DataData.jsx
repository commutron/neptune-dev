import React, { useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { localeUpdate } from '/client/utility/WorkTimeCalc';

import { TraverseWrap } from '/client/layouts/DataExploreLayout';
import { branchesSort } from '/client/utility/Arrays.js';
import Spin from '../../components/tinyUi/Spin';
import DataViewOps from './DataViewOps';


const ExploreView = ({
  coldReady, hotReady, // subs
  user, isDebug, org, users, app, // self
  allGroup, allWidget, allVariant, // customers
  allXBatch, hotXBatch, hotXSeries, hotXRapids, equipData, // relevant
  view, request, specify, query, subLink // routing
})=> {
  console.log({view, request, specify, query, subLink});
  const brancheS = useMemo( ()=> branchesSort(app?.branches || []), [app]);
  
  if( !coldReady || !hotReady || !user || !app ) {
    return(
      <TraverseWrap
        batchData={false}
        widgetData={false}
        groupData={false}
        title={false}
        subLink={subLink}
        action={false}
        base={true}
      >
        <div className='centre wide'>
          <Spin />
        </div>
      </TraverseWrap>
    );
  }
  
  localeUpdate(app);

  return(
    <DataViewOps
      user={user}
      isDebug={isDebug}
      org={org}
      users={users}
      app={app}
      brancheS={brancheS}
      allGroup={allGroup}
      allWidget={allWidget}
      allVariant={allVariant}
      allXBatch={allXBatch}
      hotXBatch={hotXBatch}
      hotXSeries={hotXSeries}
      hotXRapids={hotXRapids}
      equipData={equipData}
      view={view}
      request={request}
      specify={specify}
      query={query}
      subLink={subLink}
    />
  );
};

export default withTracker( ({ view, request, specify, query }) => {
  let login = Meteor.userId() ? true : false;
  
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isDebug = false;//user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;

  const coldSub = active ? Meteor.subscribe('skinnyData') : false;
 
 // Crappy reloading on just flipping through groups
  const stableSpec = request === 'groups' ? specify : false;
  const hotSubEx = Meteor.subscribe('hotDataEx', view, request, stableSpec, query);


  if( !login || !active ) {
    return {
      coldReady: false,
      hotReady: false
    };
  }else{
    return {
      coldReady: coldSub.ready(),
      hotReady: hotSubEx.ready(),
      user: user,
      org: org,
      users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
      isDebug: isDebug,
      app: AppDB.findOne({org: org}),
      allGroup: GroupDB.find( {}, { sort: { group: 1 } } ).fetch(),
      allWidget: WidgetDB.find( {}, { sort: { widget: 1 } } ).fetch(),
      allVariant: VariantDB.find( {} ).fetch(),
      allXBatch: XBatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
      hotXBatch: XBatchDB.findOne({ batch: request }) || false,
      hotXSeries: XSeriesDB.findOne({ batch: request }) || false,
      hotXRapids: XRapidsDB.find({ extendBatch: request }).fetch() || false,
      equipData: EquipDB.find( {}, { sort: { alias: -1 } } ).fetch()
    };
  }
})(ExploreView);