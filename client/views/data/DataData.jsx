import React, { useLayoutEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import InboxToastPop from '/client/utility/InboxToastPop.js';
import moment from 'moment';

//import Pref from '/client/global/pref.js';
import { TraverseWrap } from '/client/layouts/DataExploreLayout.jsx';
import { branchesSort } from '/client/utility/Arrays.js';
import Spin from '../../components/tinyUi/Spin.jsx';
import DataViewOps from './DataViewOps.jsx';

const ExploreView = ({
  coldReady, hotReady, // subs
  user, isDebug, org, users, app, // self
  allGroup, allWidget, allVariant, // customers
  allXBatch, hotXBatch, hotXSeries, hotXRapids, // relevant
  view, request, specify, subLink // routing
})=> {
  
  useLayoutEffect( ()=>{
    InboxToastPop(user);
  }, [user]);
  
    
  if( !coldReady || !hotReady || !user || !app ) {
    return(
      <ErrorCatch>
        <TraverseWrap
          batchData={false}
          widgetData={false}
          groupData={false}
          user={false}
          app={false}
          title={false}
          subLink={subLink}
          action={false}
          base={true}
        >
          <div className='centre wide'>
            <Spin />
          </div>
        </TraverseWrap>
      </ErrorCatch>
    );
  }
  
  if( Array.isArray(app.nonWorkDays) ) {  
    moment.updateLocale('en', { holidays: app.nonWorkDays });
  }
  const brancheS = branchesSort(app.branches);

  return(
    <ErrorCatch>
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
        view={view}
        request={request}
        specify={specify}
        subLink={subLink}
      />
    </ErrorCatch>
  );
};

export default withTracker( ({ view, request, specify }) => {
  let login = Meteor.userId() ? true : false;
  
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  const isDebug = user ? Roles.userIsInRole(Meteor.userId(), 'debug') : false;

  const coldSub = login ? Meteor.subscribe('skinnyData') : false;
  
  const hotXBatch = XBatchDB.findOne({ batch: request }) || false;
  const hotXSeries = XSeriesDB.findOne({ batch: request }) || false;
  const hotXRapids = XRapidsDB.find({ extendBatch: request }).fetch() || false;
  const hotWidget = view === 'widget' ? request : false;
  
  const hotSubEx = Meteor.subscribe('hotDataEx', request, hotWidget);

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
      hotXBatch: hotXBatch,
      hotXSeries: hotXSeries,
      hotXRapids: hotXRapids,
      view: view,
      request: request,
      specify: specify
    };
  }
})(ExploreView);