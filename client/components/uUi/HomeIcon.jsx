import React from 'react';
import Pref from '/client/global/pref.js';

const HomeIcon = () => {
  const user = Meteor.user() ? 'Signed in as: ' + Meteor.user().username : '';
  return(
    <div className='homeIcon'>
      <a className='homeIconLink' href='/' title={'Neptune v.' + Pref.neptuneVersion + '\n' + new Date() + '\n' + user}>
        <img
          src='/neptune-logo-white.svg'
          className='homeIconLogo' />
      </a>
    </div>
  );
};

export default HomeIcon;










