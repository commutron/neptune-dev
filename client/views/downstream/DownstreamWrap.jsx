import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout.jsx';

import DownstreamView from '/client/views/downstream/DownstreamTask/DownstreamView';


const DownstreamWrap = ({ 
  view, subLink,
  batch, batchX, 
  bCache, pCache, acCache, brCache, zCache,
  user, app, clientTZ,
  isDebug, isNightly
})=> {

  if(view === 'overview') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Downstream Over'
        subLink={view}
        invertColor={false}
        action={false}
        navBar='down'
      >
        <div>OK</div>
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
      tag='ship'
      navBar='down'
    >
      <DownstreamView
        batch={batch}
        batchX={batchX}
        bCache={bCache}
        pCache={pCache}
        acCache={acCache}
        brCache={brCache}
        zCache={zCache}
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