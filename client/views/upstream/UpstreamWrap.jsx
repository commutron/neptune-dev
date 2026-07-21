import React from 'react';
import Pref from '/public/pref.js';

import StreamLayout from '/client/layouts/StreamLayout';

import UpstreamView from '/client/views/upstream/UpstreamTask/UpstreamView';
import CompSearchData from '/client/views/upstream/CompSearch/CompSearchData';
import CompValuesSlide from '/client/views/upstream/CompValues/CompValuesSlide';
import EmailRec from '/client/views/upstream/EmailRec';
import ReportShort from '/client/views/upstream/ReportShort';
import DocsReadySlide from '/client/views/upstream/DocsReadySlide';

const UpstreamWrap = ({ 
  view,
  batchX, traceDT,
  user, isAuth, app, users, brancheS,
  isDebug
})=> {
  
  if( view === 'parts' && app.partsGlobal ) {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Parts Search'
        subLink={view}
        navBar='up'
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
        navBar='up'
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
        navBar='up'
        isAuth={isAuth}
      >
        <CompValuesSlide
          user={user}
          org={user.org}
          app={app} />
      </StreamLayout>
    );
  }
  
  if(view === 'docs') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Instruction Docs'
        subLink={view}
        navBar='up'
      >
        <DocsReadySlide
          traceDT={traceDT}
          app={app} 
        />
      </StreamLayout>
    );
  }
  
  if(view === 'emailrec' && (isAuth || Roles.userIsInRole(Meteor.userId(), 'admin'))) {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='PCB Emails'
        subLink={view}
        navBar='up'
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
      navBar='up'
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