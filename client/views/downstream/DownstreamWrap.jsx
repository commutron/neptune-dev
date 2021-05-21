import React from 'react';
import Pref from '/client/global/pref.js';

import StreamLayout from '/client/layouts/StreamLayout.jsx';

import DownstreamView from '/client/views/downstream/DownstreamTask/DownstreamView';
import MonthlyReport from './MonthlyReport';
import WeeklyReport from './WeeklyReport';
import DailyReport from './DailyReport';
import TrendWrap from './DownTrends/TrendWrap';
import Outlook from './Outlook';

const DownstreamWrap = ({ 
  view, subLink, 
  traceDT,
  user, app,
  isDebug, isNightly
})=> {
  
  if(view === 'reportweek') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Weekly Completed'
        subLink={view}
        action={false}
        navBar='down'
      >
        <WeeklyReport
          app={app} />
      </StreamLayout>
    );
  }
  
  if(view === 'reportday') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Daily Completed'
        subLink={view}
        action={false}
        navBar='down'
      >
        <DailyReport 
          app={app}
          user={user}
          isDebug={isDebug}
        />
      </StreamLayout>
    );
  }
  
  if(view === 'reportmonths') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Monthly Completed'
        subLink={view}
        action={false}
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
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Trends'
        subLink={view}
        action={false}
        navBar='down'
      >
        <TrendWrap 
          app={app}
          isDebug={isDebug}
          isNightly={isNightly}
        />
      </StreamLayout>
    );
  }
  
  if(isNightly && view === 'outlook') {
    return (
      <StreamLayout
        user={user}
        app={app}
        title='Future Outlook'
        subLink={view}
        action={false}
        navBar='down'
      >
        <Outlook 
          traceDT={traceDT}
          app={app}
          user={user}
          isNightly={isNightly}
        />
      </StreamLayout>
    );
  }
  
  return (
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
        user={user}
        app={app}
        isDebug={isDebug}
        isNightly={isNightly}
      />
    </StreamLayout>
  );
	
};

export default DownstreamWrap;