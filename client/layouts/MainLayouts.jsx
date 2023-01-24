import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import ErrorCatch from '/client/layouts/ErrorCatch';
import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';

export const PublicLayout = ({content}) => (
  <PlainFrame title={Pref.neptuneIs} noToast={true}>
    <div className='simpleContent darkTheme forceScrollStyle'>
      {content}
    </div>
  </PlainFrame>
);

export const SplashLayout = ({content, title}) => (
  <PlainFrame title={title} container='splashContainer' noToast>
    {content}
  </PlainFrame>
);

export const CleanLayout = ({content}) => ( 
  <ErrorCatch> {content} </ErrorCatch>
);

export const PlainFrame = ({ title, tag, container, noToast, children })=> (
  <ErrorCatch>
    <div className={container || 'simpleContainer'}>
      <div className='tenHeader noPrint'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='frontCenterTitle cap'
        >{title}{tag && <sup className='vbig monoFont'>{tag}</sup>}
        </div>
        <div className='auxRight' />
        <TideFollow />
      </div>
      {children[0] || children}
    </div>
  </ErrorCatch>
);

export const LabelLayout = ({content}) => (
  <PlainFrame title='Print Label'>
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
      {content}
    </div>
  </PlainFrame>
);