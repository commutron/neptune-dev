import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout.jsx';

import UpstreamView from '/client/views/upstream/UpstreamTask/UpstreamView';
import CompSearchData from '/client/views/upstream/CompSearch/CompSearchData';
import CompValuesSlide from '/client/views/upstream/CompValues/CompValuesSlide';
import ReportShort from '/client/views/upstream/ReportShort';

const UpstreamWrap = ({ 
  view, subLink,
  batch, batchX, traceDT,
  user, app, brancheS,
  isDebug
})=> {

  if(view === 'parts') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Parts Search'
        subLink={view}
        action={false}
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
      >
        <CompValuesSlide
          user={user}
          org={user.org}
          app={app} />
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
    >
      <UpstreamView
        batch={batch}
        batchX={batchX}
        traceDT={traceDT}
        user={user}
        app={app}
        brancheS={brancheS}
        isDebug={isDebug}
      />
    </StreamLayout>
  );
	
};

export default UpstreamWrap;