import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout';

import UpstreamView from '/client/views/upstream/UpstreamTask/UpstreamView';
import CompSearchData from '/client/views/upstream/CompSearch/CompSearchData';
import CompValuesSlide from '/client/views/upstream/CompValues/CompValuesSlide';
import EmailRec from '/client/views/upstream/EmailRec';
import ReportShort from '/client/views/upstream/ReportShort';

const UpstreamWrap = ({ 
  view,
  batchX, traceDT,
  user, app, users, brancheS,
  isDebug
})=> {
  
  const isAuth = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  
  if( view === 'parts' && app.partsGlobal) {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Parts Search'
        subLink={view}
        action={false}
        isAuth={isAuth}
      >
        <CompSearchData
          name={user.username} 
          user={user}
          org={user.org}
          app={app} />
      </StreamLayout>
    );
  }
  
  if(view === 'shortfalls') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title={Pref.shortfalls}
        subLink={view}
        action={false}
        isAuth={isAuth}
      >
        <ReportShort
          user={user}
          app={app}
        />
      </StreamLayout>
    );
  }
  
  if(view === 'values') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Value Conversion'
        subLink={view}
        action={false}
        isAuth={isAuth}
      >
        <CompValuesSlide
          user={user}
          org={user.org}
          app={app} />
      </StreamLayout>
    );
  }
  
  if(view === 'emailrec' && (isAuth || Roles.userIsInRole(Meteor.userId(), 'admin')) ) {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='PCB Emails'
        subLink={view}
        action={false}
        isAuth={isAuth}
      >
        <EmailRec
          app={app}
          users={users}
        />
      </StreamLayout>
    );
  }
  
  return (
    <StreamLayout
      user={user}
      app={app}
      title={Pref.upstream}
      subLink={false}
      tag='kit'
      isAuth={isAuth}
    >
      <UpstreamView
        batchX={batchX}
        traceDT={traceDT}
        user={user}
        app={app}
        brancheS={brancheS}
        isAuth={isAuth}
        isDebug={isDebug}
      />
    </StreamLayout>
  );
	
};

export default UpstreamWrap;