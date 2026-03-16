import React from 'react';
import Pref from '/public/pref.js';
import { branchesSort } from '/client/utility/Arrays.js';

import Slides, { Slbutton } from '/client/layouts/TaskBars/Slides';

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
          <Slbutton name='Flow Behavior' icon='fa-wave-square' />,
          <Slbutton name={Pref.branches} icon='fa-sitemap' />,
          <Slbutton name='Quality Time' icon='fa-gem' />,
          <Slbutton name='Track Steps' icon='fa-shoe-prints' />,
          <Slbutton name='Counter Steps' icon='fa-stopwatch' />,
          <Slbutton name='NonCon Types' icon='fa-times-circle' />,
          <Slbutton name='Scales & Tags' icon='fa-ruler-horizontal' />,
          <Slbutton name='Page Links' icon='fa-link' />,
          <Slbutton name='Notifications' icon='fa-bell' />,
          <Slbutton name='CRON Jobs' icon='fa-robot' />,
          <Slbutton name='Overtime Errors' icon='fa-alarm-clock' />,
          <Slbutton name='Data Repair' icon='fa-toolbox' />,
        ]}
        lowmenu={[<Slbutton name='Meta' icon='fa-copyright' />]}
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