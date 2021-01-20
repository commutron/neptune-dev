import React from 'react';
import Pref from '/client/global/pref.js';
import { toast, ToastContainer } from 'react-toastify';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

import Slides from '../../components/smallUi/Slides.jsx';

import BranchesSlide from './appSlides/BranchesSlide.jsx';
import BehaviorSlide from './appSlides/BehaviorSlide.jsx';
import TrackStepSlide from './appSlides/TrackStepSlide.jsx';
import CounterSlide from './appSlides/CounterSlide.jsx';
import NCTypeSlide from './appSlides/NCTypeSlide.jsx';
import ScalesTagsSlide from './appSlides/ScalesTagsSlide.jsx';
import AddressSlide from './appSlides/AddressSlide.jsx';
import ToastSlide from './appSlides/ToastSlide.jsx';
import LegacySlide from './appSlides/LegacySlide.jsx';

import DataRepair from './appSlides/DataRepair.jsx';

const AppWrap = ({ isAdmin, isDebug, users, app })=> {
 
  
  const branchesS = app.branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  
  const sortedTrackOptions = app.trackOption.sort((t1, t2)=>
                          t1.step < t2.step ? -1 : t1.step > t2.step ? 1 : 0 );
  
  return(
    <div className='simpleContainer'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
            <b><i className='fas fa-wave-square fa-fw'></i>   Flow Behavior</b>,
            <b><i className='fas fa-code-branch fa-fw'></i>   {Pref.branches}</b>,
            <b><i className='fas fa-shoe-prints fa-fw'></i>   Track Steps</b>,
            <b><i className='fas fa-stopwatch fa-fw'></i>   Counter Steps</b>,
            <b><i className='fas fa-times-circle fa-fw'></i>   NonCon Types</b>,
            <b><i className='fas fa-ruler-horizontal fa-fw'></i>   Scales & Tags</b>,
            <b><i className='fas fa-link fa-fw'></i>   Addresses</b>,
            <b><i className='fas fa-toolbox fa-fw'></i>  Data Repair</b>,
            <b><i className='fas fa-bell fa-fw'></i>  Test Alerts</b>,
            <b><i className='fas fa-life-ring fa-fw'></i>  Legacy Support</b>
          ]}>
          
          <BehaviorSlide key={0} app={app} />
          <BranchesSlide key={1} app={app} isDebug={isDebug} />
          <TrackStepSlide 
            key={2}
            app={app}
            branchesS={branchesS}
            sorted={sortedTrackOptions} />
          <CounterSlide
            key={3}
            app={app}
            branchesS={branchesS} />
          <NCTypeSlide key={4} app={app} />
          <ScalesTagsSlide key={5} app={app} />
          <AddressSlide key={6} app={app} />
          <DataRepair key={7} app={app} users={users} />
          <ToastSlide key={8} />
          <LegacySlide key={9} />
          
        </Slides>
				
      </div>
    </div>
  );
};

export default AppWrap;