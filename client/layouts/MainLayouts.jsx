import { Meteor } from 'meteor/meteor';
import React from 'react';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';

export const PublicLayout = ({content, title}) => (
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
);

export const SplashLayout = ({content, title}) => (
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
);

export const CleanLayout = ({content}) => ( content );

export const LabelLayout = ({content}) => (
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
);

    
