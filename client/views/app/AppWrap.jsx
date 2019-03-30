import React from 'react';
import { ToastContainer } from 'react-toastify';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import AccountsManagePanel from './appPanels/AccountsManagePanel.jsx';

import Slides from '../../components/smallUi/Slides.jsx';

import TrackStepSlide from './appSlides/TrackStepSlide.jsx';
import CounterSlide from './appSlides/CounterSlide.jsx';
import FinishSlide from './appSlides/FinishSlide.jsx';
import MethodSlide from './appSlides/MethodSlide.jsx';
import RepeatSlide from './appSlides/RepeatSlide.jsx';
import NCLegacySlide from './appSlides/NCLegacySlide.jsx';
import NCTypeSlide from './appSlides/NCTypeSlide.jsx';
import NCSupportSlide from './appSlides/NCSupportSlide.jsx';
import SerialSlide from './appSlides/SerialSlide.jsx';
import TagSlide from './appSlides/TagSlide.jsx';
import AddressSlide from './appSlides/AddressSlide.jsx';
import PINSlide from './appSlides/PINSlide.jsx';

const AppWrap = ({ users, app })=> {
  
  const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  
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
        <div className='rightSpace' />
      </div>
    
      <div className='simpleContent locked'>
        
      {admin ?
          
        <Slides
          menu={[
            <b><i className='fas fa-users fa-fw'></i>   User Permissions</b>,
            <b><i className='fas fa-shoe-prints fa-fw'></i>   Track Steps</b>,
            <b><i className='fas fa-stopwatch fa-fw'></i>   Counter Steps</b>,
            <b><i className='fas fa-flag-checkered fa-fw'></i>   Finish Step</b>,
            <b><i className='fas fa-wrench fa-fw'></i>   Verify Methods</b>,
            <b><i className='fas fa-redo fa-fw'></i>   Verify Repeat</b>,
            <b><i className='fas fa-bug fa-fw'></i>   Legacy NonCons</b>,
            <b><i className='fas fa-bug fa-fw'></i>   NonCon Types</b>,
            <b><i className='fas fa-bug fa-fw'></i>   NonCon Support</b>,
            <b><i className='fas fa-qrcode fa-fw'></i>   Serial Numbers</b>,
            <b><i className='fas fa-tag fa-fw'></i>   Tags</b>,
            <b><i className='fas fa-link fa-fw'></i>   Addresses</b>,
            <b><i className='fas fa-key fa-fw'></i>   PINs</b>
          ]}>
          
          <AccountsManagePanel key={1} users={users} />
          
          <TrackStepSlide key={2} app={app} sorted={sortedTrackOptions} />
          <CounterSlide key={3} app={app} />
          <FinishSlide key={4} app={app} />
          <MethodSlide key={5} app={app} sorted={sortedTrackOptions} />
          <RepeatSlide key={6} app={app} />
          <NCLegacySlide key={7} app={app} />
          <NCTypeSlide key={8} app={app} />
          <NCSupportSlide key={9} app={app} />
          <SerialSlide key={10} app={app} />
          <TagSlide key={11} app={app} />
          <AddressSlide key={12} app={app} />
          <PINSlide key={13} />
          
        </Slides>
        
        :
        
          <p className='medBig centreText'>This page is limited to administrators only</p>
        
      }
				
      </div>
    </div>
  );
};

export default AppWrap;