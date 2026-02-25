import React from 'react';
import Pref from '/public/pref.js';
import { branchesSort } from '/client/utility/Arrays.js';

import Slides from '/client/layouts/TaskBars/Slides';

import BranchesSlide from './appSlides/BranchesSlide';
import QtTaskSlide from './appSlides/QtTaskSlide';
import BehaviorSlide from './appSlides/BehaviorSlide';
import TrackStepSlide from './appSlides/TrackStepSlide';
import CounterSlide from './appSlides/CounterSlide';
import NCTypeSlide from './appSlides/NCTypeSlide';
import ScalesTagsSlide from './appSlides/ScalesTagsSlide';
import AddressSlide from './appSlides/AddressSlide';
import DataRepair from './appSlides/DataRepair';
import TimeErrorCheck from './appSlides/TimeErrorCheck';
import NotifySlide from './appSlides/NotifySlide';
import CRONSlide from './appSlides/CRONSlide';
import MetaSlide from './appSlides/MetaSlide';

const AppWrap = ({ isAdmin, isDebug, users, app })=> {
 
  const brancheS = branchesSort(app.branches);
 
  const sortedTrackOptions = app.trackOption.sort((t1, t2)=>
                          t1.step < t2.step ? -1 : t1.step > t2.step ? 1 : 0 );
  
  return(
    <div className='simpleContent locked'>
        
      <Slides
        menu={[
          <b><i className='fas fa-wave-square fa-fw gapR'></i>Flow Behavior</b>,
          <b><i className='fas fa-sitemap fa-fw gapR'></i>{Pref.branches}</b>,
          <b><i className='fas fa-gem fa-fw gapR'></i>Quality Time</b>,
          <b><i className='fas fa-shoe-prints fa-fw gapR'></i>Track Steps</b>,
          <b><i className='fas fa-stopwatch fa-fw gapR'></i>Counter Steps</b>,
          <b><i className='fas fa-times-circle fa-fw gapR'></i>NonCon Types</b>,
          <b><i className='fas fa-ruler-horizontal fa-fw gapR'></i>Scales & Tags</b>,
          <b><i className='fas fa-link fa-fw gapR'></i>Page Links</b>,
          <b><i className='fas fa-bell fa-fw gapR'></i>Notifications</b>,
          <b><i className='fas fa-robot fa-fw gapR'></i>CRON Jobs</b>,
          <b><i className='fas fa-alarm-clock fa-fw gapR'></i>Overtime Errors</b>,
          <b><i className='fas fa-toolbox fa-fw gapR'></i>Data Repair</b>
        ]}
        lowmenu={[<b><i className='fas fa-copyright fa-fw gapR'></i>Meta</b>]}
      >
          
        <BehaviorSlide key={0} app={app} />
        <BranchesSlide key={1} app={app} isDebug={isDebug} />
        <QtTaskSlide 
          key={2} 
          app={app} 
          branchesS={brancheS}
          isDebug={isDebug} />
        <TrackStepSlide 
          key={3}
          app={app}
          branchesS={brancheS}
          sorted={sortedTrackOptions} />
        <CounterSlide
          key={4}
          app={app}
          branchesS={brancheS} />
        <NCTypeSlide key={5} app={app} />
        <ScalesTagsSlide key={6} app={app} />
        <AddressSlide key={7} app={app} />
        <NotifySlide key={8} app={app} />
        <CRONSlide key={9} />
        <TimeErrorCheck key={10} />
        <DataRepair key={11} app={app} users={users} />
        <MetaSlide key={12} />
      </Slides>
			
    </div>
  );
};

export default AppWrap;