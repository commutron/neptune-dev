import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout.jsx';

import DownstreamView from '/client/views/downstream/DownstreamTask/DownstreamView';

const DownstreamWrap = ({ 
  view, subLink,
  batch, batchX, 
  bCache, pCache, acCache, brCache,
  user, app, clientTZ,
  isDebug, isNightly
})=> {

  if(view === 'parts') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title=''
        subLink={view}
        invertColor={true}
        action={false}
      >
       <div>otherthing</div>
      </StreamLayout>
    );
  }
  
  return (
    <StreamLayout
      user={user}
      app={app}
      title={Pref.downstream}
      subLink={false}
      invertColor={false}
      beta={true}
    >
      <DownstreamView
        batch={batch}
        batchX={batchX}
        bCache={bCache}
        pCache={pCache}
        acCache={acCache}
        brCache={brCache}
        user={user}
        app={app}
        clientTZ={clientTZ}
        isDebug={isDebug}
        isNightly={isNightly}
      />
    </StreamLayout>
  );
	
};

export default DownstreamWrap;