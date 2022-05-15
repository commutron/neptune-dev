import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout';

import DownstreamView from '/client/views/downstream/DownstreamTask/DownstreamView';
import MonthlyReport from './MonthlyReport';
import WeeklyReport from './WeeklyReport';
import DailyReport from './DailyReport';
import TrendWrap from './DownTrends/TrendWrap';

const DownstreamWrap = ({ 
  view, subLink, 
  traceDT, dayTime, dayIFin,
  user, app, isDebug
})=> {
  
  if(view === 'reportweek') {
    return(
      <StreamLayout
        user={user}
        app={app}
        title='Weekly Completed'
        subLink={view}
        navBar='down'
      >
        <WeeklyReport
          app={app} />
      </StreamLayout>
    );
  }
  
  if(view === 'reportday') {
    return(
      <StreamLayout
        user={user}
        app={app}
        title='Daily Completed'
        subLink={view}
        navBar='down'
      >
        <DailyReport 
          dayIFin={dayIFin}
          app={app}
          user={user}
          isDebug={isDebug}
        />
      </StreamLayout>
    );
  }
  
  if(view === 'reportmonths') {
    return(
      <StreamLayout
        user={user}
        app={app}
        title='Monthly Completed'
        subLink={view}
        navBar='down'
      >
        <MonthlyReport 
          app={app}
          user={user}
          isDebug={isDebug}
        />
      </StreamLayout>
    );
  }
  
  if(view === 'trends') {
    return(
      <StreamLayout
        user={user}
        app={app}
        title='Trends'
        subLink={view}
        navBar='down'
      >
        <TrendWrap 
          app={app}
          isDebug={isDebug}
        />
      </StreamLayout>
    );
  }
  
  return(
    <StreamLayout
      user={user}
      app={app}
      title={Pref.downstream}
      subLink={false}
      tag='ship'
      navBar='down'
    >
      <DownstreamView
        traceDT={traceDT}
        dayTime={dayTime}
        user={user}
        app={app}
        isDebug={isDebug}
      />
    </StreamLayout>
  );
	
};

export default DownstreamWrap;