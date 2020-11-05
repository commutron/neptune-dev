import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout.jsx';

import UpstreamView from '/client/views/upstream/UpstreamTask/UpstreamView';
import CompSearchData from '/client/views/upstream/CompSearch/CompSearchData';
import CompValuesSlide from '/client/views/upstream/CompValues/CompValuesSlide';
import ReportShort from '/client/views/upstream/ReportShort';

const UpstreamWrap = ({ 
  view, subLink,
  batch, batchX, 
  bCache, pCache, acCache,
  user, app, clientTZ,
  isDebug, isNightly
})=> {

  if(view === 'parts') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Parts Search'
        subLink={view}
        invertColor={true}
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
        invertColor={true}
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
        invertColor={true}
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
      invertColor={false}
      tag='kit'
    >
      <UpstreamView
        batch={batch}
        batchX={batchX}
        bCache={bCache}
        pCache={pCache}
        acCache={acCache}
        user={user}
        app={app}
        clientTZ={clientTZ}
        isDebug={isDebug}
        isNightly={isNightly}
      />
    </StreamLayout>
  );
	
};

export default UpstreamWrap;