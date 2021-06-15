import React from 'react';
import Pref from '/client/global/pref.js';
import { ToastContainer } from 'react-toastify';
import { branchesSort } from '/client/utility/Arrays.js';
import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';

import Slides from '/client/components/smallUi/Slides';

import BranchesSlide from './appSlides/BranchesSlide';
import BehaviorSlide from './appSlides/BehaviorSlide';
import TrackStepSlide from './appSlides/TrackStepSlide';
import CounterSlide from './appSlides/CounterSlide';
import NCTypeSlide from './appSlides/NCTypeSlide';
import ScalesTagsSlide from './appSlides/ScalesTagsSlide';
import AddressSlide from './appSlides/AddressSlide';
import DataRepair from './appSlides/DataRepair';
import ToastSlide from './appSlides/ToastSlide';
import CRONSlide from './appSlides/CRONSlide';

const AppWrap = ({ isAdmin, isDebug, users, app })=> {
 
  const brancheS = branchesSort(app.branches);
 
  const sortedTrackOptions = app.trackOption.sort((t1, t2)=>
                          t1.step < t2.step ? -1 : t1.step > t2.step ? 1 : 0 );
  
  return(
    <div className='simpleContainer'>
      <ToastContainer
        position="top-center"
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='frontCenterTitle'>Settings</div>
        <div className='auxRight' />
        <TideFollow />
      </div>
    
      <div className='simpleContent locked'>
          
        <Slides
          menu={[
            <b><i className='fas fa-wave-square fa-fw gapR'></i>Flow Behavior</b>,
            <b><i className='fas fa-code-branch fa-fw gapR'></i>{Pref.branches}</b>,
            <b><i className='fas fa-shoe-prints fa-fw gapR'></i>Track Steps</b>,
            <b><i className='fas fa-stopwatch fa-fw gapR'></i>Counter Steps</b>,
            <b><i className='fas fa-times-circle fa-fw gapR'></i>NonCon Types</b>,
            <b><i className='fas fa-ruler-horizontal fa-fw gapR'></i>Scales & Tags</b>,
            <b><i className='fas fa-link fa-fw gapR'></i>Addresses</b>,
            <b><i className='fas fa-toolbox fa-fw gapR'></i>Data Repair</b>,
            <b><i className='fas fa-bell fa-fw gapR'></i>Test Alerts</b>,
            <b><i className='fas fa-robot fa-fw gapR'></i>CRON Jobs</b>
          ]}>
          
          <BehaviorSlide key={0} app={app} />
          <BranchesSlide key={1} app={app} isDebug={isDebug} />
          <TrackStepSlide 
            key={2}
            app={app}
            branchesS={brancheS}
            sorted={sortedTrackOptions} />
          <CounterSlide
            key={3}
            app={app}
            branchesS={brancheS} />
          <NCTypeSlide key={4} app={app} />
          <ScalesTagsSlide key={5} app={app} />
          <AddressSlide key={6} app={app} />
          <DataRepair key={7} app={app} users={users} />
          <ToastSlide key={8} />
          <CRONSlide key={9} />
          
        </Slides>
				
      </div>
    </div>
  );
};

export default AppWrap;