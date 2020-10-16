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
import ReasonsSlide from './appSlides/ReasonsSlide.jsx';
import NCTypeSlide from './appSlides/NCTypeSlide.jsx';
import ScalesSlide from './appSlides/ScalesSlide.jsx';
import TagSlide from './appSlides/TagSlide.jsx';
import AddressSlide from './appSlides/AddressSlide.jsx';
import ToastSlide from './appSlides/ToastSlide.jsx';
import PINSlide from './appSlides/PINSlide.jsx';

import DataRepair from './appSlides/DataRepair.jsx';

const AppWrap = ({ isAdmin, isDebug, users, app })=> {
  
  function requestAltFlowInfo() {
    Meteor.call('altFlowUse', (error, reply)=>{
      error && console.log(error);
      toast(<div>
        Total Batches: {reply.totalAltBatch} <br />
        Total Items: {reply.totalAltItems} <br />
        Live Batches: {reply.totalLiveBatch} <br />
        Live Items: {reply.totalLiveBatchItems} <br />
        Dormant Batches: {reply.totalDormantBatch} <br />
        Dormant Items: {reply.totalDormantBatchItems}
      </div>, { autoClose: false });
      console.log({ live: reply.aliveBatchInfo, dormant: reply.dormantBatchInfo});
    });
  }
  
  const sortedTrackOptions = app.trackOption.sort((t1, t2)=> {
                              if (t1.step < t2.step) { return -1 }
                              if (t1.step > t2.step) { return 1 }
                              return 0;
                            });
  
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
            <b><i className='fas fa-code-branch fa-fw'></i>   {Pref.branches}</b>,
            <b><i className='fas fa-shoe-prints fa-fw'></i>   Track Steps</b>,
            <b><i className='fas fa-stopwatch fa-fw'></i>   Counter Steps</b>,
            <b><i className='fas fa-wave-square fa-fw'></i>   Steps Behavior</b>,
            <b><i className='fas fa-dice fa-fw'></i>   Reasons Options</b>,
            <b><i className='fas fa-times-circle fa-fw'></i>   NonCon Types</b>,
            <b><i className='fas fa-ruler-horizontal fa-fw'></i>   Scales</b>,
            <b><i className='fas fa-tag fa-fw'></i>   Tags</b>,
            <b><i className='fas fa-link fa-fw'></i>   Addresses</b>,
            <b><i className='fas fa-key fa-fw'></i>   PINs</b>,//11
            <b><i className='fas fa-toolbox fa-fw'></i>  Data Repair</b>,//12
            <b><i className='fas fa-bell fa-fw'></i>  Test Alerts</b>,//13
            <b><i className='fas fa-life-ring fa-fw'></i>  Legacy Support</b>//14
          ]}>
          {/*extraClass='space5x5'>*/}
          
          <BranchesSlide key={0} app={app} isDebug={isDebug} />
          <TrackStepSlide key={1} app={app} sorted={sortedTrackOptions} />
          <CounterSlide key={2} app={app} />
          <BehaviorSlide key={3} app={app} />
          <ReasonsSlide key={4} app={app} />
          <NCTypeSlide key={5} app={app} />
          <ScalesSlide key={6} app={app} />
          <TagSlide key={7} app={app} />
          <AddressSlide key={8} app={app} />
          <PINSlide key={9} />
          <DataRepair key={10} app={app} users={users} />
          <ToastSlide key={11} />
          <div key={12} className='space3v'>
            <p>determine support needs</p>
            <p>
              <button
                className='action clearBlue invert'
                onClick={()=>requestAltFlowInfo()}
              >Info on Alt Flow Use</button>
            </p>
          </div>
          
        </Slides>
				
      </div>
    </div>
  );
};

export default AppWrap;