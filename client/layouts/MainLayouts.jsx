import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';
import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import Pref from '/client/global/pref.js';

import { ToastContainer } from 'react-toastify';

export const PublicLayout = ({content}) => (
  <ErrorCatch>
  <div className='simpleContainer'>
    <div className='tenHeader'>
      <div className='topBorder' />
      <HomeIcon />
      <div className='frontCenterTitle'>
        {Pref.neptuneIs}
      </div>
      <div className='auxRight' />
      <div className='proRight' />
    </div>
    <div className='simpleContent'>
      {content}
    </div>
  </div>
  </ErrorCatch>
);

export const SplashLayout = ({content, title}) => (
  <ErrorCatch>
    <div className='splashContainer'>
      <ToastContainer
        position="top-center"
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='frontCenterTitle'>
          {title}
        </div>
        <div className='auxRight' />
        <TideFollow />
      </div>
      {content}
    </div>
  </ErrorCatch>
);

export const CleanLayout = ({content}) => ( 
  <ErrorCatch> {content} </ErrorCatch> 
);

export const LabelLayout = ({content}) => (
  <ErrorCatch>
  <div className='simpleContainer'>
    <div className='tenHeader noPrint'>
      <div className='topBorder' />
      <HomeIcon />
      <div className='frontCenterTitle'>
        Print Label
      </div>
      <div className='auxRight' />
      <TideFollow />
    </div>
    <div className='simpleContent'>
      <div className='wide comfort indent indentR noPrint'>
        <button
          title="Go Back"
          className='taskLink'
          onClick={()=> window.history.back()}
        ><i className='fas fa-arrow-left'></i></button>
        <button
          title="Print Label"
          className='taskLink'
          onClick={()=> window.print()}
        ><i className='fas fa-print'></i></button>
      </div>
      <div className='printLabel'>
        {content}
      </div>
    </div>
  </div>
  </ErrorCatch>
);

    
