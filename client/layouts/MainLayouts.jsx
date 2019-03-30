import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorCatch from '/client/components/utilities/ErrorCatch.jsx';
import HomeIcon from '/client/components/uUi/HomeIcon.jsx';

export const PublicLayout = ({content, title}) => (
  <ErrorCatch>
  <div className='simpleContainer'>
    <div className='tenHeader'>
      <div className='topBorder' />
      <HomeIcon />
      <div className='frontCenterTitle'>
        {title}
      </div>
      <div className='rightSpace' />
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
    <div className='tenHeader'>
      <div className='topBorder' />
      <HomeIcon />
      <div className='frontCenterTitle'>
        {title}
      </div>
      <div className='rightSpace' />
    </div>
    {content}
  </div>
  </ErrorCatch>
);

export const CleanLayout = ({content}) => ( content );

export const LabelLayout = ({content}) => (
  <ErrorCatch>
  <div className='simpleContainer'>
    <div className='tenHeader noPrint'>
      <div className='topBorder' />
      <HomeIcon />
      <div className='frontCenterTitle'>
        Print Label
      </div>
      <div className='rightSpace' />
    </div>
    <div className='simpleContent'>
      <div className='wide noPrint'>
        <button
          className='smallAction clear'
          onClick={()=> window.history.back()}
        ><i className='fas fa-arrow-circle-left fa-lg'></i> Go Back</button>
      </div>
      <div className='printLabel'>
        {content}
      </div>
    </div>
  </div>
  </ErrorCatch>
);

    
