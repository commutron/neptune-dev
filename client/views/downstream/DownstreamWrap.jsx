import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout.jsx';

import DownstreamView from '/client/views/downstream/DownstreamTask/DownstreamView';
import CompletedReport from './CompletedReport.jsx';


const DownstreamWrap = ({ 
  view, subLink,
  bCache, pCache, acCache, brCache, zCache,
  user, app,
  isDebug, isNightly
})=> {
  
  if(view === 'reportweek') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Completed Report'
        subLink={view}
        invertColor={true}
        action={false}
        navBar='down'
      >
        <CompletedReport
          app={app} />
      </StreamLayout>
    );
  }
  
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
        bCache={bCache}
        pCache={pCache}
        acCache={acCache}
        brCache={brCache}
        zCache={zCache}
        user={user}
        app={app}
        isDebug={isDebug}
        isNightly={isNightly}
      />
    </StreamLayout>
  );
	
};

export default DownstreamWrap;